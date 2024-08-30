use crate::{
    error::NO_CONNECTION_FOUND_MSG,
    grpc::{
        hakjdb_api::{
            DeleteAllKeysRequest, DeleteKeysRequest, GetAllKeysRequest, GetKeyTypeRequest,
        },
        insert_common_grpc_metadata, GrpcConnection, MD_KEY_DATABASE,
    },
};
use serde::Serialize;
use tauri::State;

#[derive(Serialize)]
pub struct GetKeyTypePayload {
    #[serde(rename = "keyType")]
    pub key_type: String,
    pub ok: bool,
}

#[tauri::command]
pub async fn get_all_keys(
    connection: State<'_, GrpcConnection>,
    db_name: &str,
) -> Result<Vec<String>, String> {
    let mut guard = connection.client.lock().await;
    if let Some(ref mut client) = *guard {
        let mut req = tonic::Request::new(GetAllKeysRequest {});
        insert_common_grpc_metadata(&connection, &mut req).await;
        req.metadata_mut()
            .insert(MD_KEY_DATABASE, db_name.parse().unwrap());

        let resp = client.general_kv_client.get_all_keys(req).await;
        match resp {
            Ok(resp) => {
                return Ok(resp.get_ref().keys.clone());
            }
            Err(e) => return Err(e.message().to_string()),
        }
    } else {
        return Err(NO_CONNECTION_FOUND_MSG.to_string());
    }
}

/// Returns the number of keys that were deleted.
#[tauri::command]
pub async fn delete_keys(
    connection: State<'_, GrpcConnection>,
    db_name: &str,
    keys: Vec<String>,
) -> Result<u32, String> {
    let mut guard = connection.client.lock().await;
    if let Some(ref mut client) = *guard {
        let mut req = tonic::Request::new(DeleteKeysRequest { keys });
        insert_common_grpc_metadata(&connection, &mut req).await;
        req.metadata_mut()
            .insert(MD_KEY_DATABASE, db_name.parse().unwrap());

        let resp = client.general_kv_client.delete_keys(req).await;
        match resp {
            Ok(resp) => {
                return Ok(resp.get_ref().keys_deleted_count);
            }
            Err(e) => return Err(e.message().to_string()),
        }
    } else {
        return Err(NO_CONNECTION_FOUND_MSG.to_string());
    }
}

#[tauri::command]
pub async fn delete_all_keys(
    connection: State<'_, GrpcConnection>,
    db_name: &str,
) -> Result<(), String> {
    let mut guard = connection.client.lock().await;
    if let Some(ref mut client) = *guard {
        let mut req = tonic::Request::new(DeleteAllKeysRequest {});
        insert_common_grpc_metadata(&connection, &mut req).await;
        req.metadata_mut()
            .insert(MD_KEY_DATABASE, db_name.parse().unwrap());

        let resp = client.general_kv_client.delete_all_keys(req).await;
        match resp {
            Ok(_) => return Ok(()),
            Err(e) => return Err(e.message().to_string()),
        }
    } else {
        return Err(NO_CONNECTION_FOUND_MSG.to_string());
    }
}

#[tauri::command]
pub async fn get_key_type(
    connection: State<'_, GrpcConnection>,
    db_name: &str,
    key: &str,
) -> Result<GetKeyTypePayload, String> {
    let mut guard = connection.client.lock().await;
    if let Some(ref mut client) = *guard {
        let mut req = tonic::Request::new(GetKeyTypeRequest {
            key: key.to_owned(),
        });
        insert_common_grpc_metadata(&connection, &mut req).await;
        req.metadata_mut()
            .insert(MD_KEY_DATABASE, db_name.parse().unwrap());

        let resp = client.general_kv_client.get_key_type(req).await;
        match resp {
            Ok(resp) => {
                return Ok(GetKeyTypePayload {
                    key_type: resp.get_ref().key_type.to_owned(),
                    ok: resp.get_ref().ok,
                });
            }
            Err(e) => return Err(e.message().to_string()),
        }
    } else {
        return Err(NO_CONNECTION_FOUND_MSG.to_string());
    }
}
