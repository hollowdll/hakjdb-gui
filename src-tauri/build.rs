fn main() -> Result<(), Box<dyn std::error::Error>> {
    tauri_build::build();
    tonic_build::configure().build_server(false).compile(
        &[
            "../proto/kvdbserverpb/db.proto",
            "../proto/kvdbserverpb/server.proto",
            "../proto/kvdbserverpb/storage.proto",
            "../api/v1/authpb/auth.proto",
            "../api/v1/dbpb/db.proto",
            "../api/v1/echopb/echo.proto",
            "../api/v1/serverpb/server.proto",
            "../api/v1/kvpb/general_kv.proto",
            "../api/v1/kvpb/string_kv.proto",
            "../api/v1/kvpb/hashmap_kv.proto",
        ],
        &["../proto/kvdbserverpb", "../api/v1"],
    )?;
    Ok(())
}
