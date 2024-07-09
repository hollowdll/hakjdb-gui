use std::path::Path;

use kvdb::{
    database_service_client::DatabaseServiceClient, server_service_client::ServerServiceClient,
    storage_service_client::StorageServiceClient,
};
use tauri::State;
use tokio::sync::Mutex;
use tonic::transport::{Certificate, Channel, ClientTlsConfig, Error};
use tonic::Request;

pub mod kvdb {
    tonic::include_proto!("kvdbserverapi");
}

/// gRPC request metadata key. The value for this key specifies the database to use.
pub const MD_KEY_DATABASE: &str = "database";
/// gRPC request metadata key. The value for this key specifies the server password to use.
pub const MD_KEY_PASSWORD: &str = "password";

pub struct GrpcClient {
    pub server_client: ServerServiceClient<Channel>,
    pub database_client: DatabaseServiceClient<Channel>,
    pub storage_client: StorageServiceClient<Channel>,
}

impl GrpcClient {
    pub async fn new(host: &str, port: u16) -> Result<GrpcClient, Error> {
        let api_url = format!("http://{}:{}", host, port);
        let channel = Channel::from_shared(api_url.clone())
            .unwrap()
            .connect()
            .await?;

        Ok(GrpcClient {
            server_client: ServerServiceClient::new(channel.clone()),
            database_client: DatabaseServiceClient::new(channel.clone()),
            storage_client: StorageServiceClient::new(channel),
        })
    }

    pub async fn with_tls<P>(
        host: &str,
        port: u16,
        public_key_path: P,
    ) -> Result<GrpcClient, Box<dyn std::error::Error>>
    where
        P: AsRef<Path>,
    {
        let pem = std::fs::read_to_string(public_key_path)?;
        let ca = Certificate::from_pem(pem);

        let tls = ClientTlsConfig::new().ca_certificate(ca).domain_name(host);
        let channel = Channel::from_shared(format!("https://{}:{}", host, port))
            .unwrap()
            .tls_config(tls)?
            .connect()
            .await?;

        Ok(GrpcClient {
            server_client: ServerServiceClient::new(channel.clone()),
            database_client: DatabaseServiceClient::new(channel.clone()),
            storage_client: StorageServiceClient::new(channel),
        })
    }
}

pub struct GrpcConnection {
    pub client: Mutex<Option<GrpcClient>>,
    pub password: Mutex<Option<String>>,
}

impl GrpcConnection {
    pub fn new() -> GrpcConnection {
        GrpcConnection {
            client: None.into(),
            password: None.into(),
        }
    }
}

pub async fn insert_common_grpc_metadata<T>(
    connection: &State<'_, GrpcConnection>,
    req: &mut Request<T>,
) {
    if let Some(ref password) = *connection.password.lock().await {
        req.metadata_mut()
            .insert(MD_KEY_PASSWORD, password.parse().unwrap());
    }
}
