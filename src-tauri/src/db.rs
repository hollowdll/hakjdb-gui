use crate::{
    error::{NO_CONNECTION_FOUND_MSG, UNEXPECTED_ERROR_MSG},
    grpc::{
        kvdb::{
            CreateDatabaseRequest, DeleteDatabaseRequest, GetAllDatabasesRequest,
            GetDatabaseInfoRequest,
        },
        GrpcConnection,
    },
    util::prost_timestamp_to_iso8601,
};
use serde::Serialize;
use tauri::State;

#[derive(Serialize)]
pub struct DatabaseInfoPayload {
    pub name: String,
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
    let mut guard = connection.connection.lock().await;
    if let Some(ref mut connection) = *guard {
        let request = tonic::Request::new(GetAllDatabasesRequest {});
        let response = connection.database_client.get_all_databases(request).await;
        match response {
            Ok(response) => {
                return Ok(GetDatabasesPayload {
                    db_names: response.get_ref().db_names.clone(),
                });
            }
            Err(err) => return Err(format!("{}", err)),
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
    let mut guard = connection.connection.lock().await;
    if let Some(ref mut connection) = *guard {
        let request = tonic::Request::new(GetDatabaseInfoRequest {
            db_name: db_name.to_owned(),
        });
        let response = connection.database_client.get_database_info(request).await;
        match response {
            Ok(response) => {
                if let Some(data) = &response.get_ref().data {
                    return Ok(DatabaseInfoPayload {
                        name: data.name.to_owned(),
                        created_at: prost_timestamp_to_iso8601(data.created_at.as_ref().unwrap()),
                        updated_at: prost_timestamp_to_iso8601(data.updated_at.as_ref().unwrap()),
                        data_size: data.data_size.to_string(),
                        key_count: data.key_count.to_string(),
                    });
                }
            }
            Err(err) => return Err(format!("{}", err)),
        }
    } else {
        return Err(NO_CONNECTION_FOUND_MSG.to_string());
    }

    return Err(UNEXPECTED_ERROR_MSG.to_string());
}

/// Creates a new database. Returns the name of the created database.
#[tauri::command]
pub async fn create_database(
    connection: State<'_, GrpcConnection>,
    db_name: &str,
) -> Result<String, String> {
    let mut guard = connection.connection.lock().await;
    if let Some(ref mut connection) = *guard {
        let request = tonic::Request::new(CreateDatabaseRequest {
            db_name: db_name.to_owned(),
        });
        let response = connection.database_client.create_database(request).await;
        match response {
            Ok(response) => return Ok(response.get_ref().db_name.clone()),
            Err(err) => return Err(format!("{}", err)),
        }
    } else {
        return Err(NO_CONNECTION_FOUND_MSG.to_string());
    }
}

/// Deletes a database. Returns the name of the deleted database.
#[tauri::command]
pub async fn delete_database(
    connection: State<'_, GrpcConnection>,
    db_name: &str,
) -> Result<String, String> {
    let mut guard = connection.connection.lock().await;
    if let Some(ref mut connection) = *guard {
        let request = tonic::Request::new(DeleteDatabaseRequest {
            db_name: db_name.to_owned(),
        });
        let response = connection.database_client.delete_database(request).await;
        match response {
            Ok(response) => return Ok(response.get_ref().db_name.clone()),
            Err(err) => return Err(format!("{}", err)),
        }
    } else {
        return Err(NO_CONNECTION_FOUND_MSG.to_string());
    }
}
