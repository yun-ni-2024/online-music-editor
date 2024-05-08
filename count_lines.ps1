$totalLines = 0
Get-ChildItem -Recurse -File | ForEach-Object {
    $totalLines += (Get-Content $_.FullName | Measure-Object -Line).Lines
}
Write-Host "Total lines of code: $totalLines"
