use crate::{
    error::NO_CONNECTION_FOUND_MSG,
    grpc::{
        kvdb::{DeleteKeyRequest, GetKeysRequest, GetStringRequest, SetStringRequest},
        GrpcConnection, MD_KEY_DATABASE,
    },
};
use serde::Serialize;
use tauri::State;

#[derive(Serialize)]
pub struct GetStringPayload {
    pub value: String,
    pub ok: bool,
}

#[tauri::command]
pub async fn get_keys(
    connection: State<'_, GrpcConnection>,
    db_name: &str,
) -> Result<Vec<String>, String> {
    let mut guard = connection.connection.lock().await;
    if let Some(ref mut connection) = *guard {
        let mut request = tonic::Request::new(GetKeysRequest {});
        request
            .metadata_mut()
            .insert(MD_KEY_DATABASE, db_name.parse().unwrap());
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
    db_name: &str,
    key: &str,
) -> Result<GetStringPayload, String> {
    let mut guard = connection.connection.lock().await;
    if let Some(ref mut connection) = *guard {
        let mut request = tonic::Request::new(GetStringRequest {
            key: key.to_owned(),
        });
        request
            .metadata_mut()
            .insert(MD_KEY_DATABASE, db_name.parse().unwrap());
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
    db_name: &str,
    key: &str,
    value: &str,
) -> Result<(), String> {
    let mut guard = connection.connection.lock().await;
    if let Some(ref mut connection) = *guard {
        let mut request = tonic::Request::new(SetStringRequest {
            key: key.to_owned(),
            value: value.to_owned(),
        });
        request
            .metadata_mut()
            .insert(MD_KEY_DATABASE, db_name.parse().unwrap());
        let response = connection.storage_client.set_string(request).await;
        match response {
            Ok(_response) => return Ok(()),
            Err(err) => return Err(format!("{}", err)),
        }
    } else {
        return Err(NO_CONNECTION_FOUND_MSG.to_string());
    }
}

#[tauri::command]
pub async fn delete_key(
    connection: State<'_, GrpcConnection>,
    db_name: &str,
    keys: Vec<String>,
) -> Result<u32, String> {
    let mut guard = connection.connection.lock().await;
    if let Some(ref mut connection) = *guard {
        let mut request = tonic::Request::new(DeleteKeyRequest { keys });
        request
            .metadata_mut()
            .insert(MD_KEY_DATABASE, db_name.parse().unwrap());
        let response = connection.storage_client.delete_key(request).await;
        match response {
            Ok(response) => {
                return Ok(response.get_ref().keys_deleted);
            }
            Err(err) => return Err(format!("{}", err)),
        }
    } else {
        return Err(NO_CONNECTION_FOUND_MSG.to_string());
    }
}
