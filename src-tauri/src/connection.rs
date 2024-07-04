use crate::grpc::{GrpcClient, GrpcConnection};
use tauri::State;

#[tauri::command]
pub async fn connect(
    connection: State<'_, GrpcConnection>,
    host: &str,
    port: u16,
) -> Result<String, String> {
    match GrpcClient::new(host, port).await {
        Ok(client) => {
            *connection.client.lock().await = Some(client);
            return Ok(format!("Connected to {}:{}", host, port));
        }
        Err(e) => return Err(e.to_string()),
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
