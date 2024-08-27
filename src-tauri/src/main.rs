// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use app::{
    auth::{__cmd__authenticate, authenticate},
    connection::{
        __cmd__connect, __cmd__disconnect, __cmd__open_file, __cmd__reset_auth_token,
        __cmd__set_tls_cert_path, connect, disconnect, open_file, reset_auth_token,
        set_tls_cert_path,
    },
    db::{
        __cmd__change_database, __cmd__create_database, __cmd__delete_database,
        __cmd__get_all_databases, __cmd__get_database_info, change_database, create_database,
        delete_database, get_all_databases, get_database_info,
    },
    echo::{__cmd__unary_echo, unary_echo},
    grpc::GrpcConnection,
    kv::{
        general_kv::{
            __cmd__delete_all_keys, __cmd__delete_keys, __cmd__get_all_keys, __cmd__get_key_type,
            delete_all_keys, delete_keys, get_all_keys, get_key_type,
        },
        hashmap_kv::{
            __cmd__delete_hashmap_fields, __cmd__get_all_hashmap_fields_and_values,
            __cmd__get_hashmap_field_values, __cmd__set_hashmap, delete_hashmap_fields,
            get_all_hashmap_fields_and_values, get_hashmap_field_values, set_hashmap,
        },
        string_kv::{__cmd__get_string, __cmd__set_string, get_string, set_string},
    },
    server::{__cmd__get_server_info, __cmd__get_server_logs, get_server_info, get_server_logs},
};
use std::error::Error;
use tauri::{CustomMenuItem, Manager, Menu, Submenu};

const MENU_ITEM_ID_NEW_CONNECTION: &str = "new-connection";
const MENU_ITEM_ID_DISCONNECT: &str = "disconnect";
const MENU_ITEM_ID_LIGHT_MODE: &str = "light-mode";
const MENU_ITEM_ID_DARK_MODE: &str = "dark-mode";

const EVENT_ID_NEW_CONNECTION: &str = "new-connection";
const EVENT_ID_DISCONNECT: &str = "disconnect";
const EVENT_ID_SET_DARK_MODE: &str = "set-dark-mode";

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    tauri::Builder::default()
        .menu(
            Menu::os_default("HakjDB GUI")
                .add_submenu(Submenu::new(
                    "Connect",
                    Menu::with_items([
                        CustomMenuItem::new(MENU_ITEM_ID_NEW_CONNECTION, "New Connection").into(),
                        CustomMenuItem::new(MENU_ITEM_ID_DISCONNECT, "Disconnect").into(),
                    ]),
                ))
                .add_submenu(Submenu::new(
                    "Theme",
                    Menu::with_items([
                        CustomMenuItem::new(MENU_ITEM_ID_LIGHT_MODE, "Light Mode").into(),
                        CustomMenuItem::new(MENU_ITEM_ID_DARK_MODE, "Dark Mode").into(),
                    ]),
                )),
        )
        .on_menu_event(|event| match event.menu_item_id() {
            MENU_ITEM_ID_NEW_CONNECTION => {
                println!("Event -> New connection");
                let _ = event.window().emit(EVENT_ID_NEW_CONNECTION, ());
            }
            MENU_ITEM_ID_DISCONNECT => {
                println!("Event -> Disconnect");
                let _ = event.window().emit(EVENT_ID_DISCONNECT, ());
            }
            MENU_ITEM_ID_LIGHT_MODE => {
                println!("Event -> Enable light mode");
                let _ = event.window().emit(EVENT_ID_SET_DARK_MODE, false);
            }
            MENU_ITEM_ID_DARK_MODE => {
                println!("Event -> Enable dark mode");
                let _ = event.window().emit(EVENT_ID_SET_DARK_MODE, true);
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
            change_database,
            get_all_keys,
            get_key_type,
            delete_keys,
            delete_all_keys,
            get_string,
            set_string,
            set_hashmap,
            get_all_hashmap_fields_and_values,
            delete_hashmap_fields,
            get_hashmap_field_values,
            reset_auth_token,
            set_tls_cert_path,
            open_file,
            authenticate,
            unary_echo
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    Ok(())
}
