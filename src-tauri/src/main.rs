// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::error::Error;
use app::{grpc::{
  kvdb::GetServerInfoRequest, GrpcClient, GrpcConnection
}, server::MemoryInfo};
use tauri::{CustomMenuItem, Menu, Submenu, State, Manager};
use app::server::{
  ClientInfo,
  ServerInfo,
  StorageInfo,
  GeneralInfo,
};

#[tauri::command]
fn greet(name: &str) -> String {
  format!("Hello, {}!", name)
}

#[tauri::command]
async fn connect(connection: State<'_, GrpcConnection>, host: &str, port: u16) -> Result<String, String> {
  match GrpcClient::new(host, port).await {
    Ok(client) => {
      *connection.connection.lock().await = Some(client);
      return Ok(format!("Connected to {}:{}", host, port));
    },
    Err(e) => return Err(e.to_string()),
  }
}

#[tauri::command]
async fn disconnect(connection: State<'_, GrpcConnection>) -> Result<(), String> {
  connection.connection.lock().await.take();
  println!("disconnected");

  Ok(())
}

#[tauri::command]
async fn get_server_info(connection: State<'_, GrpcConnection>) -> Result<serde_json::Value, String> {
    let mut guard = connection.connection.lock().await;
    if let Some(ref mut connection) = *guard {
        let request = tonic::Request::new(GetServerInfoRequest {});
        let response = connection.server_client.get_server_info(request).await;
        match response {
            Ok(response) => {
                let data = &response.get_ref().data;
                if let Some(data) = data {
                    let server_info = ServerInfo {
                      general_info: GeneralInfo {
                        kvdb_version: data.general_info.as_ref().unwrap().kvdb_version.clone(),
                        go_version: data.general_info.as_ref().unwrap().go_version.clone(),
                        db_count: data.general_info.as_ref().unwrap().db_count.to_string(),
                        os: data.general_info.as_ref().unwrap().os.clone(),
                        arch: data.general_info.as_ref().unwrap().arch.clone(),
                        process_id: data.general_info.as_ref().unwrap().process_id.to_string(),
                        uptime_seconds: data.general_info.as_ref().unwrap().uptime_seconds.to_string(),
                        tcp_port: data.general_info.as_ref().unwrap().tcp_port.to_string(),
                        tls_enabled: data.general_info.as_ref().unwrap().tls_enabled,
                        password_enabled: data.general_info.as_ref().unwrap().password_enabled,
                        logfile_enabled: data.general_info.as_ref().unwrap().logfile_enabled,
                        debug_enabled: data.general_info.as_ref().unwrap().debug_enabled,
                        default_db: data.general_info.as_ref().unwrap().default_db.clone(),
                      },
                      memory_info: MemoryInfo {
                        memory_alloc_mega_byte: bytes_to_mega(data.memory_info.as_ref().unwrap().memory_alloc).to_string(),
                        memory_total_alloc_mega_byte: bytes_to_mega(data.memory_info.as_ref().unwrap().memory_total_alloc).to_string(),
                        memory_sys_mega_byte: bytes_to_mega(data.memory_info.as_ref().unwrap().memory_sys).to_string(),
                      },
                      storage_info: StorageInfo {
                        total_data_size: data.storage_info.as_ref().unwrap().total_data_size.to_string(),
                        total_keys: data.storage_info.as_ref().unwrap().total_keys.to_string(),
                      },
                      client_info: ClientInfo {
                        client_connections: data.client_info.as_ref().unwrap().client_connections.to_string(),
                        max_client_connections: data.client_info.as_ref().unwrap().max_client_connections.to_string(),
                      }
                    };
                    
                    match serde_json::to_value(server_info) {
                      Ok(json) => return Ok(json),
                      Err(e) => return Err(format!("failed to convert data to JSON: {}", e)),
                    }
                }
            },
            Err(err) => return Err(format!("{}", err)),
        }
    } else {
        return Err("no connection found".to_string());
    }

    return Err("unexpected error".to_string());
}

fn bytes_to_mega(bytes: u64) -> f64 {
  return bytes as f64 / 1024.0 / 1024.0
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
  tauri::Builder::default()
    .menu(Menu::os_default("kvdb-gui")
      .add_submenu(Submenu::new("Connect", Menu::with_items([
        CustomMenuItem::new("new-connection", "New Connection").into(),
        CustomMenuItem::new("disconnect", "Disconnect").into(),
      ])))
    )
    .on_menu_event(|event| {
      match event.menu_item_id() {
        "new-connection" => {
          println!("Menu event -> New Connection");
          let _ = event.window().emit("new-connection", ());
        },
        "disconnect" => {
          println!("Menu event -> Disconnect");
          let _ = event.window().emit("disconnect", ());
        },
        _ => {}
      }
    })
    .setup(|app| {
      app.manage(GrpcConnection::new());

      Ok(())
    })
    .invoke_handler(tauri::generate_handler![greet, connect, disconnect, get_server_info])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");

  Ok(())
}
