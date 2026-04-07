$root = 'C:\Users\PC\Downloads\AHMED YASSINE FLIYOU-20260322T071101Z-1-001\github-ready'

Write-Host "=== 1. Checking nav-links simplified (no dropdown spans) ==="
$rootPages = @('index.html','audit.html','budget.html','pilotage.html','realisations.html','contact.html','mentions-legales.html')
foreach ($f in $rootPages) {
    $path = "$root\$f"
    $bytes = [System.IO.File]::ReadAllBytes($path)
    $content = [System.Text.Encoding]::UTF8.GetString($bytes)
    $hasDropdown = $content.Contains('nav-drop-menu')
    $hasPilotageSeul = $content.Contains('Pilotage seul')
    Write-Host "$f | has-dropdown=$hasDropdown | pilotage-seul=$hasPilotageSeul"
}

Write-Host ""
Write-Host "=== 2. Checking footer-links updated ==="
foreach ($f in $rootPages) {
    $path = "$root\$f"
    $bytes = [System.IO.File]::ReadAllBytes($path)
    $content = [System.Text.Encoding]::UTF8.GetString($bytes)
    $hasConstrLink = $content.Contains('Construction + pilotage de villa')
    Write-Host "$f | constr-link=$hasConstrLink"
}

Write-Host ""
Write-Host "=== 3. Checking index.html FAQ4 ==="
$bytes = [System.IO.File]::ReadAllBytes("$root\index.html")
$content = [System.Text.Encoding]::UTF8.GetString($bytes)
$faq4marker = 'id=' + [char]34 + 'faq4' + [char]34
Write-Host "Has faq4: $($content.Contains($faq4marker))"

Write-Host ""
Write-Host "=== 4. Checking pilotage.html title ==="
$bytes = [System.IO.File]::ReadAllBytes("$root\pilotage.html")
$content = [System.Text.Encoding]::UTF8.GetString($bytes)
$titleIdx = $content.IndexOf('<title>')
Write-Host $content.Substring($titleIdx, 80)

Write-Host ""
Write-Host "=== 5. Checking contact.html dropdown ==="
$bytes = [System.IO.File]::ReadAllBytes("$root\contact.html")
$content = [System.Text.Encoding]::UTF8.GetString($bytes)
Write-Host "Has Pilotage independant: $($content.Contains('Pilotage ind'))"
Write-Host "Has Construction + pilotage: $($content.Contains('Construction + pilotage de villa'))"

Write-Host ""
Write-Host "Done."
