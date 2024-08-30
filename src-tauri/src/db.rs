use crate::{
    error::{NO_CONNECTION_FOUND_MSG, UNEXPECTED_ERROR_MSG},
    grpc::{
        hakjdb_api::{
            ChangeDbRequest, CreateDbRequest, DeleteDbRequest, GetAllDBsRequest, GetDbInfoRequest,
        },
        insert_common_grpc_metadata, GrpcConnection,
    },
    util::prost_timestamp_to_iso8601,
};
use serde::Serialize;
use tauri::State;

#[derive(Serialize)]
pub struct DatabaseInfoPayload {
    pub name: String,
    pub description: String,
    #[serde(rename = "createdAt")]
    pub created_at: String,
    #[serde(rename = "updatedAt")]
    pub updated_at: String,
    #[serde(rename = "dataSize")]
    pub data_size: String,
    #[serde(rename = "keyCount")]
    pub key_count: String,
}

#[derive(Serialize)]
pub struct GetDatabasesPayload {
    #[serde(rename = "dbNames")]
    pub db_names: Vec<String>,
}

#[tauri::command]
pub async fn get_all_databases(
    connection: State<'_, GrpcConnection>,
) -> Result<GetDatabasesPayload, String> {
    if let Some(ref mut client) = *connection.client.lock().await {
        let mut req = tonic::Request::new(GetAllDBsRequest {});
        insert_common_grpc_metadata(&connection, &mut req).await;

        let resp = client.db_client.get_all_d_bs(req).await;
        match resp {
            Ok(resp) => {
                return Ok(GetDatabasesPayload {
                    db_names: resp.get_ref().db_names.clone(),
                });
            }
            Err(e) => return Err(e.message().to_string()),
        }
    } else {
        return Err(NO_CONNECTION_FOUND_MSG.to_string());
    }
}

#[tauri::command]
pub async fn get_database_info(
    connection: State<'_, GrpcConnection>,
    db_name: &str,
) -> Result<DatabaseInfoPayload, String> {
    if let Some(ref mut client) = *connection.client.lock().await {
        let mut req = tonic::Request::new(GetDbInfoRequest {
            db_name: db_name.to_owned(),
        });
        insert_common_grpc_metadata(&connection, &mut req).await;

        let resp = client.db_client.get_db_info(req).await;
        match resp {
            Ok(resp) => {
                if let Some(data) = &resp.get_ref().data {
                    return Ok(DatabaseInfoPayload {
                        name: data.name.to_owned(),
                        description: data.description.to_owned(),
                        created_at: prost_timestamp_to_iso8601(data.created_at.as_ref().unwrap()),
                        updated_at: prost_timestamp_to_iso8601(data.updated_at.as_ref().unwrap()),
                        data_size: data.data_size.to_string(),
                        key_count: data.key_count.to_string(),
                    });
                }
            }
            Err(e) => return Err(e.message().to_string()),
        }
    } else {
        return Err(NO_CONNECTION_FOUND_MSG.to_string());
    }

    return Err(UNEXPECTED_ERROR_MSG.to_string());
}

/// Returns the name of the created database.
#[tauri::command]
pub async fn create_database(
    connection: State<'_, GrpcConnection>,
    db_name: &str,
    description: &str,
) -> Result<String, String> {
    if let Some(ref mut client) = *connection.client.lock().await {
        let mut req = tonic::Request::new(CreateDbRequest {
            db_name: db_name.to_owned(),
            description: description.to_owned(),
        });
        insert_common_grpc_metadata(&connection, &mut req).await;

        let resp = client.db_client.create_db(req).await;
        match resp {
            Ok(resp) => return Ok(resp.get_ref().db_name.clone()),
            Err(e) => return Err(e.message().to_string()),
        }
    } else {
        return Err(NO_CONNECTION_FOUND_MSG.to_string());
    }
}

/// Returns the name of the deleted database.
#[tauri::command]
pub async fn delete_database(
    connection: State<'_, GrpcConnection>,
    db_name: &str,
) -> Result<String, String> {
    if let Some(ref mut client) = *connection.client.lock().await {
        let mut req = tonic::Request::new(DeleteDbRequest {
            db_name: db_name.to_owned(),
        });
        insert_common_grpc_metadata(&connection, &mut req).await;

        let resp = client.db_client.delete_db(req).await;
        match resp {
            Ok(resp) => return Ok(resp.get_ref().db_name.clone()),
            Err(e) => return Err(e.message().to_string()),
        }
    } else {
        return Err(NO_CONNECTION_FOUND_MSG.to_string());
    }
}

/// Returns the name of the changed database.
#[tauri::command]
pub async fn change_database(
    connection: State<'_, GrpcConnection>,
    db_name: &str,
    new_name: &str,
    change_name: bool,
    new_description: &str,
    change_description: bool,
) -> Result<String, String> {
    if let Some(ref mut client) = *connection.client.lock().await {
        let mut req = tonic::Request::new(ChangeDbRequest {
            db_name: db_name.to_owned(),
            new_name: new_name.to_owned(),
            change_name,
            new_description: new_description.to_owned(),
            change_description,
        });
        insert_common_grpc_metadata(&connection, &mut req).await;

        let resp = client.db_client.change_db(req).await;
        match resp {
            Ok(resp) => return Ok(resp.get_ref().db_name.clone()),
            Err(e) => return Err(e.message().to_string()),
        }
    } else {
        return Err(NO_CONNECTION_FOUND_MSG.to_string());
    }
}
