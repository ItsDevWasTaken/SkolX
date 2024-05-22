$PATH = [Environment]::GetEnvironmentVariable("PATH", "user")
[Environment]::SetEnvironmentVariable("PATH", "$PATH;C:\plAIground", "user")