$path = 'C:\Users\PC\Downloads\AHMED YASSINE FLIYOU-20260322T071101Z-1-001\github-ready\index.html'
$bytes = [System.IO.File]::ReadAllBytes($path)
$content = [System.Text.Encoding]::UTF8.GetString($bytes)
$navOpen = '<div class="nav-links">'
$start = $content.IndexOf($navOpen)
$btnIdx = $content.IndexOf('<button class="menu-btn"', $start)
$chunk = $content.Substring($start, $btnIdx - $start)
Write-Host "=== index.html nav-links ==="
Write-Host $chunk
