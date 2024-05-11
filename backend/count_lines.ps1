$totalLines = 0
Get-ChildItem -Recurse -File | ForEach-Object {
    $totalLines += (Get-Content $_.FullName | Measure-Object -Line).Lines
}
Write-Host "Total lines of code: $totalLines"
# PowerShell -ExecutionPolicy RemoteSigned -File "E:\Nazi University\6\Web Developing Technology\project\online-music-editor\source\backend\count_lines.ps1"
