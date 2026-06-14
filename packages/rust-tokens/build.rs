use std::env;
use std::fs;
use std::path::Path;

fn needed_hash_count(s: &str) -> usize {
    for n in 1..10 {
        let pat = format!("\"{}", "#".repeat(n));
        if !s.contains(&pat) {
            return n;
        }
    }
    panic!("JSON 中包含连续 10 个 \"#，无法安全嵌入");
}

fn main() {
    let manifest_dir = env::var("CARGO_MANIFEST_DIR").expect("CARGO_MANIFEST_DIR must be set");
    let out_dir = env::var("OUT_DIR").expect("OUT_DIR must be set");

    let json_path = Path::new(&manifest_dir).join("design-tokens.json");
    let json_str = fs::read_to_string(&json_path)
        .unwrap_or_else(|e| panic!("无法读取 {:?}: {}", json_path, e));

    let hash_count = needed_hash_count(&json_str);
    let hashes: String = std::iter::repeat('#').take(hash_count).collect();
    let generated = format!(
        "pub const RAW_TOKENS_JSON: &str = r{hashes}\"{json_str}\"{hashes};\n",
        hashes = hashes, json_str = json_str);

    fs::write(Path::new(&out_dir).join("generated.rs"), generated)
        .unwrap_or_else(|e| panic!("无法写入: {}", e));

    println!("cargo:rerun-if-changed=design-tokens.json");
}
