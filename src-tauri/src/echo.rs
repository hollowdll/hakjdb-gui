use crate::{
    error::NO_CONNECTION_FOUND_MSG,
    grpc::{hakjdb_api::UnaryEchoRequest, insert_common_grpc_metadata, GrpcConnection},
};
use tauri::State;

#[tauri::command]
pub async fn unary_echo(
    connection: State<'_, GrpcConnection>,
    msg: &str,
) -> Result<String, String> {
    if let Some(ref mut client) = *connection.client.lock().await {
        let mut req = tonic::Request::new(UnaryEchoRequest {
            msg: msg.to_owned(),
        });
        insert_common_grpc_metadata(&connection, &mut req).await;

        let resp = client.echo_client.unary_echo(req).await;
        match resp {
            Ok(resp) => return Ok(resp.get_ref().msg.clone()),
            Err(e) => return Err(e.message().to_string()),
        }
    } else {
        return Err(NO_CONNECTION_FOUND_MSG.to_string());
    }
}
