use crate::{
    grpc::{
        kvdb::{GetKeysRequest, GetStringRequest, SetStringRequest},
        GrpcConnection,
    },
    error::NO_CONNECTION_FOUND_MSG,
};
use serde::Serialize;
use tauri::State;

#[derive(Serialize)]
pub struct GetStringPayload {
    pub value: String,
    pub ok: bool,
}

#[tauri::command]
pub async fn get_keys(connection: State<'_, GrpcConnection>) -> Result<Vec<String>, String> {
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
        return Err(NO_CONNECTION_FOUND_MSG.to_string());
    }
}

#[tauri::command]
pub async fn get_string(
    connection: State<'_, GrpcConnection>,
    key: &str,
) -> Result<GetStringPayload, String> {
    let mut guard = connection.connection.lock().await;
    if let Some(ref mut connection) = *guard {
        let request = tonic::Request::new(GetStringRequest {
            key: key.to_owned(),
        });
        let response = connection.storage_client.get_string(request).await;
        match response {
            Ok(response) => {
                return Ok(GetStringPayload {
                    value: response.get_ref().value.to_owned(),
                    ok: response.get_ref().ok,
                });
            }
            Err(err) => return Err(format!("{}", err)),
        }
    } else {
        return Err(NO_CONNECTION_FOUND_MSG.to_string());
    }
}

#[tauri::command]
pub async fn set_string(
    connection: State<'_, GrpcConnection>,
    key: &str,
    value: &str,
) -> Result<(), String> {
    let mut guard = connection.connection.lock().await;
    if let Some(ref mut connection) = *guard {
        let request = tonic::Request::new(SetStringRequest {
            key: key.to_owned(),
            value: value.to_owned(),
        });
        let response = connection.storage_client.set_string(request).await;
        match response {
            Ok(_response) => return Ok(()),
            Err(err) => return Err(format!("{}", err)),
        }
    } else {
        return Err(NO_CONNECTION_FOUND_MSG.to_string());
    }
}
