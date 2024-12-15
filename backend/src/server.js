const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs').promises;

const app = express();
const port = 5000;

// Použití middleware
app.use(cors()); // Povolit požadavky z jiných domén
app.use(express.json()); // Pro práci s JSON daty
app.use(express.urlencoded({ extended: true })); // For parsing URL-encoded data

const articlesFilePath = path.join(__dirname, 'articles.json');
const usersFilePath = path.join(__dirname, 'users.json');
const keywordsFilePath = path.join(__dirname, 'keywords.json');

let filteredArticles = [];
let articles = [];

async function loadArticles() {
    try {
        const data = await fs.readFile(articlesFilePath, 'utf8'); // Read the file asynchronously
        articles = JSON.parse(data); // Parse the JSON content and assign to articles
        //console.log('Articles loaded:', articles);
    } catch (err) {
        console.error('Error loading articles:', err);
        articles = []; // Initialize as an empty array if there is an error
    }
}
loadArticles();

async function loadKeywords() {
    const data = await fs.readFile(keywordsFilePath, 'utf8');
    return JSON.parse(data);
}

app.get('/api/articles/user/:userName', async (req, res) => {
    const { userName } = req.params;

    try {
        // Read users and articles from JSON files
        const usersData = await fs.readFile(usersFilePath, 'utf8');
        const users = JSON.parse(usersData);

        const keywordsData = await fs.readFile(keywordsFilePath, 'utf8');
        const keywords = JSON.parse(keywordsData);

        // Check if the user exists
        const user = users.find(u => u.name === userName);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find articles that belong to the user
        filteredArticles = articles.filter(articles => articles.author === user.name);

        filteredArticles = filteredArticles.map(article => {
            return {
                ...article,
                keywords: Array.isArray(article.keywords) ? article.keywords.map(keywordId => {
                    const keyword = keywords.find(k => k.id === keywordId);
                    return keyword ? keyword.name : keywordId; // Replace ID with name if found, otherwise keep the ID
                }) : [],
            };
        });

        // Respond with the filtered articles
        //console.log('Articles send:', filteredArticles);
        res.json(filteredArticles);
    } catch (error) {
        console.error('Error loading data:', error);
        res.status(500).json({ message: 'Error loading data' });
    }
});

app.get('/api/keywords', async (req, res) => {
    try {
        const keywordsData = await fs.readFile(keywordsFilePath, 'utf8');
        const keywords = JSON.parse(keywordsData);
        res.json(keywords);
    } catch (error) {
        console.error('Error loading data:', error);
        res.status(500).json({ message: 'Error loading data' });
    }
});

app.put('/api/articles/:id', async (req, res) => {
    const { id } = req.params;
    const updatedArticle = req.body; // Nová data článku z těla požadavku

    try {
        // Načteme články
        await loadArticles();
        const keywords = await loadKeywords();

        // Vytvoříme mapu klíčových slov pro snadnější přístup k ID 
        const keywordMap = keywords.reduce((map, obj) => {
            map[obj.name] = obj.id;
            return map;
        }, {});

        // Aktualizujeme klíčová slova v článku, pokud jsou poskytnuta 
        if (updatedArticle.keywords) {
            updatedArticle.keywords = updatedArticle.keywords
                .filter(keyword => keywordMap[keyword]) // Ponecháme pouze platná klíčová slova 
                .map(keyword => keywordMap[keyword]); // Převedeme klíčová slova na jejich ID 
        }

        // Najdeme index článku podle ID
        const articleIndex = articles.findIndex(article => article.id === parseInt(id));
        if (articleIndex === -1) {
            return res.status(404).json({ message: 'Článek nenalezen' });
        }

        // Aktualizujeme článek
        articles[articleIndex] = { ...articles[articleIndex], ...updatedArticle };

        // Uložíme změny zpět do JSON souboru
        await fs.writeFile(articlesFilePath, JSON.stringify(articles, null, 2), 'utf8');

        res.json({
            message: 'Článek byl úspěšně aktualizován',
            article: articles[articleIndex],
        });
    } catch (error) {
        console.error('Chyba při aktualizaci článku:', error);
        res.status(500).json({ message: 'Chyba při aktualizaci článku' });
    }
});

