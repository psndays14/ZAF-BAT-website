# Déploiement GitHub Pages — ZAF BAT

Le dossier est prêt : `.gitignore` (exclut les backups), `CNAME` (zafbat.ma), `404.html` (gère les anciennes URLs), `sitemap.xml` à jour.

## 1. Créer le dépôt et pousser (PowerShell, dans ce dossier)

```powershell
git init -b main
git add -A
git commit -m "ZAF BAT site"
# créer d'abord un repo vide sur github.com (ex: zafbat-site), puis :
git remote add origin https://github.com/VOTRE-COMPTE/zafbat-site.git
git push -u origin main
```

(Ou plus simple : GitHub Desktop → "Add local repository" → ce dossier → Publish.)

## 2. Activer GitHub Pages

Repo → Settings → Pages → Source : `main` / `/ (root)` → Save.
Le site sera sur `https://VOTRE-COMPTE.github.io/zafbat-site/` en ~2 min.

## 3. Domaine zafbat.ma (optionnel)

- Settings → Pages → Custom domain : `zafbat.ma` (le fichier CNAME est déjà dans le repo)
- Chez votre registrar DNS : 4 enregistrements A `@` → 185.199.108.153 / .109. / .110. / .111.153 + CNAME `www` → `VOTRE-COMPTE.github.io`
- Cocher "Enforce HTTPS" une fois le DNS propagé.

## Notes

- `.htaccess` et `_redirects` sont ignorés par GitHub Pages (gardés pour un futur hébergement Apache/Netlify). Les redirections legacy passent par `404.html`.
- Les dossiers `_backup_*`, `screenshots/` et le `.docx` interne ne seront PAS publiés (`.gitignore`).
