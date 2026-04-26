$path = 'C:\Users\PC\Downloads\AHMED YASSINE FLIYOU-20260322T071101Z-1-001\github-ready\index.html'
$bytes = [System.IO.File]::ReadAllBytes($path)
$content = [System.Text.Encoding]::UTF8.GetString($bytes)
$start = $content.IndexOf('<div class="nav-links">')
$chunk = $content.Substring($start, 800)
Write-Host $chunk
