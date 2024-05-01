// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::error::Error;
use app::grpc::GrpcClient;
use tauri::{CustomMenuItem, Menu, Submenu, State, Manager};
use std::sync::Mutex;

struct GrpcConnection {
  connection: Mutex<Option<GrpcClient>>,
}

impl GrpcConnection {
  pub fn new() -> GrpcConnection {
    GrpcConnection {
      connection: None.into(),
    }
  }
}

#[tauri::command]
fn greet(name: &str) -> String {
  format!("Hello, {}!", name)
}

#[tauri::command]
async fn connect(connection: State<'_, GrpcConnection>, host: &str, port: u16) -> Result<String, String> {
  match GrpcClient::new(host, port).await {
    Ok(client) => {
      *connection.connection.lock().unwrap() = Some(client);
      return Ok(format!("Connected to {}:{}", host, port));
    },
    Err(e) => return Err(e.to_string()),
  }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
  tauri::Builder::default()
    .menu(Menu::os_default("kvdb-gui")
      .add_submenu(Submenu::new("Connect", Menu::with_items([
        CustomMenuItem::new("new-connection", "New connection").into(),
        CustomMenuItem::new("disconnect", "Disconnect").into(),
      ])))
    )
    .on_menu_event(|event| {
      match event.menu_item_id() {
        "new-connection" => {
          println!("Menu event -> New connection");
          let _ = event.window().emit("new-connection", ());
        },
        "disconnect" => println!("Menu event -> Disconnect"),
        _ => {}
      }
    })
    .setup(|app| {
      app.manage(GrpcConnection::new());

      Ok(())
    })
    .invoke_handler(tauri::generate_handler![greet, connect])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");

  Ok(())
}
