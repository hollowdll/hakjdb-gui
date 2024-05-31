// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use app::{
    db::{DatabaseInfoPayload, GetDatabasesPayload},
    grpc::{
        kvdb::{
            CreateDatabaseRequest, DeleteDatabaseRequest, GetAllDatabasesRequest,
            GetDatabaseInfoRequest,
        },
        GrpcClient, GrpcConnection,
    },
    server::{__cmd__get_server_info, __cmd__get_server_logs, get_server_info, get_server_logs},
    util::prost_timestamp_to_iso8601,
};
use std::error::Error;
use tauri::{CustomMenuItem, Manager, Menu, State, Submenu};

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}

#[tauri::command]
async fn connect(
    connection: State<'_, GrpcConnection>,
    host: &str,
    port: u16,
) -> Result<String, String> {
    match GrpcClient::new(host, port).await {
        Ok(client) => {
            *connection.connection.lock().await = Some(client);
            return Ok(format!("Connected to {}:{}", host, port));
        }
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
async fn get_all_databases(
    connection: State<'_, GrpcConnection>,
) -> Result<GetDatabasesPayload, String> {
    let mut guard = connection.connection.lock().await;
    if let Some(ref mut connection) = *guard {
        let request = tonic::Request::new(GetAllDatabasesRequest {});
        let response = connection.database_client.get_all_databases(request).await;
        match response {
            Ok(response) => {
                return Ok(GetDatabasesPayload {
                    db_names: response.get_ref().db_names.clone(),
                });
            }
            Err(err) => return Err(format!("{}", err)),
        }
    } else {
        return Err("no connection found".to_string());
    }
}

#[tauri::command]
async fn get_database_info(
    connection: State<'_, GrpcConnection>,
    db_name: &str,
) -> Result<DatabaseInfoPayload, String> {
    let mut guard = connection.connection.lock().await;
    if let Some(ref mut connection) = *guard {
        let request = tonic::Request::new(GetDatabaseInfoRequest {
            db_name: db_name.to_owned(),
        });
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
            }
            Err(err) => return Err(format!("{}", err)),
        }
    } else {
        return Err("no connection found".to_string());
    }

    return Err("unexpected error".to_string());
}

/// Creates a new database. Returns the name of the created database.
#[tauri::command]
async fn create_database(
    connection: State<'_, GrpcConnection>,
    db_name: &str,
) -> Result<String, String> {
    let mut guard = connection.connection.lock().await;
    if let Some(ref mut connection) = *guard {
        let request = tonic::Request::new(CreateDatabaseRequest {
            db_name: db_name.to_owned(),
        });
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
async fn delete_database(
    connection: State<'_, GrpcConnection>,
    db_name: &str,
) -> Result<String, String> {
    let mut guard = connection.connection.lock().await;
    if let Some(ref mut connection) = *guard {
        let request = tonic::Request::new(DeleteDatabaseRequest {
            db_name: db_name.to_owned(),
        });
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
        .menu(Menu::os_default("kvdb-gui").add_submenu(Submenu::new(
            "Connect",
            Menu::with_items([
                CustomMenuItem::new("new-connection", "New Connection").into(),
                CustomMenuItem::new("disconnect", "Disconnect").into(),
            ]),
        )))
        .on_menu_event(|event| match event.menu_item_id() {
            "new-connection" => {
                println!("Menu event -> New Connection");
                let _ = event.window().emit("new-connection", ());
            }
            "disconnect" => {
                println!("Menu event -> Disconnect");
                let _ = event.window().emit("disconnect", ());
            }
            _ => {}
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
