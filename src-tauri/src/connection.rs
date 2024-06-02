use crate::grpc::{
    GrpcConnection,
    GrpcClient,
};
use tauri::State;

#[tauri::command]
pub async fn connect(
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
pub async fn disconnect(connection: State<'_, GrpcConnection>) -> Result<(), String> {
    connection.connection.lock().await.take();
    println!("disconnected");

    Ok(())
}