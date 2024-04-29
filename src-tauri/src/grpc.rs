use kvdb::{
    server_service_client::ServerServiceClient,
    database_service_client::DatabaseServiceClient,
    storage_service_client::StorageServiceClient,
};
use tonic::transport::Channel;

pub mod kvdb {
    tonic::include_proto!("kvdbserverapi");
}

pub struct GrpcClient {
    pub server_client: ServerServiceClient<Channel>,
    pub database_client: DatabaseServiceClient<Channel>,
    pub storage_client: StorageServiceClient<Channel>,
}