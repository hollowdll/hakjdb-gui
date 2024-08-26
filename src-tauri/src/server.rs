use crate::util::bytes_to_mega;
use crate::{
    error::NO_CONNECTION_FOUND_MSG,
    grpc::{
        hakjdb_api::{GetLogsRequest, GetServerInfoRequest},
        insert_common_grpc_metadata, GrpcConnection,
    },
};
use serde::Serialize;
use tauri::State;

#[derive(Serialize)]
pub struct ServerInfoPayload {
    #[serde(rename = "generalInfo")]
    pub general_info: GeneralInfoPayload,
    #[serde(rename = "memoryInfo")]
    pub memory_info: MemoryInfoPayload,
    #[serde(rename = "storageInfo")]
    pub storage_info: StorageInfoPayload,
    #[serde(rename = "clientInfo")]
    pub client_info: ClientInfoPayload,
    #[serde(rename = "dbInfo")]
    pub db_info: DatabaseInfoPayload,
}

#[derive(Serialize)]
pub struct MemoryInfoPayload {
    #[serde(rename = "memoryAllocMegaByte")]
    pub memory_alloc_mega_byte: String,
    #[serde(rename = "memoryTotalAllocMegaByte")]
    pub memory_total_alloc_mega_byte: String,
    #[serde(rename = "memorySysMegaByte")]
    pub memory_sys_mega_byte: String,
}

#[derive(Serialize)]
pub struct StorageInfoPayload {
    #[serde(rename = "totalDataSize")]
    pub total_data_size: String,
    #[serde(rename = "totalKeys")]
    pub total_keys: String,
}

#[derive(Serialize)]
pub struct ClientInfoPayload {
    #[serde(rename = "clientConnections")]
    pub client_connections: String,
    #[serde(rename = "maxClientConnections")]
    pub max_client_connections: String,
}

#[derive(Serialize)]
pub struct DatabaseInfoPayload {
    #[serde(rename = "dbCount")]
    pub db_count: String,
    #[serde(rename = "defaultDb")]
    pub default_db: String,
}

#[derive(Serialize)]
pub struct GeneralInfoPayload {
    #[serde(rename = "serverVersion")]
    pub server_version: String,
    #[serde(rename = "goVersion")]
    pub go_version: String,
    #[serde(rename = "apiVersion")]
    pub api_version: String,
    pub os: String,
    pub arch: String,
    #[serde(rename = "processId")]
    pub process_id: String,
    #[serde(rename = "uptimeSeconds")]
    pub uptime_seconds: String,
    #[serde(rename = "tcpPort")]
    pub tcp_port: String,
    #[serde(rename = "tlsEnabled")]
    pub tls_enabled: bool,
    #[serde(rename = "authEnabled")]
    pub auth_enabled: bool,
    #[serde(rename = "logfileEnabled")]
    pub logfile_enabled: bool,
    #[serde(rename = "debugEnabled")]
    pub debug_enabled: bool,
}

#[derive(Serialize)]
pub struct ServerLogsPayload {
    pub logs: Vec<String>,
}

#[tauri::command]
pub async fn get_server_info(
    connection: State<'_, GrpcConnection>,
) -> Result<ServerInfoPayload, String> {
    if let Some(ref mut client) = *connection.client.lock().await {
        let mut req = tonic::Request::new(GetServerInfoRequest {});
        insert_common_grpc_metadata(&connection, &mut req).await;

        let resp = client.server_client.get_server_info(req).await;
        match resp {
            Ok(resp) => {
                let resp = resp.get_ref();
                return Ok(ServerInfoPayload {
                    general_info: GeneralInfoPayload {
                        server_version: resp.general_info.as_ref().unwrap().server_version.clone(),
                        go_version: resp.general_info.as_ref().unwrap().go_version.clone(),
                        api_version: resp.general_info.as_ref().unwrap().api_version.clone(),
                        os: resp.general_info.as_ref().unwrap().os.clone(),
                        arch: resp.general_info.as_ref().unwrap().arch.clone(),
                        process_id: resp.general_info.as_ref().unwrap().process_id.to_string(),
                        uptime_seconds: resp
                            .general_info
                            .as_ref()
                            .unwrap()
                            .uptime_seconds
                            .to_string(),
                        tcp_port: resp.general_info.as_ref().unwrap().tcp_port.to_string(),
                        tls_enabled: resp.general_info.as_ref().unwrap().tls_enabled,
                        auth_enabled: resp.general_info.as_ref().unwrap().auth_enabled,
                        logfile_enabled: resp.general_info.as_ref().unwrap().logfile_enabled,
                        debug_enabled: resp.general_info.as_ref().unwrap().debug_enabled,
                    },
                    memory_info: MemoryInfoPayload {
                        memory_alloc_mega_byte: bytes_to_mega(
                            resp.memory_info.as_ref().unwrap().memory_alloc,
                        )
                        .to_string(),
                        memory_total_alloc_mega_byte: bytes_to_mega(
                            resp.memory_info.as_ref().unwrap().memory_total_alloc,
                        )
                        .to_string(),
                        memory_sys_mega_byte: bytes_to_mega(
                            resp.memory_info.as_ref().unwrap().memory_sys,
                        )
                        .to_string(),
                    },
                    storage_info: StorageInfoPayload {
                        total_data_size: resp
                            .storage_info
                            .as_ref()
                            .unwrap()
                            .total_data_size
                            .to_string(),
                        total_keys: resp.storage_info.as_ref().unwrap().total_keys.to_string(),
                    },
                    client_info: ClientInfoPayload {
                        client_connections: resp
                            .client_info
                            .as_ref()
                            .unwrap()
                            .client_connections
                            .to_string(),
                        max_client_connections: resp
                            .client_info
                            .as_ref()
                            .unwrap()
                            .max_client_connections
                            .to_string(),
                    },
                    db_info: DatabaseInfoPayload {
                        db_count: resp.db_info.as_ref().unwrap().db_count.to_string(),
                        default_db: resp.db_info.as_ref().unwrap().default_db.clone(),
                    },
                });
            }
            Err(e) => return Err(e.to_string()),
        }
    } else {
        return Err(NO_CONNECTION_FOUND_MSG.to_string());
    }
}

#[tauri::command]
pub async fn get_server_logs(
    connection: State<'_, GrpcConnection>,
) -> Result<ServerLogsPayload, String> {
    if let Some(ref mut client) = *connection.client.lock().await {
        let mut req = tonic::Request::new(GetLogsRequest {});
        insert_common_grpc_metadata(&connection, &mut req).await;

        let resp = client.server_client.get_logs(req).await;
        match resp {
            Ok(resp) => {
                return Ok(ServerLogsPayload {
                    logs: resp.get_ref().logs.clone(),
                });
            }
            Err(e) => return Err(e.to_string()),
        }
    } else {
        return Err(NO_CONNECTION_FOUND_MSG.to_string());
    }
}
