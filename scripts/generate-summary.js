const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuration
const NEWS_API_KEY = process.env.NEWS_API_KEY; // NewsAPI.org (gratuit pour 100 requêtes/jour)
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY; // API Anthropic

// Fonction pour récupérer les actualités crypto
async function getCryptoNews() {
    try {
        const response = await axios.get('https://newsapi.org/v2/everything', {
            params: {
                q: 'Bitcoin OR Ethereum OR cryptocurrency',
                language: 'en',
                sortBy: 'publishedAt',
                pageSize: 5,
                apiKey: NEWS_API_KEY
            }
        });
        return response.data.articles || [];
    } catch (error) {
        console.error('Erreur récupération news crypto:', error.message);
        return [];
    }
}

// Fonction pour récupérer les actualités bourse
async function getStockNews() {
    try {
        const response = await axios.get('https://newsapi.org/v2/everything', {
            params: {
                q: 'stock market OR S&P 500 OR Nasdaq OR Federal Reserve',
                language: 'en',
                sortBy: 'publishedAt',
                pageSize: 5,
                apiKey: NEWS_API_KEY
            }
        });
        return response.data.articles || [];
    } catch (error) {
        console.error('Erreur récupération news bourse:', error.message);
        return [];
    }
}

// Fonction pour générer la synthèse avec Claude
async function generateAISummary(cryptoNews, stockNews) {
    try {
        // Préparer le contexte des actualités
        const newsContext = {
            crypto: cryptoNews.slice(0, 3).map(n => ({
                title: n.title,
                description: n.description
            })),
            stock: stockNews.slice(0, 3).map(n => ({
                title: n.title,
                description: n.description
            }))
        };

        const prompt = `Tu es un analyste financier expert. Analyse les actualités suivantes et génère une synthèse concise en français.

**Actualités Crypto:**
${newsContext.crypto.map((n, i) => `${i + 1}. ${n.title}\n   ${n.description}`).join('\n\n')}

**Actualités Bourse:**
${newsContext.stock.map((n, i) => `${i + 1}. ${n.title}\n   ${n.description}`).join('\n\n')}

Fournis une synthèse structurée en 3-4 paragraphes courts avec :
1. Les événements majeurs sur les marchés crypto
2. Les mouvements importants sur les marchés actions
3. Une perspective pour les investisseurs

Format HTML avec balises <p> et <strong>. Utilise des émojis (📊, 🏦, 💡, etc.) pour illustrer.`;

        const response = await axios.post(
            'https://api.anthropic.com/v1/messages',
            {
                model: 'claude-sonnet-4-20250514',
                max_tokens: 1000,
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ]
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': ANTHROPIC_API_KEY,
                    'anthropic-version': '2023-06-01'
                }
            }
        );

        return response.data.content[0].text;
    } catch (error) {
        console.error('Erreur génération synthèse IA:', error.message);
        
        // Fallback : synthèse basique sans IA
        return `
            <p style="margin-bottom: 12px;">
                <strong>📊 Marchés aujourd'hui :</strong> Les marchés continuent d'évoluer avec des mouvements 
                significatifs sur les cryptomonnaies et les indices traditionnels.
            </p>
            <p style="margin-bottom: 12px;">
                <strong>💡 Crypto :</strong> Bitcoin et Ethereum maintiennent leur dynamique avec une volatilité 
                modérée dans un contexte d'adoption croissante.
            </p>
            <p>
                <strong>📈 Bourse :</strong> Les principaux indices surveillent de près les décisions de politique 
                monétaire et les résultats d'entreprises.
            </p>
        `;
    }
}

// Fonction principale
async function main() {
    console.log('🚀 Génération de la synthèse quotidienne...');

    // Récupérer les actualités
    const [cryptoNews, stockNews] = await Promise.all([
        getCryptoNews(),
        getStockNews()
    ]);

    console.log(`✅ ${cryptoNews.length} actualités crypto récupérées`);
    console.log(`✅ ${stockNews.length} actualités bourse récupérées`);

    // Générer la synthèse IA
    const summary = await generateAISummary(cryptoNews, stockNews);
    console.log('✅ Synthèse IA générée');

    // Fusionner et préparer les actualités
    const allNews = [
        ...cryptoNews.slice(0, 5).map(n => ({
            title: n.title,
            source: n.source.name,
            snippet: n.description || '',
            url: n.url
        })),
        ...stockNews.slice(0, 3).map(n => ({
            title: n.title,
            source: n.source.name,
            snippet: n.description || '',
            url: n.url
        }))
    ].slice(0, 8); // Limiter à 8 actualités

    // Créer l'objet de données
    const data = {
        date: new Date().toLocaleDateString('fr-FR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        }),
        updated: new Date().toLocaleString('fr-FR'),
        summary: summary,
        news: allNews
    };

    // Créer le dossier data s'il n'existe pas
    const dataDir = path.join(__dirname, '..', 'data');
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }

    // Sauvegarder dans un fichier JSON
    const outputPath = path.join(dataDir, 'market-summary.json');
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf8');

    console.log(`✅ Fichier sauvegardé : ${outputPath}`);
    console.log('🎉 Génération terminée avec succès !');
}

// Exécuter
main().catch(error => {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
});
