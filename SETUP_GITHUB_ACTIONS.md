# 🤖 Configuration de la Synthèse IA Quotidienne

Ce guide vous explique comment configurer la génération automatique quotidienne de la synthèse des actualités financières.

## 📋 Prérequis

Vous aurez besoin de deux clés API (gratuites) :

### 1. NewsAPI (gratuit)
- Inscrivez-vous sur [https://newsapi.org/register](https://newsapi.org/register)
- Plan gratuit : 100 requêtes/jour (largement suffisant)
- Récupérez votre clé API

### 2. Anthropic API (optionnel mais recommandé)
- Inscrivez-vous sur [https://console.anthropic.com](https://console.anthropic.com)
- Créez une clé API
- Les premiers $5 de crédit sont gratuits
- Coût par synthèse : ~$0.001 (1 centime pour ~1000 synthèses)

**Note :** Si vous n'avez pas l'API Anthropic, une synthèse basique sera générée automatiquement.

## 🔧 Installation

### Étape 1 : Ajouter les fichiers à votre repository GitHub

Téléchargez les fichiers suivants et ajoutez-les à votre repository :

```
votre-repo/
├── .github/
│   └── workflows/
│       └── daily-news.yml
├── scripts/
│   └── generate-summary.js
├── data/
│   └── .gitkeep (créer le dossier)
├── package.json
└── index.html (votre fichier modifié)
```

### Étape 2 : Configurer les secrets GitHub

1. Allez dans **Settings** de votre repository
2. Dans le menu de gauche, cliquez sur **Secrets and variables** → **Actions**
3. Cliquez sur **New repository secret**

Ajoutez les deux secrets suivants :

#### Secret 1 : NEWS_API_KEY
- **Name:** `NEWS_API_KEY`
- **Value:** Votre clé API de NewsAPI.org

#### Secret 2 : ANTHROPIC_API_KEY (optionnel)
- **Name:** `ANTHROPIC_API_KEY`
- **Value:** Votre clé API Anthropic

### Étape 3 : Créer le dossier data

Créez un fichier `.gitkeep` dans le dossier `data/` pour que Git suive ce dossier :

```bash
mkdir -p data
touch data/.gitkeep
git add data/.gitkeep
git commit -m "📁 Ajout du dossier data"
git push
```

### Étape 4 : Activer GitHub Actions

1. Allez dans l'onglet **Actions** de votre repository
2. Si c'est votre première fois, cliquez sur "I understand my workflows, go ahead and enable them"
3. Le workflow `Daily Market Summary` devrait apparaître

### Étape 5 : Premier lancement manuel

1. Dans l'onglet **Actions**, cliquez sur **Daily Market Summary**
2. Cliquez sur **Run workflow** → **Run workflow**
3. Attendez quelques secondes
4. Le fichier `data/market-summary.json` sera créé automatiquement

## 📅 Fonctionnement

### Automatique
- Le workflow s'exécute **automatiquement chaque jour à 8h00 UTC** (9h Paris hiver, 10h été)
- Il récupère les dernières actualités
- Génère une synthèse IA
- Commit le fichier `market-summary.json`
- Votre site se met à jour automatiquement !

### Manuel
Vous pouvez lancer le workflow manuellement à tout moment :
1. Onglet **Actions**
2. **Daily Market Summary**
3. **Run workflow**

## 🔍 Vérification

Pour vérifier que tout fonctionne :

1. Après le premier run, vérifiez que `data/market-summary.json` existe dans votre repo
2. Ouvrez votre site web
3. La section "📰 Actualités des marchés" devrait afficher la synthèse

## 🆓 Coûts

- **NewsAPI :** Gratuit (100 requêtes/jour)
- **Anthropic API :** ~$0.001 par jour ($0.30/mois)
- **GitHub Actions :** Gratuit (2000 minutes/mois pour les repos publics, 500 pour les privés)

**Total :** Environ $0.30/mois si vous utilisez Anthropic, sinon complètement gratuit !

## 🛠️ Dépannage

### Le workflow ne se lance pas
- Vérifiez que GitHub Actions est activé (onglet Actions)
- Vérifiez que le fichier `.github/workflows/daily-news.yml` est bien présent

### Erreur "NEWS_API_KEY not found"
- Vérifiez que le secret est bien configuré dans Settings → Secrets
- Le nom doit être exactement `NEWS_API_KEY` (majuscules)

### Le fichier JSON n'est pas créé
- Vérifiez les logs du workflow dans l'onglet Actions
- Le dossier `data/` doit exister dans votre repo

### La synthèse est basique (pas IA)
- Vérifiez que `ANTHROPIC_API_KEY` est configuré
- Vérifiez votre crédit API Anthropic

## 🎨 Personnalisation

Vous pouvez modifier `scripts/generate-summary.js` pour :
- Changer les sources d'actualités
- Modifier le prompt de la synthèse IA
- Ajuster le nombre d'articles
- Ajouter d'autres API (CoinGecko, Alpha Vantage, etc.)

## 📞 Support

Si vous avez des questions, ouvrez une issue sur GitHub !
