use serde::{Deserialize, Serialize};

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

pub fn serialize_settings_toml(settings: &AppSettings) -> Result<String, toml::ser::Error> {
    let toml = toml::to_string(settings)?;
    Ok(toml)
}

pub fn deserialize_settings_toml(toml: &str) -> Result<AppSettings, toml::de::Error> {
    let settings: AppSettings = toml::from_str(toml)?;
    Ok(settings)
}
