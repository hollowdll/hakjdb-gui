// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::error::Error;
use app::grpc::{
  GrpcClient,
  GrpcConnection,
  kvdb::GetServerInfoRequest,
};
use tauri::{CustomMenuItem, Menu, Submenu, State, Manager};

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
async fn get_server_info(connection: State<'_, GrpcConnection>) -> Result<serde_json::Value, String> {
    let mut guard = connection.connection.lock().await;
    if let Some(ref mut connection) = *guard {
        let request = tonic::Request::new(GetServerInfoRequest {});
        let response = connection.server_client.get_server_info(request).await;
        match response {
            Ok(response) => {
                let data = &response.get_ref().data;
                if let Some(data) = data {
                    let json = serde_json::json!({
                        "kvdbVersion": data.kvdb_version
                    });
                    return Ok(json);
                } else {
                    return Ok(serde_json::json!({}));
                }
            },
            Err(err) => return Err(format!("{}", err)),
        }
    } else {
        return Err("no connection found".to_string());
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
  tauri::Builder::default()
    .menu(Menu::os_default("kvdb-gui")
      .add_submenu(Submenu::new("Connect", Menu::with_items([
        CustomMenuItem::new("new-connection", "New connection").into(),
        CustomMenuItem::new("disconnect", "Disconnect").into(),
      ])))
    )
    .on_menu_event(|event| {
      match event.menu_item_id() {
        "new-connection" => {
          println!("Menu event -> New connection");
          let _ = event.window().emit("new-connection", ());
        },
        "disconnect" => println!("Menu event -> Disconnect"),
        _ => {}
      }
    })
    .setup(|app| {
      app.manage(GrpcConnection::new());

      Ok(())
    })
    .invoke_handler(tauri::generate_handler![greet, connect, get_server_info])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");

  Ok(())
}
