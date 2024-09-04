use hakjdb_api::{
    auth_service_client::AuthServiceClient, db_service_client::DbServiceClient,
    echo_service_client::EchoServiceClient, general_kv_service_client::GeneralKvServiceClient,
    hash_map_kv_service_client::HashMapKvServiceClient, server_service_client::ServerServiceClient,
    string_kv_service_client::StringKvServiceClient,
};
use std::path::PathBuf;
use tauri::State;
use tokio::sync::Mutex;
use tonic::transport::{Certificate, Channel, ClientTlsConfig, Error, Identity};
use tonic::Request;

pub mod kvdb {
    tonic::include_proto!("kvdbserverapi");
}

pub mod hakjdb_api {
    tonic::include_proto!("api.v1.authpb");
    tonic::include_proto!("api.v1.dbpb");
    tonic::include_proto!("api.v1.echopb");
    tonic::include_proto!("api.v1.kvpb");
    tonic::include_proto!("api.v1.serverpb");
}

/// gRPC metadata key for the database to use.
pub const MD_KEY_DATABASE: &str = "database";
/// gRPC metadata key for authentication token.
pub const MD_KEY_AUTH_TOKEN: &str = "auth-token";
/// gRPC metadata key for API version.
pub const MD_KEY_API_VERSION: &str = "api-version";

pub struct ClientCertConfig {
    pub client_cert_pem: String,
    pub client_key_pem: String,
}

pub struct ClientCertPaths {
    pub public_key_path: PathBuf,
    pub private_key_path: PathBuf,
}

pub struct GrpcClient {
    pub auth_client: AuthServiceClient<Channel>,
    pub db_client: DbServiceClient<Channel>,
    pub server_client: ServerServiceClient<Channel>,
    pub echo_client: EchoServiceClient<Channel>,
    pub general_kv_client: GeneralKvServiceClient<Channel>,
    pub string_kv_client: StringKvServiceClient<Channel>,
    pub hashmap_kv_client: HashMapKvServiceClient<Channel>,
}

impl GrpcClient {
    /// Returns a new insecure gRPC client.
    pub async fn new_insecure(host: &str, port: u16) -> Result<GrpcClient, Error> {
        let api_url = format!("http://{}:{}", host, port);
        let channel = Channel::from_shared(api_url.clone())
            .unwrap()
            .connect()
            .await?;

        Ok(GrpcClient {
            auth_client: AuthServiceClient::new(channel.clone()),
            db_client: DbServiceClient::new(channel.clone()),
            server_client: ServerServiceClient::new(channel.clone()),
            echo_client: EchoServiceClient::new(channel.clone()),
            general_kv_client: GeneralKvServiceClient::new(channel.clone()),
            string_kv_client: StringKvServiceClient::new(channel.clone()),
            hashmap_kv_client: HashMapKvServiceClient::new(channel.clone()),
        })
    }

    /// Returns a new secure gRPC client that uses TLS.
    /// pem_content is the content of the server certificate file.
    /// It needs to be a PEM encoded X509 certificate.
    pub async fn new_secure(
        host: &str,
        port: u16,
        ca_pem_content: &str,
        client_cert_cfg: Option<ClientCertConfig>,
    ) -> Result<GrpcClient, Error> {
        let ca = Certificate::from_pem(ca_pem_content);
        let mut tls = ClientTlsConfig::new().ca_certificate(ca).domain_name(host);
        if let Some(client_cert_cfg) = client_cert_cfg {
            tls = tls.identity(Identity::from_pem(
                client_cert_cfg.client_cert_pem,
                client_cert_cfg.client_key_pem,
            ));
        }
        let channel = Channel::from_shared(format!("https://{}:{}", host, port))
            .unwrap()
            .tls_config(tls)?
            .connect()
            .await?;

        Ok(GrpcClient {
            auth_client: AuthServiceClient::new(channel.clone()),
            db_client: DbServiceClient::new(channel.clone()),
            server_client: ServerServiceClient::new(channel.clone()),
            echo_client: EchoServiceClient::new(channel.clone()),
            general_kv_client: GeneralKvServiceClient::new(channel.clone()),
            string_kv_client: StringKvServiceClient::new(channel.clone()),
            hashmap_kv_client: HashMapKvServiceClient::new(channel.clone()),
        })
    }
}

pub struct GrpcConnection {
    pub client: Mutex<Option<GrpcClient>>,
    pub tls_ca_cert_path: Mutex<Option<PathBuf>>,
    pub tls_client_cert_paths: Mutex<Option<ClientCertPaths>>,
    pub auth_token: Mutex<Option<String>>,
}

impl GrpcConnection {
    pub fn new() -> GrpcConnection {
        GrpcConnection {
            client: None.into(),
            tls_ca_cert_path: None.into(),
            tls_client_cert_paths: None.into(),
            auth_token: None.into(),
        }
    }

    pub async fn set_auth_token(&self, token: String) {
        *self.auth_token.lock().await = Some(token);
    }

    pub async fn reset_auth_token(&self) {
        *self.auth_token.lock().await = None;
    }
}

pub async fn insert_common_grpc_metadata<T>(
    connection: &State<'_, GrpcConnection>,
    req: &mut Request<T>,
) {
    if let Some(ref auth_token) = *connection.auth_token.lock().await {
        req.metadata_mut()
            .insert(MD_KEY_AUTH_TOKEN, auth_token.parse().unwrap());
    }
}
