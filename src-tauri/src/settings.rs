use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct AppSettings {
    /// Theme can be 'light' or 'dark'.
    pub theme: String,
}

impl AppSettings {
    pub fn new() -> Self {
        Self {
            theme: "dark".to_string(),
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
