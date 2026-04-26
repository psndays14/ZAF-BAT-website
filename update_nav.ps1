$root = 'C:\Users\PC\Downloads\AHMED YASSINE FLIYOU-20260322T071101Z-1-001\github-ready'

# ── FR ROOT pages: replace nav-links inner content (keep lang-toggle intact) ──
$rootPages = @(
    'index.html','audit.html','budget.html','pilotage.html',
    'realisations.html','contact.html','mentions-legales.html',
    'construction-villa-casablanca-rabat.html'
)

$oldNav = ' <span class="nav-drop"><a href="audit.html">Audit chantier</a><div class="nav-drop-bridge"></div><div class="nav-drop-menu"><a href="audit.html">Tous les services audit</a><div class="drop-divider"></div><a class="drop-city" href="audit.html">Casablanca ' + [char]183 + ' Rabat</a></div></span> <a href="budget.html">Budget</a> <span class="nav-drop"><a href="pilotage.html">Construction &amp; Pilotage</a><div class="nav-drop-bridge"></div><div class="nav-drop-menu"><a href="pilotage.html">Construction &amp; Pilotage</a><div class="drop-divider"></div><a class="drop-city" href="construction-villa-casablanca-rabat.html">Casablanca ' + [char]183 + ' Rabat</a></div></span> <a href="realisations.html">R' + [char]233 + 'alisations</a> <span class="nav-drop"><a href="blog/index.html">Blog</a><div class="nav-drop-bridge"></div><div class="nav-drop-menu"><a href="blog/prix-construction-villa-maroc.html">Prix construction villa</a><a href="blog/permis-construire-maroc.html">Permis de construire</a><a href="blog/architecte-maitre-oeuvre-maroc.html">Architecte vs Ma' + [char]238 + 'tre d' + [char]8217 + [char]339 + 'uvre</a><a href="blog/erreurs-budget-villa-maroc.html">10 erreurs budget villa</a></div></span> <a href="contact.html">Contact</a> <a href="contact.html" class="nav-cta">Audit Gratuit</a>'

$newNav = ' <a href="audit.html">Audit chantier</a> <a href="budget.html">Audit devis / budget</a> <a href="pilotage.html">Pilotage seul</a> <a href="contact.html">Contact</a> <a href="contact.html" class="nav-cta">Audit Gratuit</a>'

foreach ($f in $rootPages) {
    $path = "$root\$f"
    if (Test-Path $path) {
        $bytes = [System.IO.File]::ReadAllBytes($path)
        $content = [System.Text.Encoding]::UTF8.GetString($bytes)
        if ($content.Contains($oldNav)) {
            $content = $content.Replace($oldNav, $newNav)
            [System.IO.File]::WriteAllBytes($path, [System.Text.Encoding]::UTF8.GetBytes($content))
            Write-Host "nav-links updated: $f"
        } else {
            Write-Host "nav-links NOT FOUND in: $f"
        }
    }
}

# ── Side-menu: targeted replacements (preserve active class per page) ──
# Remove sub-items
$oldSub1 = '<a class="side-sub" href="audit.html">Casablanca ' + [char]183 + ' Rabat</a>'
$oldSub2 = '<a class="side-sub" href="construction-villa-casablanca-rabat.html">Casablanca ' + [char]183 + ' Rabat</a>'
$oldReal = '<a href="realisations.html">R' + [char]233 + 'alisations</a>'
$oldBudget = '<a href="budget.html">Optimisation budget</a>'
$newBudget = '<a href="budget.html">Audit devis / budget</a>'
$oldPilot = '<a href="pilotage.html">Construction &amp; Pilotage villa</a>'
$newPilot = '<a href="pilotage.html">Pilotage seul</a>'

foreach ($f in $rootPages) {
    $path = "$root\$f"
    if (Test-Path $path) {
        $bytes = [System.IO.File]::ReadAllBytes($path)
        $content = [System.Text.Encoding]::UTF8.GetString($bytes)
        $content = $content.Replace($oldSub1, '')
        $content = $content.Replace($oldSub2, '')
        $content = $content.Replace($oldReal, '')
        $content = $content.Replace($oldBudget, $newBudget)
        $content = $content.Replace($oldPilot, $newPilot)
        [System.IO.File]::WriteAllBytes($path, [System.Text.Encoding]::UTF8.GetBytes($content))
        Write-Host "side-menu updated: $f"
    }
}

Write-Host "Done."
