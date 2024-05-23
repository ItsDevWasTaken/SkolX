$shell = New-Object -ComObject WScript.Shell
$start_shortcut = $shell.CreateShortcut("$env:appdata\\Microsoft\\Windows\\Start Menu\\Programs\\Rainmeter.lnk")
$start_shortcut.TargetPath = "C:\\Rainmeter\\Rainmeter.exe"
$start_shortcut.Save()
$auto_shortcut = $shell.CreateShortcut("$env:appdata\\Microsoft\\Windows\\Start Menu\\Programs\\Startup\\Rainmeter.lnk")
$auto_shortcut.TargetPath = "C:\\Rainmeter\\Rainmeter.exe"
$auto_shortcut.Save()