use std::error::Error;
use std::fs;
use std::io::{self, Write};
use std::path::{Path, PathBuf};

use crate::settings::{deserialize_settings_toml, serialize_settings_toml, AppSettings};

pub const SETTINGS_FILE_NAME: &str = "hakjdb-gui-settings.toml";
pub const SUBDIR_NAME: &str = "hakjdb-gui";

/// Writes the settings file.
pub fn write_settings_file(settings: &AppSettings) -> Result<(), Box<dyn Error>> {
    let subdir = get_config_subdir(SUBDIR_NAME)?;
    let toml = serialize_settings_toml(settings)?;
    write_file(&toml, subdir.join(SETTINGS_FILE_NAME))?;

    Ok(())
}

/// Creates a file if it doesn't exist and overwrites it.
pub fn write_file<P>(content: &str, path: P) -> io::Result<()>
where
    P: AsRef<Path>,
{
    let mut file = fs::File::create(path)?;
    file.write_all(content.as_bytes())?;
    Ok(())
}

/// Reads the settings file and loads the settings.
pub fn load_settings_file() -> Result<AppSettings, Box<dyn Error>> {
    let subdir = get_config_subdir(SUBDIR_NAME)?;
    let content = fs::read_to_string(subdir.join(SETTINGS_FILE_NAME))?;
    let settings = deserialize_settings_toml(&content)?;
    Ok(settings)
}

/// Creates a new settings file if it doesn't exist.
pub fn create_settings_file_if_not_exists() -> Result<(), Box<dyn Error>> {
    let subdir = get_config_subdir(SUBDIR_NAME)?;
    let exists = subdir.join(SETTINGS_FILE_NAME).try_exists()?;
    if !exists {
        let settings = AppSettings::new();
        write_settings_file(&settings)?;
    }

    Ok(())
}

/// Gets the path to the app's config subdirectory.
/// Creates the directory if it doesn't exist.
pub fn get_config_subdir(subdir: &str) -> io::Result<PathBuf> {
    let cfg_dir = dirs::config_dir().ok_or_else(|| {
        io::Error::new(
            io::ErrorKind::NotFound,
            "cannot determine user's config directory",
        )
    })?;
    let subdir_path = cfg_dir.join(subdir);
    fs::create_dir_all(&subdir_path)?;

    Ok(subdir_path)
}
