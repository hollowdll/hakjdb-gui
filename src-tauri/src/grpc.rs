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

        Ok(GrpcClient {
            server_client: ServerServiceClient::connect(api_url.clone()).await?,
            database_client: DatabaseServiceClient::connect(api_url.clone()).await?,
            storage_client: StorageServiceClient::connect(api_url.clone()).await?,
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