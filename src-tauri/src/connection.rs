use std::{path::PathBuf, str::FromStr};

use crate::grpc::{GrpcClient, GrpcConnection};
use tauri::State;

#[tauri::command]
pub async fn connect(
    connection: State<'_, GrpcConnection>,
    host: &str,
    port: u16,
) -> Result<String, String> {
    if let Some(ref pem_path) = *connection.tls_pem_path.lock().await {
        let pem = match std::fs::read_to_string(pem_path) {
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
pub async fn set_tls_pem_path(
    connection: State<'_, GrpcConnection>,
    pem_path: &str,
    disable: bool,
) -> Result<(), String> {
    if disable {
        *connection.tls_pem_path.lock().await = None;
    } else {
        match PathBuf::from_str(pem_path) {
            Ok(path) => *connection.tls_pem_path.lock().await = Some(path),
            Err(e) => return Err(e.to_string()),
        }
    }

    Ok(())
}
