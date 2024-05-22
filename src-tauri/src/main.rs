#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{env, path::PathBuf, process::Command, str::FromStr};

use tauri::Manager;
use window_shadows::set_shadow;

use zip_extensions::zip_extract;

#[tauri::command]
async fn pai_install(zip_path: String) {
    let zip_path = PathBuf::from_str(&zip_path).expect("Failed to get zip file path!");
    let target_path = PathBuf::from_str("C:\\").expect("Failed to get zip target path!");

    zip_extract(&zip_path, &target_path).unwrap();

    Command::new("powershell.exe")
        .args([
            "$PATH = [Environment]::GetEnvironmentVariable('PATH', 'user')",
            "[Environment]::SetEnvironmentVariable('PATH', '$PATH;C:\\plAIground', 'user')",
        ])
        .spawn()
        .expect("Failed to execute load path command!");
}

#[tauri::command]
async fn chrome_install() -> String {
    let mut output = String::new();

    let mut chromeinstallcmd = Command::new("winget")
        .args([
            "install",
            "Google.Chrome.EXE",
            "--accept-package-agreements",
            "--accept-source-agreements",
        ])
        .spawn()
        .expect("Failed to install TranslucentTB");

    let chrome_status = chromeinstallcmd
        .wait()
        .expect("Failed to return status for Chrome");

    if chrome_status.success() {
        output.push_str("Installationen av Chrome var framgångsrik!")
    } else if chrome_status.to_string() == "exit code: 0x8a15002b" {
        output.push_str("Chrome är redan installerat!")
    } else {
        output.push_str(&format!(
            "Installationen av Chrome misslyckades, {}!",
            &chrome_status.to_string(),
        ));
    }

    output
}

#[tauri::command]
async fn desktopinstall(rainmeter_zip_path: String) -> String {
    let mut output = String::new();

    let mut ttbinstallcmd = Command::new("winget")
        .args([
            "install",
            "translucenttb",
            "--accept-package-agreements",
            "--accept-source-agreements",
        ])
        .spawn()
        .expect("Failed to install TranslucentTB");

    let ttb_status = ttbinstallcmd
        .wait()
        .expect("Failed to return status for TranslucentTB");

    if ttb_status.success() {
        output.push_str("Installationen av TranslucentTB var framgångsrik, ")
    } else if ttb_status.to_string() == "exit code: 0x8a15002b" {
        output.push_str("TranslucentTB är redan installerat, ")
    } else {
        output.push_str(&format!(
            "Installationen av TranslucentTB misslyckades, {}, ",
            &ttb_status.to_string(),
        ));
    }

    let mut livelyinstallcmd = Command::new("winget")
        .args([
            "install",
            "9NTM2QC6QWS7",
            "--accept-package-agreements",
            "--accept-source-agreements",
        ])
        .spawn()
        .expect("Failed to install Lively Wallpaper");

    let lively_status = livelyinstallcmd
        .wait()
        .expect("Failed to return status for Lively Wallpaper");

    if lively_status.success() {
        output.push_str("Installationen av Lively Wallpaper var framgångsrik, ")
    } else if lively_status.to_string() == "exit code: 0x8a15002b" {
        output.push_str("Lively Wallpaper är redan installerat, ");
    } else {
        output.push_str(&format!(
            "Installationen av Lively Wallpaper misslyckades, {}, ",
            &lively_status.to_string()
        ))
    }

    let rainmeter_path = PathBuf::from_str("C:\\Rainmeter").unwrap();

    let result = zip_extract(
        &PathBuf::from_str(&rainmeter_zip_path).unwrap(),
        &rainmeter_path,
    )
    .unwrap();

    if result == () {
        output.push_str("Installationen av Rainmeter var framgångsrik! ")
    } else {
        output.push_str(&format!(
            "Installationen av Rainmeter misslyckades, {:?}, ",
            result
        ))
    }

    output
}

#[tauri::command]
async fn nompxinstall(zip_path: String) {
    let downloads_path = env::var("USERPROFILE").unwrap() + "\\Downloads\\NompX";

    zip_extract(
        &PathBuf::from_str(&zip_path).unwrap(),
        &PathBuf::from_str(&downloads_path).unwrap(),
    )
    .expect("Failed to extract NompX zip file!");
}
#[tauri::command]
async fn pyinstall() {
    Command::new("winget")
        .args([
            "install",
            "Python.Python.3.12",
            "--accept-package-agreements",
            "--accept-source-agreements",
        ])
        .spawn()
        .expect("Failed to install python");
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let handle = app.handle();

            let window = app.get_window("main").unwrap();

            set_shadow(&window, true).unwrap();

            app.listen_global("about_apply_acrylic", move |_| {
                let about_window = handle.get_window("about").unwrap();

                set_shadow(&about_window, true).unwrap();

                ()
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            desktopinstall,
            nompxinstall,
            pyinstall,
            pai_install,
            chrome_install
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
