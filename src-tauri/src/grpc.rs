use kvdb::{
    server_service_client::ServerServiceClient,
    database_service_client::DatabaseServiceClient,
    storage_service_client::StorageServiceClient,
};
use tonic::transport::{
    Channel,
    Error,
};
use tokio::sync::Mutex;

pub mod kvdb {
    tonic::include_proto!("kvdbserverapi");
}

pub struct GrpcClient {
    pub server_client: ServerServiceClient<Channel>,
    pub database_client: DatabaseServiceClient<Channel>,
    pub storage_client: StorageServiceClient<Channel>,
}

impl GrpcClient {
    pub async fn new(host: &str, port: u16) -> Result<GrpcClient, Error> {
        let api_url = format!("http://{}:{}", host, port);
        let channel = Channel::from_shared(api_url.clone()).unwrap().connect().await?;

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