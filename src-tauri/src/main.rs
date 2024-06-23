// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use app::{
    connection::{__cmd__connect, __cmd__disconnect, connect, disconnect},
    db::{
        __cmd__create_database, __cmd__delete_database, __cmd__get_all_databases,
        __cmd__get_database_info, create_database, delete_database, get_all_databases,
        get_database_info,
    },
    grpc::GrpcConnection,
    server::{__cmd__get_server_info, __cmd__get_server_logs, get_server_info, get_server_logs},
    storage::{
        __cmd__delete_all_keys, __cmd__delete_hashmap_fields, __cmd__delete_key,
        __cmd__get_all_hashmap_fields_and_values, __cmd__get_keys, __cmd__get_string,
        __cmd__get_type_of_key, __cmd__set_hashmap, __cmd__set_string, delete_all_keys,
        delete_hashmap_fields, delete_key, get_all_hashmap_fields_and_values, get_keys, get_string,
        get_type_of_key, set_hashmap, set_string,
    },
};
use std::error::Error;
use tauri::{CustomMenuItem, Manager, Menu, Submenu};

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    tauri::Builder::default()
        .menu(Menu::os_default("kvdb-gui").add_submenu(Submenu::new(
            "Connect",
            Menu::with_items([
                CustomMenuItem::new("new-connection", "New Connection").into(),
                CustomMenuItem::new("disconnect", "Disconnect").into(),
            ]),
        )))
        .on_menu_event(|event| match event.menu_item_id() {
            "new-connection" => {
                println!("Menu event -> New Connection");
                let _ = event.window().emit("new-connection", ());
            }
            "disconnect" => {
                println!("Menu event -> Disconnect");
                let _ = event.window().emit("disconnect", ());
            }
            _ => {}
        })
        .setup(|app| {
            app.manage(GrpcConnection::new());

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            connect,
            disconnect,
            get_server_info,
            get_server_logs,
            get_all_databases,
            get_database_info,
            create_database,
            delete_database,
            get_keys,
            get_type_of_key,
            get_string,
            set_string,
            delete_key,
            delete_all_keys,
            set_hashmap,
            get_all_hashmap_fields_and_values,
            delete_hashmap_fields
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    Ok(())
}
