fn main() -> Result<(), Box<dyn std::error::Error>> {
  tauri_build::build();
  tonic_build::configure()
    .build_server(false)
    .compile(
      &[
        "../proto/kvdbserverpb/db.proto",
        "../proto/kvdbserverpb/server.proto",
        "../proto/kvdbserverpb/storage.proto"
      ],
      &["../proto/kvdbserverpb"],
    )?;
  Ok(())
}
