use serde::Serialize;

#[derive(Serialize)]
pub struct DatabaseInfo {
    pub name: String,
    #[serde(rename = "createdAt")]
    pub created_at: String,
    #[serde(rename = "updatedAt")]
    pub updated_at: String,
    #[serde(rename = "dataSize")]
    pub data_size: String,
    #[serde(rename = "keyCount")]
    pub key_count: String,
}