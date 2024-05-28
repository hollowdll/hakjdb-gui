// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::error::Error;
use app::{db::{DatabaseInfoPayload, GetDatabasesPayload}, grpc::{
  kvdb::{
    GetAllDatabasesRequest,
    GetDatabaseInfoRequest,
    GetLogsRequest,
    GetServerInfoRequest,
    CreateDatabaseRequest,
    DeleteDatabaseRequest,
  }, GrpcClient, GrpcConnection,
}, server::{
  ClientInfoPayload,
  GeneralInfoPayload,
  MemoryInfoPayload,
  ServerInfoPayload,
  ServerLogsPayload,
  StorageInfoPayload,
}, util::{bytes_to_mega, prost_timestamp_to_iso8601}};
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
async fn disconnect(connection: State<'_, GrpcConnection>) -> Result<(), String> {
  connection.connection.lock().await.take();
  println!("disconnected");

  Ok(())
}

#[tauri::command]
async fn get_server_info(connection: State<'_, GrpcConnection>) -> Result<ServerInfoPayload, String> {
    let mut guard = connection.connection.lock().await;
    if let Some(ref mut connection) = *guard {
        let request = tonic::Request::new(GetServerInfoRequest {});
        let response = connection.server_client.get_server_info(request).await;
        match response {
            Ok(response) => {
                if let Some(data) = &response.get_ref().data {
                    return Ok(ServerInfoPayload {
                      general_info: GeneralInfoPayload {
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
                      memory_info: MemoryInfoPayload {
                        memory_alloc_mega_byte: bytes_to_mega(data.memory_info.as_ref().unwrap().memory_alloc).to_string(),
                        memory_total_alloc_mega_byte: bytes_to_mega(data.memory_info.as_ref().unwrap().memory_total_alloc).to_string(),
                        memory_sys_mega_byte: bytes_to_mega(data.memory_info.as_ref().unwrap().memory_sys).to_string(),
                      },
                      storage_info: StorageInfoPayload {
                        total_data_size: data.storage_info.as_ref().unwrap().total_data_size.to_string(),
                        total_keys: data.storage_info.as_ref().unwrap().total_keys.to_string(),
                      },
                      client_info: ClientInfoPayload {
                        client_connections: data.client_info.as_ref().unwrap().client_connections.to_string(),
                        max_client_connections: data.client_info.as_ref().unwrap().max_client_connections.to_string(),
                      }
                    });
                }
            },
            Err(err) => return Err(format!("{}", err)),
        }
    } else {
        return Err("no connection found".to_string());
    }

    return Err("unexpected error".to_string());
}

#[tauri::command]
async fn get_server_logs(connection: State<'_, GrpcConnection>) -> Result<ServerLogsPayload, String> {
  let mut guard = connection.connection.lock().await;
  if let Some(ref mut connection) = *guard {
    let request = tonic::Request::new(GetLogsRequest {});
    let response = connection.server_client.get_logs(request).await;
    match response {
      Ok(response) => {
        return Ok(ServerLogsPayload {
          logs: response.get_ref().logs.clone(),
        });
      },
      Err(err) => return Err(format!("{}", err)),
    }
  } else {
    return Err("no connection found".to_string());
  }
}

#[tauri::command]
async fn get_all_databases(connection: State<'_, GrpcConnection>) -> Result<GetDatabasesPayload, String> {
  let mut guard = connection.connection.lock().await;
  if let Some(ref mut connection) = *guard {
    let request = tonic::Request::new(GetAllDatabasesRequest {});
    let response = connection.database_client.get_all_databases(request).await;
    match response {
      Ok(response) => {
        return Ok(GetDatabasesPayload {
          db_names: response.get_ref().db_names.clone(),
        });
      },
      Err(err) => return Err(format!("{}", err)),
    }
  } else {
    return Err("no connection found".to_string());
  }
}

#[tauri::command]
async fn get_database_info(connection: State<'_, GrpcConnection>, db_name: &str) -> Result<DatabaseInfoPayload, String> {
  let mut guard = connection.connection.lock().await;
  if let Some(ref mut connection) = *guard {
    let request = tonic::Request::new(GetDatabaseInfoRequest {db_name: db_name.to_owned()});
    let response = connection.database_client.get_database_info(request).await;
    match response {
      Ok(response) => {
        if let Some(data) = &response.get_ref().data {
          return Ok(DatabaseInfoPayload {
            name: data.name.to_owned(),
            created_at: prost_timestamp_to_iso8601(data.created_at.as_ref().unwrap()),
            updated_at: prost_timestamp_to_iso8601(data.updated_at.as_ref().unwrap()),
            data_size: data.data_size.to_string(),
            key_count: data.key_count.to_string(),
          });
        }
      },
      Err(err) => return Err(format!("{}", err)),
    }
  } else {
    return Err("no connection found".to_string());
  }

  return Err("unexpected error".to_string());
}

/// Creates a new database. Returns the name of the created database.
#[tauri::command]
async fn create_database(connection: State<'_, GrpcConnection>, db_name: &str) -> Result<String, String> {
  let mut guard = connection.connection.lock().await;
  if let Some(ref mut connection) = *guard {
    let request = tonic::Request::new(CreateDatabaseRequest {db_name: db_name.to_owned()});
    let response = connection.database_client.create_database(request).await;
    match response {
      Ok(response) => return Ok(response.get_ref().db_name.clone()),
      Err(err) => return Err(format!("{}", err)),
    }
  } else {
    return Err("no connection found".to_string());
  }
}

/// Deletes a database. Returns the name of the deleted database.
#[tauri::command]
async fn delete_database(connection: State<'_, GrpcConnection>, db_name: &str) -> Result<String, String> {
  let mut guard = connection.connection.lock().await;
  if let Some(ref mut connection) = *guard {
    let request = tonic::Request::new(DeleteDatabaseRequest {db_name: db_name.to_owned()});
    let response = connection.database_client.delete_database(request).await;
    match response {
      Ok(response) => return Ok(response.get_ref().db_name.clone()),
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
    .invoke_handler(tauri::generate_handler![
      greet,
      connect,
      disconnect,
      get_server_info,
      get_server_logs,
      get_all_databases,
      get_database_info,
      create_database,
      delete_database
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");

  Ok(())
}
