use crate::{
    error::NO_CONNECTION_FOUND_MSG,
    grpc::{
        insert_common_grpc_metadata,
        kvdb::{
            DeleteHashMapFieldsRequest, GetAllHashMapFieldsAndValuesRequest,
            GetHashMapFieldValueRequest, SetHashMapRequest,
        },
        GrpcConnection, MD_KEY_DATABASE,
    },
};
use serde::Serialize;
use std::collections::HashMap;
use tauri::State;

#[derive(Serialize)]
pub struct GetAllHashMapFieldsAndValuesPayload {
    #[serde(rename = "fieldValueMap")]
    pub field_value_map: HashMap<String, String>,
    pub ok: bool,
}

#[derive(Serialize)]
pub struct HashMapFieldValuePayload {
    pub value: String,
    pub ok: bool,
}

#[derive(Serialize)]
pub struct GetHashMapFieldValuePayload {
    #[serde(rename = "fieldValueMap")]
    pub field_value_map: HashMap<String, HashMapFieldValuePayload>,
    pub ok: bool,
}

#[derive(Serialize)]
pub struct DeleteHashMapFieldsPayload {
    #[serde(rename = "fieldsRemoved")]
    pub fields_removed: u32,
    pub ok: bool,
}

#[tauri::command]
pub async fn set_hashmap(
    connection: State<'_, GrpcConnection>,
    db_name: &str,
    key: &str,
    field_value_map: HashMap<String, String>,
) -> Result<u32, String> {
    let mut guard = connection.client.lock().await;
    if let Some(ref mut client) = *guard {
        let mut request = tonic::Request::new(SetHashMapRequest {
            key: key.to_owned(),
            fields: field_value_map,
        });
        insert_common_grpc_metadata(&connection, &mut request).await;
        request
            .metadata_mut()
            .insert(MD_KEY_DATABASE, db_name.parse().unwrap());

        let response = client.storage_client.set_hash_map(request).await;
        match response {
            Ok(response) => {
                return Ok(response.get_ref().fields_added);
            }
            Err(err) => return Err(format!("{}", err)),
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
        let mut request = tonic::Request::new(GetAllHashMapFieldsAndValuesRequest {
            key: key.to_owned(),
        });
        insert_common_grpc_metadata(&connection, &mut request).await;
        request
            .metadata_mut()
            .insert(MD_KEY_DATABASE, db_name.parse().unwrap());

        let response = client
            .storage_client
            .get_all_hash_map_fields_and_values(request)
            .await;
        match response {
            Ok(response) => {
                return Ok(GetAllHashMapFieldsAndValuesPayload {
                    field_value_map: response.get_ref().field_value_map.clone(),
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
pub async fn delete_hashmap_fields(
    connection: State<'_, GrpcConnection>,
    db_name: &str,
    key: &str,
    fields: Vec<String>,
) -> Result<DeleteHashMapFieldsPayload, String> {
    let mut guard = connection.client.lock().await;
    if let Some(ref mut client) = *guard {
        let mut request = tonic::Request::new(DeleteHashMapFieldsRequest {
            key: key.to_owned(),
            fields,
        });
        insert_common_grpc_metadata(&connection, &mut request).await;
        request
            .metadata_mut()
            .insert(MD_KEY_DATABASE, db_name.parse().unwrap());

        let response = client.storage_client.delete_hash_map_fields(request).await;
        match response {
            Ok(response) => {
                return Ok(DeleteHashMapFieldsPayload {
                    fields_removed: response.get_ref().fields_removed,
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
pub async fn get_hashmap_field_value(
    connection: State<'_, GrpcConnection>,
    db_name: &str,
    key: &str,
    fields: Vec<String>,
) -> Result<GetHashMapFieldValuePayload, String> {
    let mut guard = connection.client.lock().await;
    if let Some(ref mut client) = *guard {
        let mut request = tonic::Request::new(GetHashMapFieldValueRequest {
            key: key.to_owned(),
            fields,
        });
        insert_common_grpc_metadata(&connection, &mut request).await;
        request
            .metadata_mut()
            .insert(MD_KEY_DATABASE, db_name.parse().unwrap());

        let response = client
            .storage_client
            .get_hash_map_field_value(request)
            .await;
        match response {
            Ok(response) => {
                let mut field_values: HashMap<String, HashMapFieldValuePayload> = HashMap::new();
                for (field, value) in response.get_ref().field_value_map.iter() {
                    field_values.insert(
                        field.to_owned(),
                        HashMapFieldValuePayload {
                            value: value.value.clone(),
                            ok: value.ok,
                        },
                    );
                }

                return Ok(GetHashMapFieldValuePayload {
                    field_value_map: field_values,
                    ok: response.get_ref().ok,
                });
            }
            Err(err) => return Err(format!("{}", err)),
        }
    } else {
        return Err(NO_CONNECTION_FOUND_MSG.to_string());
    }
}
