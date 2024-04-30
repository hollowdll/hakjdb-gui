use kvdb::{
    server_service_client::ServerServiceClient,
    database_service_client::DatabaseServiceClient,
    storage_service_client::StorageServiceClient,
};
use tonic::transport::Channel;
use std::error::Error;

pub mod kvdb {
    tonic::include_proto!("kvdbserverapi");
}

pub struct GrpcClient {
    pub server_client: ServerServiceClient<Channel>,
    pub database_client: DatabaseServiceClient<Channel>,
    pub storage_client: StorageServiceClient<Channel>,
}

impl GrpcClient {
    pub async fn new(host: &str, port: u16) -> Result<GrpcClient, Box<dyn Error>> {
        let api_url = format!("http://{}:{}", host, port);

        Ok(GrpcClient {
            server_client: ServerServiceClient::connect(api_url.clone()).await?,
            database_client: DatabaseServiceClient::connect(api_url.clone()).await?,
            storage_client: StorageServiceClient::connect(api_url.clone()).await?,
        })
    }
}