$root = 'C:\Users\PC\Downloads\AHMED YASSINE FLIYOU-20260322T071101Z-1-001\github-ready\blog'

$newNavContent = ' <a href="../audit.html">Audit chantier</a> <a href="../budget.html">Audit devis / budget</a> <a href="../pilotage.html">Pilotage seul</a> <a href="../contact.html">Contact</a> <a href="../contact.html" class="nav-cta">Audit Gratuit</a>'

$blogPages = @(
    'prix-construction-villa-maroc.html',
    'permis-construire-maroc.html',
    'architecte-maitre-oeuvre-maroc.html',
    'erreurs-budget-villa-maroc.html'
)

$navOpen = '<div class="nav-links">'
$navCtaEnd = 'class="nav-cta">Audit Gratuit</a>'

foreach ($f in $blogPages) {
    $path = "$root\$f"
    if (-not (Test-Path $path)) { Write-Host "NOT FOUND: $f"; continue }
    $bytes = [System.IO.File]::ReadAllBytes($path)
    $content = [System.Text.Encoding]::UTF8.GetString($bytes)

    $openIdx = $content.IndexOf($navOpen)
    if ($openIdx -lt 0) { Write-Host "nav-links not found: $f"; continue }

    $ctaIdx = $content.IndexOf($navCtaEnd, $openIdx)
    if ($ctaIdx -lt 0) { Write-Host "nav-cta not found: $f"; continue }

    $ctaEnd = $ctaIdx + $navCtaEnd.Length

    $before = $content.Substring(0, $openIdx + $navOpen.Length)
    $after  = $content.Substring($ctaEnd)
    $content = $before + $newNavContent + $after

    [System.IO.File]::WriteAllBytes($path, [System.Text.Encoding]::UTF8.GetBytes($content))
    Write-Host "nav-links fixed: $f"
}

Write-Host "Done."
