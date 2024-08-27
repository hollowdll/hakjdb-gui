use crate::{
    error::NO_CONNECTION_FOUND_MSG,
    grpc::{
        hakjdb_api::{
            DeleteHashMapFieldsRequest, GetAllHashMapFieldsAndValuesRequest,
            GetHashMapFieldValuesRequest, SetHashMapRequest,
        },
        insert_common_grpc_metadata, GrpcConnection, MD_KEY_DATABASE,
    },
};
use serde::Serialize;
use std::collections::HashMap;
use tauri::State;

#[derive(Serialize)]
pub struct GetAllHashMapFieldsAndValuesPayload {
    #[serde(rename = "fieldValueMap")]
    pub field_value_map: HashMap<String, Vec<u8>>,
    pub ok: bool,
}

#[derive(Serialize)]
pub struct HashMapFieldValuePayload {
    pub value: Vec<u8>,
    pub ok: bool,
}

#[derive(Serialize)]
pub struct GetHashMapFieldValuesPayload {
    #[serde(rename = "fieldValueMap")]
    pub field_value_map: HashMap<String, HashMapFieldValuePayload>,
    pub ok: bool,
}

#[derive(Serialize)]
pub struct DeleteHashMapFieldsPayload {
    #[serde(rename = "fieldsRemoved")]
    pub fields_removed_count: u32,
    pub ok: bool,
}

#[tauri::command]
pub async fn set_hashmap(
    connection: State<'_, GrpcConnection>,
    db_name: &str,
    key: &str,
    field_value_map: HashMap<String, Vec<u8>>,
) -> Result<u32, String> {
    let mut guard = connection.client.lock().await;
    if let Some(ref mut client) = *guard {
        let mut req = tonic::Request::new(SetHashMapRequest {
            key: key.to_owned(),
            field_value_map,
        });
        insert_common_grpc_metadata(&connection, &mut req).await;
        req.metadata_mut()
            .insert(MD_KEY_DATABASE, db_name.parse().unwrap());

        let resp = client.hashmap_kv_client.set_hash_map(req).await;
        match resp {
            Ok(resp) => {
                return Ok(resp.get_ref().fields_added_count);
            }
            Err(e) => return Err(e.to_string()),
        }
    } else {
        return Err(NO_CONNECTION_FOUND_MSG.to_string());
    }
}

#[tauri::command]
pub async fn get_all_hashmap_fields_and_values(
    connection: State<'_, GrpcConnection>,
    db_name: &str,
    key: &str,
) -> Result<GetAllHashMapFieldsAndValuesPayload, String> {
    let mut guard = connection.client.lock().await;
    if let Some(ref mut client) = *guard {
        let mut req = tonic::Request::new(GetAllHashMapFieldsAndValuesRequest {
            key: key.to_owned(),
        });
        insert_common_grpc_metadata(&connection, &mut req).await;
        req.metadata_mut()
            .insert(MD_KEY_DATABASE, db_name.parse().unwrap());

        let resp = client
            .hashmap_kv_client
            .get_all_hash_map_fields_and_values(req)
            .await;
        match resp {
            Ok(resp) => {
                return Ok(GetAllHashMapFieldsAndValuesPayload {
                    field_value_map: resp.get_ref().field_value_map.clone(),
                    ok: resp.get_ref().ok,
                });
            }
            Err(e) => return Err(e.to_string()),
        }
    } else {
        return Err(NO_CONNECTION_FOUND_MSG.to_string());
    }
}

#[tauri::command]
pub async fn delete_hashmap_fields(
    connection: State<'_, GrpcConnection>,
    db_name: &str,
    key: &str,
    fields: Vec<String>,
) -> Result<DeleteHashMapFieldsPayload, String> {
    let mut guard = connection.client.lock().await;
    if let Some(ref mut client) = *guard {
        let mut req = tonic::Request::new(DeleteHashMapFieldsRequest {
            key: key.to_owned(),
            fields,
        });
        insert_common_grpc_metadata(&connection, &mut req).await;
        req.metadata_mut()
            .insert(MD_KEY_DATABASE, db_name.parse().unwrap());

        let resp = client.hashmap_kv_client.delete_hash_map_fields(req).await;
        match resp {
            Ok(resp) => {
                return Ok(DeleteHashMapFieldsPayload {
                    fields_removed_count: resp.get_ref().fields_removed_count,
                    ok: resp.get_ref().ok,
                });
            }
            Err(e) => return Err(e.to_string()),
        }
    } else {
        return Err(NO_CONNECTION_FOUND_MSG.to_string());
    }
}

#[tauri::command]
pub async fn get_hashmap_field_values(
    connection: State<'_, GrpcConnection>,
    db_name: &str,
    key: &str,
    fields: Vec<String>,
) -> Result<GetHashMapFieldValuesPayload, String> {
    let mut guard = connection.client.lock().await;
    if let Some(ref mut client) = *guard {
        let mut req = tonic::Request::new(GetHashMapFieldValuesRequest {
            key: key.to_owned(),
            fields,
        });
        insert_common_grpc_metadata(&connection, &mut req).await;
        req.metadata_mut()
            .insert(MD_KEY_DATABASE, db_name.parse().unwrap());

        let resp = client
            .hashmap_kv_client
            .get_hash_map_field_values(req)
            .await;
        match resp {
            Ok(resp) => {
                let mut field_values: HashMap<String, HashMapFieldValuePayload> = HashMap::new();
                for (field, value) in resp.get_ref().field_value_map.iter() {
                    field_values.insert(
                        field.to_owned(),
                        HashMapFieldValuePayload {
                            value: value.value.clone(),
                            ok: value.ok,
                        },
                    );
                }
                return Ok(GetHashMapFieldValuesPayload {
                    field_value_map: field_values,
                    ok: resp.get_ref().ok,
                });
            }
            Err(e) => return Err(e.to_string()),
        }
    } else {
        return Err(NO_CONNECTION_FOUND_MSG.to_string());
    }
}
