use serde::{Deserialize, Serialize};
use tauri::State;
use tokio::sync::Mutex;

use crate::fs::write_settings_file;

pub const THEME_LIGHT: &str = "light";
pub const THEME_DARK: &str = "dark";

#[derive(Serialize, Deserialize)]
pub enum AppTheme {
    Light,
    Dark,
}

#[derive(Serialize, Deserialize)]
pub struct AppSettings {
    pub theme: AppTheme,
}

impl AppSettings {
    pub fn new() -> Self {
        Self {
            theme: AppTheme::Dark,
        }
    }
}

pub struct AppSettingsState {
    pub settings: Mutex<AppSettings>,
}

impl AppSettingsState {
    pub fn new(settings: AppSettings) -> Self {
        Self {
            settings: settings.into(),
        }
    }
}

pub fn serialize_settings_toml(settings: &AppSettings) -> Result<String, toml::ser::Error> {
    let toml = toml::to_string(settings)?;
    Ok(toml)
}

pub fn deserialize_settings_toml(toml: &str) -> Result<AppSettings, toml::de::Error> {
    let settings: AppSettings = toml::from_str(toml)?;
    Ok(settings)
}

#[tauri::command]
pub async fn settings_set_theme(
    settings_state: State<'_, AppSettingsState>,
    dark_mode: bool,
) -> Result<(), String> {
    let mut settings = settings_state.settings.lock().await;
    if dark_mode {
        settings.theme = AppTheme::Dark;
    } else {
        settings.theme = AppTheme::Light;
    }
    if let Err(e) = write_settings_file(&settings) {
        return Err(e.to_string());
    }

    Ok(())
}
