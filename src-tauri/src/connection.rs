use crate::grpc::{ClientCertConfig, ClientCertPaths, GrpcClient, GrpcConnection};
use std::{fs, path::PathBuf, str::FromStr};
use tauri::api::dialog::blocking::FileDialogBuilder;
use tauri::State;

#[tauri::command]
pub async fn connect(
    connection: State<'_, GrpcConnection>,
    host: &str,
    port: u16,
) -> Result<String, String> {
    if let Some(ref ca_cert_path) = *connection.tls_ca_cert_path.lock().await {
        let ca_pem = match fs::read_to_string(ca_cert_path) {
            Ok(pem) => pem,
            Err(e) => return Err(e.to_string()),
        };

        let mut client_cert_cfg: Option<ClientCertConfig> = None;
        if let Some(ref client_cert_paths) = *connection.tls_client_cert_paths.lock().await {
            let client_cert_pem =
                match fs::read_to_string(client_cert_paths.public_key_path.as_path()) {
                    Ok(pem) => pem,
                    Err(e) => return Err(e.to_string()),
                };
            let client_key_pem =
                match fs::read_to_string(client_cert_paths.private_key_path.as_path()) {
                    Ok(pem) => pem,
                    Err(e) => return Err(e.to_string()),
                };
            client_cert_cfg = Some(ClientCertConfig {
                client_cert_pem,
                client_key_pem,
            });
        }

        match GrpcClient::new_secure(host, port, &ca_pem, client_cert_cfg).await {
            Ok(client) => {
                *connection.client.lock().await = Some(client);
                return Ok(format!("Connected to {}:{} with TLS", host, port));
            }
            Err(e) => return Err(e.to_string()),
        }
    } else {
        match GrpcClient::new_insecure(host, port).await {
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
pub async fn reset_auth_token(connection: State<'_, GrpcConnection>) -> Result<(), String> {
    connection.reset_auth_token().await;
    Ok(())
}

#[tauri::command]
pub async fn set_tls_ca_cert(
    connection: State<'_, GrpcConnection>,
    disable: bool,
    ca_cert_path: &str,
) -> Result<(), String> {
    if disable {
        *connection.tls_ca_cert_path.lock().await = None;
    } else {
        match PathBuf::from_str(ca_cert_path) {
            Ok(path) => *connection.tls_ca_cert_path.lock().await = Some(path),
            Err(e) => return Err(e.to_string()),
        }
    }

    Ok(())
}

#[tauri::command]
pub async fn set_tls_client_cert_auth(
    connection: State<'_, GrpcConnection>,
    disable: bool,
    client_cert_path: &str,
    client_key_path: &str,
) -> Result<(), String> {
    if disable {
        *connection.tls_client_cert_paths.lock().await = None;
    } else {
        let public_key_path = match PathBuf::from_str(client_cert_path) {
            Ok(path) => path,
            Err(e) => return Err(e.to_string()),
        };
        let private_key_path = match PathBuf::from_str(client_key_path) {
            Ok(path) => path,
            Err(e) => return Err(e.to_string()),
        };
        *connection.tls_client_cert_paths.lock().await = Some(ClientCertPaths {
            public_key_path,
            private_key_path,
        })
    }

    Ok(())
}

/// Opens system file explorer dialog for file selection.
/// Returns the path of the selected file.
#[tauri::command]
pub async fn open_file() -> Option<String> {
    if let Some(file_path) = FileDialogBuilder::new().pick_file() {
        return Some(file_path.to_string_lossy().into_owned());
    } else {
        return None;
    }
}
