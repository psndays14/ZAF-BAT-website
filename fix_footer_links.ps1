$root = 'C:\Users\PC\Downloads\AHMED YASSINE FLIYOU-20260322T071101Z-1-001\github-ready'

$footerOpen = '<div class="footer-links">'
$footerClose = '</div>'

# New footer-links for FR root pages
$newFooterRoot = '<div class="footer-links"> <a href="contact.html">Construction + pilotage de villa</a> <a href="pilotage.html">Pilotage ind' + [char]233 + 'pendant de chantier</a> <a href="audit.html">Audit chantier</a> <a href="budget.html">Audit devis / budget</a> </div>'

# New footer-links for blog pages (relative paths)
$newFooterBlog = '<div class="footer-links"> <a href="../contact.html">Construction + pilotage de villa</a> <a href="../pilotage.html">Pilotage ind' + [char]233 + 'pendant de chantier</a> <a href="../audit.html">Audit chantier</a> <a href="../budget.html">Audit devis / budget</a> </div>'

function Replace-FooterLinks {
    param($path, $newFooter)
    if (-not (Test-Path $path)) { Write-Host "NOT FOUND: $path"; return }
    $bytes = [System.IO.File]::ReadAllBytes($path)
    $content = [System.Text.Encoding]::UTF8.GetString($bytes)

    $openIdx = $content.IndexOf($footerOpen)
    if ($openIdx -lt 0) { Write-Host "footer-links not found: $path"; return }

    $closeIdx = $content.IndexOf($footerClose, $openIdx + $footerOpen.Length)
    if ($closeIdx -lt 0) { Write-Host "footer-links closing div not found: $path"; return }

    $closeEnd = $closeIdx + $footerClose.Length

    $before = $content.Substring(0, $openIdx)
    $after  = $content.Substring($closeEnd)
    $content = $before + $newFooter + $after

    [System.IO.File]::WriteAllBytes($path, [System.Text.Encoding]::UTF8.GetBytes($content))
    Write-Host "footer-links updated: $(Split-Path $path -Leaf)"
}

# FR root pages
$rootPages = @(
    'index.html','audit.html','budget.html','pilotage.html',
    'realisations.html','contact.html','mentions-legales.html',
    'construction-villa-casablanca-rabat.html'
)
foreach ($f in $rootPages) {
    Replace-FooterLinks "$root\$f" $newFooterRoot
}

# Blog pages
$blogPages = @(
    'prix-construction-villa-maroc.html',
    'permis-construire-maroc.html',
    'architecte-maitre-oeuvre-maroc.html',
    'erreurs-budget-villa-maroc.html'
)
foreach ($f in $blogPages) {
    Replace-FooterLinks "$root\blog\$f" $newFooterBlog
}

Write-Host "Done."
