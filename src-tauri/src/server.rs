use serde::Serialize;

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