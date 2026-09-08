# Muhammad Yousuf — Portfolio

Static HTML, CSS and JavaScript portfolio. Open `index.html` in a browser, or serve this folder with `python3 -m http.server 8000` and visit http://localhost:8000.

## Content

Updated from the September 6, 2026 CV at `Desktop/CV Folder/Muhammad_Yousuf_CV.pdf`. The downloadable copy is `assets/Muhammad_Yousuf_CV.pdf`. Project links are copied from the CV; live project availability has not been verified. The profile uses initials until a personal photo is supplied.

The contact form opens an email draft; sending requires an email app. Fonts and icons load from external CDNs.

## Change history

Git tracks this folder on the `main` branch. The first commit preserves the original website. Future edits must be committed to become part of the permanent history:

```sh
git status
git diff
git add index.html css/style.css js/main.js assets/Muhammad_Yousuf_CV.pdf
git commit -m "Describe the update"
git push
git log --oneline
```

History is stored locally and on GitHub at https://github.com/chyousuf/Yousuf. The `origin` remote points to this repository, and `main` tracks `origin/main`. Commit and push future changes to update the online backup. The live website is hosted free on GitHub Pages at https://chyousuf.github.io/Yousuf/. Changes pushed to `main` publish automatically. HTTPS is enforced. The free address is a GitHub subdomain and project path, not a separately registered domain.
