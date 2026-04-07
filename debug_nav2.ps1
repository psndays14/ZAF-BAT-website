$path = 'C:\Users\PC\Downloads\AHMED YASSINE FLIYOU-20260322T071101Z-1-001\github-ready\index.html'
$bytes = [System.IO.File]::ReadAllBytes($path)
$content = [System.Text.Encoding]::UTF8.GetString($bytes)
$start = $content.IndexOf('<div class="nav-links">')
$end = $content.IndexOf('</div>', $start + 100)
# Find the real end (closing div of nav-links)
# Look for </div> followed by <button
$btnIdx = $content.IndexOf('<button class="menu-btn"', $start)
$chunk = $content.Substring($start, $btnIdx - $start)
Write-Host "=== NAV-LINKS CONTENT ==="
Write-Host $chunk
Write-Host "=== END ==="
