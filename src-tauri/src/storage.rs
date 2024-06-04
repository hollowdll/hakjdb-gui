use crate::grpc::{
    kvdb::{
        GetKeysRequest, SetStringRequest, GetStringRequest,
    },
    GrpcConnection,
};
use tauri::State;

#[tauri::command]
pub async fn get_keys(
    connection: State<'_, GrpcConnection>,
) -> Result<Vec<String>, String> {
    let mut guard = connection.connection.lock().await;
    if let Some(ref mut connection) = *guard {
        let request = tonic::Request::new(GetKeysRequest {});
        let response = connection.storage_client.get_keys(request).await;
        match response {
            Ok(response) => {
                return Ok(response.get_ref().keys.clone());
            }
            Err(err) => return Err(format!("{}", err)),
        }
    } else {
        return Err("no connection found".to_string());
    }
}