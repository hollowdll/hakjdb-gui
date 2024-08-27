use crate::{
    error::NO_CONNECTION_FOUND_MSG,
    grpc::{hakjdb_api::AuthenticateRequest, GrpcConnection},
};
use tauri::State;

#[tauri::command]
pub async fn authenticate(
    connection: State<'_, GrpcConnection>,
    password: &str,
) -> Result<(), String> {
    if let Some(ref mut client) = *connection.client.lock().await {
        let req = tonic::Request::new(AuthenticateRequest {
            password: password.to_owned(),
        });

        let resp = client.auth_client.authenticate(req).await;
        match resp {
            Ok(resp) => {
                let auth_token = resp.get_ref().auth_token.clone();
                connection.set_auth_token(auth_token).await;
                return Ok(());
            }
            Err(e) => return Err(e.to_string()),
        }
    } else {
        return Err(NO_CONNECTION_FOUND_MSG.to_string());
    }
}
