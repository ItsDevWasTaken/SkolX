$shell = New-Object -ComObject WScript.Shell
$shortcut = $shell.CreateShortcut("$env:appdata\\Microsoft\\Windows\\Start Menu\\Programs\\Rainmeter.lnk")
$shortcut.TargetPath = "C:\\Rainmeter\\Rainmeter.exe"
$shortcut.Save()