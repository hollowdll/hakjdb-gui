use crate::{
    error::NO_CONNECTION_FOUND_MSG,
    grpc::{
        hakjdb_api::{GetStringRequest, SetStringRequest},
        insert_common_grpc_metadata, GrpcConnection, MD_KEY_DATABASE,
    },
};
use serde::Serialize;
use tauri::State;

#[derive(Serialize)]
pub struct GetStringPayload {
    pub value: Vec<u8>,
    pub ok: bool,
}

#[tauri::command]
pub async fn get_string(
    connection: State<'_, GrpcConnection>,
    db_name: &str,
    key: &str,
) -> Result<GetStringPayload, String> {
    let mut guard = connection.client.lock().await;
    if let Some(ref mut client) = *guard {
        let mut req = tonic::Request::new(GetStringRequest {
            key: key.to_owned(),
        });
        insert_common_grpc_metadata(&connection, &mut req).await;
        req.metadata_mut()
            .insert(MD_KEY_DATABASE, db_name.parse().unwrap());

        let resp = client.string_kv_client.get_string(req).await;
        match resp {
            Ok(resp) => {
                return Ok(GetStringPayload {
                    value: resp.get_ref().value.clone(),
                    ok: resp.get_ref().ok,
                });
            }
            Err(e) => return Err(e.message().to_string()),
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
    value: Vec<u8>,
) -> Result<(), String> {
    let mut guard = connection.client.lock().await;
    if let Some(ref mut client) = *guard {
        let mut req = tonic::Request::new(SetStringRequest {
            key: key.to_owned(),
            value: value.to_owned(),
        });
        insert_common_grpc_metadata(&connection, &mut req).await;
        req.metadata_mut()
            .insert(MD_KEY_DATABASE, db_name.parse().unwrap());

        let resp = client.string_kv_client.set_string(req).await;
        match resp {
            Ok(_) => return Ok(()),
            Err(e) => return Err(e.message().to_string()),
        }
    } else {
        return Err(NO_CONNECTION_FOUND_MSG.to_string());
    }
}
