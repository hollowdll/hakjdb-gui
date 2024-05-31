use crate::grpc::{
    kvdb::{GetLogsRequest, GetServerInfoRequest},
    GrpcConnection,
};
use crate::util::bytes_to_mega;
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
pub struct GeneralInfoPayload {
    #[serde(rename = "kvdbVersion")]
    pub kvdb_version: String,
    #[serde(rename = "goVersion")]
    pub go_version: String,
    #[serde(rename = "dbCount")]
    pub db_count: String,
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
    #[serde(rename = "passwordEnabled")]
    pub password_enabled: bool,
    #[serde(rename = "logfileEnabled")]
    pub logfile_enabled: bool,
    #[serde(rename = "debugEnabled")]
    pub debug_enabled: bool,
    #[serde(rename = "defaultDb")]
    pub default_db: String,
}

#[derive(Serialize)]
pub struct ServerLogsPayload {
    pub logs: Vec<String>,
}

#[tauri::command]
pub async fn get_server_info(
    connection: State<'_, GrpcConnection>,
) -> Result<ServerInfoPayload, String> {
    let mut guard = connection.connection.lock().await;
    if let Some(ref mut connection) = *guard {
        let request = tonic::Request::new(GetServerInfoRequest {});
        let response = connection.server_client.get_server_info(request).await;
        match response {
            Ok(response) => {
                if let Some(data) = &response.get_ref().data {
                    return Ok(ServerInfoPayload {
                        general_info: GeneralInfoPayload {
                            kvdb_version: data.general_info.as_ref().unwrap().kvdb_version.clone(),
                            go_version: data.general_info.as_ref().unwrap().go_version.clone(),
                            db_count: data.general_info.as_ref().unwrap().db_count.to_string(),
                            os: data.general_info.as_ref().unwrap().os.clone(),
                            arch: data.general_info.as_ref().unwrap().arch.clone(),
                            process_id: data.general_info.as_ref().unwrap().process_id.to_string(),
                            uptime_seconds: data
                                .general_info
                                .as_ref()
                                .unwrap()
                                .uptime_seconds
                                .to_string(),
                            tcp_port: data.general_info.as_ref().unwrap().tcp_port.to_string(),
                            tls_enabled: data.general_info.as_ref().unwrap().tls_enabled,
                            password_enabled: data.general_info.as_ref().unwrap().password_enabled,
                            logfile_enabled: data.general_info.as_ref().unwrap().logfile_enabled,
                            debug_enabled: data.general_info.as_ref().unwrap().debug_enabled,
                            default_db: data.general_info.as_ref().unwrap().default_db.clone(),
                        },
                        memory_info: MemoryInfoPayload {
                            memory_alloc_mega_byte: bytes_to_mega(
                                data.memory_info.as_ref().unwrap().memory_alloc,
                            )
                            .to_string(),
                            memory_total_alloc_mega_byte: bytes_to_mega(
                                data.memory_info.as_ref().unwrap().memory_total_alloc,
                            )
                            .to_string(),
                            memory_sys_mega_byte: bytes_to_mega(
                                data.memory_info.as_ref().unwrap().memory_sys,
                            )
                            .to_string(),
                        },
                        storage_info: StorageInfoPayload {
                            total_data_size: data
                                .storage_info
                                .as_ref()
                                .unwrap()
                                .total_data_size
                                .to_string(),
                            total_keys: data.storage_info.as_ref().unwrap().total_keys.to_string(),
                        },
                        client_info: ClientInfoPayload {
                            client_connections: data
                                .client_info
                                .as_ref()
                                .unwrap()
                                .client_connections
                                .to_string(),
                            max_client_connections: data
                                .client_info
                                .as_ref()
                                .unwrap()
                                .max_client_connections
                                .to_string(),
                        },
                    });
                }
            }
            Err(err) => return Err(format!("{}", err)),
        }
    } else {
        return Err("no connection found".to_string());
    }

    return Err("unexpected error".to_string());
}

#[tauri::command]
pub async fn get_server_logs(
    connection: State<'_, GrpcConnection>,
) -> Result<ServerLogsPayload, String> {
    let mut guard = connection.connection.lock().await;
    if let Some(ref mut connection) = *guard {
        let request = tonic::Request::new(GetLogsRequest {});
        let response = connection.server_client.get_logs(request).await;
        match response {
            Ok(response) => {
                return Ok(ServerLogsPayload {
                    logs: response.get_ref().logs.clone(),
                });
            }
            Err(err) => return Err(format!("{}", err)),
        }
    } else {
        return Err("no connection found".to_string());
    }
}
