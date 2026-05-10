# 🌿 Nous Deux — Guide de déploiement

## Ce dont vous avez besoin
- Un compte **GitHub** (gratuit) → github.com
- Un compte **Vercel** (gratuit) → vercel.com

---

## Étape 1 — Créer le dépôt GitHub

1. Allez sur **github.com** et connectez-vous
2. Cliquez sur **"New repository"** (bouton vert en haut à droite)
3. Nommez-le `nous-deux`
4. Laissez tout par défaut → cliquez **"Create repository"**
5. GitHub vous donne une URL du type `https://github.com/votre-nom/nous-deux`

---

## Étape 2 — Uploader les fichiers

Dans votre nouveau dépôt GitHub, cliquez **"uploading an existing file"** et déposez ces fichiers **en respectant exactement cette structure** :

```
nous-deux/
├── index.html
├── package.json
├── vite.config.js
├── vercel.json
├── api/
│   └── data.js
└── src/
    ├── main.jsx
    └── App.jsx
```

> ⚠️ Les dossiers `api/` et `src/` doivent être créés : dans GitHub, écrivez `api/data.js` dans le nom du fichier, ça crée le dossier automatiquement.

Cliquez **"Commit changes"** en bas.

---

## Étape 3 — Connecter Vercel à GitHub

1. Allez sur **vercel.com** → connectez-vous avec GitHub
2. Cliquez **"Add New Project"**
3. Sélectionnez votre dépôt `nous-deux`
4. Vercel détecte automatiquement Vite → cliquez **"Deploy"**

⏳ Le déploiement prend ~1 minute. Vercel vous donne un lien du type :
**`https://nous-deux-xxxx.vercel.app`**

---

## Étape 4 — Ajouter la base de données (Vercel KV)

C'est ce qui permet à vous deux de partager les mêmes données.

1. Dans votre projet Vercel, allez dans l'onglet **"Storage"**
2. Cliquez **"Create Database"** → choisissez **"KV"**
3. Nommez-la `nous-deux-kv` → cliquez **"Create"**
4. Vercel vous demande de la connecter à votre projet → cliquez **"Connect"**
5. Allez dans **"Settings" → "Environment Variables"** et vérifiez que `KV_REST_API_URL` et `KV_REST_API_TOKEN` sont bien présents (Vercel les ajoute automatiquement)

---

## Étape 5 — Redéployer

Après avoir connecté la base de données :
1. Allez dans l'onglet **"Deployments"**
2. Cliquez sur les **"..."** du dernier déploiement → **"Redeploy"**

---

## ✅ C'est prêt !

Votre lien final : `https://nous-deux-xxxx.vercel.app`

Partagez-le avec Rim. Vous configurez l'app une seule fois ensemble (prénoms + date de discussion), et ensuite chacun peut l'ouvrir depuis son téléphone.

---

## En cas de problème

- **Erreur de build** : vérifiez que tous les fichiers sont au bon endroit
- **Les données ne se sauvegardent pas** : vérifiez que la base KV est bien connectée et que vous avez redéployé
- **Le lien ne marche pas** : attendez 2-3 minutes après le déploiement

---

*Fait avec ❤️*