app.patch('/api/articles/:id/isEditing', async (req, res) => {
    const { id } = req.params; // ID článku z URL

    try {
        // Načteme články
        await loadArticles();

        // Najdeme článek podle ID
        const article = articles.find(article => article.id === parseInt(id));
        if (!article) {
            return res.status(404).json({ message: 'Článek nenalezen' });
        }

        // Nastavíme isEditing na true
        article.isEditing = true;

        // Uložíme změny zpět do JSON souboru
        await fs.writeFile(articlesFilePath, JSON.stringify(articles, null, 2), 'utf8');

        res.json({
            message: 'Režim úprav byl zapnut',
            article, // Vracíme upravený článek
        });
    } catch (error) {
        console.error('Chyba při zapínání režimu úprav:', error);
        res.status(500).json({ message: 'Chyba při zapínání režimu úprav' });
    }
});

app.post('/api/articles', async (req, res) => {
    try {
        // Načteme aktuální články
        await loadArticles();

        const { author } = req.body;

        // Vytvoříme nové ID
        const newId = articles.length > 0 ? Math.max(...articles.map(article => article.id)) + 1 : 1;

        // Vytvoříme nový článek z dat, která přicházejí z klienta
        const newArticle = {
            id: newId,
            author: author || 'Unknown Author',
            title: '',
            content: '',
            keywords: [],
            visibility: false,
            timestamp: new Date().toISOString(),
            imageUrl: '',
        };

        // Přidáme nový článek do seznamu
        articles.push(newArticle);

        // Uložíme změny zpět do souboru
        await fs.writeFile(articlesFilePath, JSON.stringify(articles, null, 2), 'utf8');

        res.status(201).json({
            message: 'Nový článek byl vytvořen',
            article: newArticle,
        });
    } catch (error) {
        console.error('Chyba při vytváření nového článku:', error);
        res.status(500).json({ message: 'Chyba při vytváření nového článku' });
    }
});

app.get('/api/articles/:id/cancelEdit', async (req, res) => {
    const { id } = req.params;

    try {

        await loadArticles();

        // Najdeme článek podle ID
        const articleIndex = articles.findIndex(article => article.id === parseInt(id));
        if (articleIndex === -1) {
            return res.status(404).json({ message: 'Článek nenalezen' });
        }

        // Změníme stav isEditing na false
        articles[articleIndex].isEditing = false;

        // Uložíme změny zpět do souboru
        await fs.writeFile(articlesFilePath, JSON.stringify(articles, null, 2));

        res.status(200).json({ message: 'Změny zrušeny' });
    } catch (error) {
        console.error('Chyba při rušení změn:', error);
        res.status(500).json({ message: 'Chyba při rušení změn' });
    }
});

app.delete('/api/articles/delete/:id', async (req, res) => {
    const { id } = req.params;  // Get the article id from the URL params

    try {

        await loadArticles();

        // Find the index of the article to be deleted
        const articleIndex = articles.findIndex(articles => {
            const articleId = articles.id.toString().trim();  // Convert to string and trim spaces
            const targetId = id.toString().trim();            // Convert to string and trim spaces

            console.log('Comparing article ID:', articleId, 'with ID:', targetId);

            if (articleId === targetId) {
                console.log('Found');
                return true;  // Return true when a match is found
            }
            return false;  // Otherwise, return false
        });

        if (articleIndex === -1) {
            // Article with the given id was not foundif (articleIndex === -1) {
            console.log('No article found with the given ID');
            return res.status(404).json({ message: 'Article not found' });
        } else {
            console.log('Article found at index:', articleIndex);
        }


        // Remove the article from the array
        articles.splice(articleIndex, 1);

        // Write the updated articles back to the file
        await fs.writeFile(articlesFilePath, JSON.stringify(articles, null, 2), 'utf8');

        // Respond with success
        res.status(200).json({ message: 'Article deleted successfully' });
    } catch (err) {
        // Handle errors
        console.error(err);
        res.status(500).json({ message: 'Error deleting article', error: err });
    }
});

// Spuštění serveru
app.listen(port, () => {
    console.log(`Server běží na http://localhost:${port}`);
});
