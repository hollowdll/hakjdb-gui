use crate::grpc::{GrpcClient, GrpcConnection};
use std::{path::PathBuf, str::FromStr};
use tauri::api::dialog::blocking::FileDialogBuilder;
use tauri::State;

#[tauri::command]
pub async fn connect(
    connection: State<'_, GrpcConnection>,
    host: &str,
    port: u16,
) -> Result<String, String> {
    if let Some(ref cert_path) = *connection.tls_cert_path.lock().await {
        let pem = match std::fs::read_to_string(cert_path) {
            Ok(pem) => pem,
            Err(e) => return Err(e.to_string()),
        };

        match GrpcClient::with_tls(host, port, &pem).await {
            Ok(client) => {
                *connection.client.lock().await = Some(client);
                return Ok(format!("Connected to {}:{} with TLS", host, port));
            }
            Err(e) => return Err(e.to_string()),
        }
    } else {
        match GrpcClient::new(host, port).await {
            Ok(client) => {
                *connection.client.lock().await = Some(client);
                return Ok(format!("Connected to {}:{} without TLS", host, port));
            }
            Err(e) => return Err(e.to_string()),
        }
    }
}

#[tauri::command]
pub async fn disconnect(connection: State<'_, GrpcConnection>) -> Result<(), String> {
    connection.client.lock().await.take();
    println!("disconnected");

    Ok(())
}

#[tauri::command]
pub async fn set_password(
    connection: State<'_, GrpcConnection>,
    password: &str,
    disable: bool,
) -> Result<(), String> {
    if disable {
        *connection.password.lock().await = None;
    } else {
        *connection.password.lock().await = Some(password.to_owned());
    }

    Ok(())
}

#[tauri::command]
pub async fn set_tls_cert_path(
    connection: State<'_, GrpcConnection>,
    cert_path: &str,
    disable: bool,
) -> Result<(), String> {
    if disable {
        *connection.tls_cert_path.lock().await = None;
    } else {
        match PathBuf::from_str(cert_path) {
            Ok(path) => *connection.tls_cert_path.lock().await = Some(path),
            Err(e) => return Err(e.to_string()),
        }
    }

    Ok(())
}

#[tauri::command]
pub async fn open_file() -> Option<String> {
    if let Some(file_path) = FileDialogBuilder::new().pick_file() {
        return Some(file_path.to_string_lossy().into_owned());
    } else {
        return None;
    }
}
