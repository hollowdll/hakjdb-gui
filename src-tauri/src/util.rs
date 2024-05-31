use chrono::{TimeZone, Utc};
use prost_types::Timestamp;

/// Converts bytes to mega bytes.
pub fn bytes_to_mega(bytes: u64) -> f64 {
    return bytes as f64 / 1024.0 / 1024.0;
}

/// Convert prost timestamp to ISO8601 timestamp string.
pub fn prost_timestamp_to_iso8601(timestamp: &Timestamp) -> String {
    Utc.timestamp_opt(timestamp.seconds, timestamp.nanos as u32)
        .unwrap()
        .to_rfc3339()
}
