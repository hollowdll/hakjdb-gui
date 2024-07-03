use kvdb::{
    database_service_client::DatabaseServiceClient, server_service_client::ServerServiceClient,
    storage_service_client::StorageServiceClient,
};
use tauri::State;
use tokio::sync::Mutex;
use tonic::transport::{Channel, Error};
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
}

pub struct GrpcConnection {
    pub connection: Mutex<Option<GrpcClient>>,
}

impl GrpcConnection {
    pub fn new() -> GrpcConnection {
        GrpcConnection {
            connection: None.into(),
        }
    }
}

pub struct GrpcMetadataState {
    pub database: Mutex<String>,
    pub password: Mutex<String>,
}

impl GrpcMetadataState {
    pub fn new() -> Self {
        Self {
            database: "default".to_owned().into(),
            password: "".to_owned().into(),
        }
    }
}

pub async fn insert_grpc_metadata<T>(
    metadata_state: &State<'_, GrpcMetadataState>,
    req: &mut Request<T>,
) {
    req.metadata_mut().insert(
        MD_KEY_DATABASE,
        metadata_state
            .database
            .lock()
            .await
            .as_str()
            .parse()
            .unwrap(),
    );
    req.metadata_mut().insert(
        MD_KEY_PASSWORD,
        metadata_state
            .password
            .lock()
            .await
            .as_str()
            .parse()
            .unwrap(),
    );
}
