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

app.get('/api/articles/user/:userName', async (req, res) => {
    const { userName } = req.params;

    try {
        // Read users and articles from JSON files
        const usersData = await fs.readFile(usersFilePath, 'utf8');
        const users = JSON.parse(usersData);
        loadArticles();
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

/*
app.get('/api/articles', async (req, res) => {
    const filePath = path.join(__dirname, 'articles.json');  // Path to articles.json

    try {
        // Read the articles.json file asynchronously
        const data = await fs.readFile(filePath, 'utf8');

        // Parse the data into a JavaScript object (array of articles)
        const articles = JSON.parse(data);

        const structuredArticles = articles.map((article) => ({
            title: article.title,
            content: article.content,
            keywords: article.keywords,
            visibility: article.isPublic, // assuming you want 'isPublic' as 'visibility'
            timestamp: article.timestamp || new Date().toISOString(),  // Add timestamp if not already present
        }));

        // Send the articles as a JSON response
        res.json(structuredArticles);
    } catch (error) {
        // If an error occurs (e.g., file not found or invalid JSON), return a 500 error
        console.error('Error reading articles.json:', error);
        res.status(500).json({ error: 'Failed to load articles' });
    }
});*/

// Hlavní routa pro získání seznamu článků
/*app.get('/api/articles', async (req, res) => {
    loadArticles();
    res.json(articles);  // Odeslání článků do frontendové aplikace
});*/

/*
app.post('/api/articles/addKeyword/:articleId', (req, res) => {
    const { articleId } = req.params;
    const { keywordId } = req.body;  // The keywordId to add

    const article = articles.find(a => a.id === articleId);
    if (article) {
        article.keywords.push(keywordId);  // Add the keyword to the article
        res.status(200).json({ message: 'Keyword added successfully', article });
    } else {
        res.status(404).json({ message: 'Article not found' });
    }
});*/

app.post('/api/add', async (req, res) => {
    const { id, author, title, content, keywords, visibility } = req.body;

    // Create an article object to store the data
    const article = {
        id,
        author,
        title,
        visibility,
        keywords,
        content,
        timestamp: new Date().toISOString(), // Optional: add a timestamp
    };

    try {
        console.log('Reading file...');
        // Read the current articles from the file asynchronously
        let data = await fs.readFile(articlesFilePath, 'utf8');

        // If the file is empty, initialize an empty array
        let articles = data ? JSON.parse(data) : [];

        console.log('Adding new article...');
        // Add the new article to the array
        articles.push(article);

        console.log('Writing to file...');
        // Write the updated list of articles back to the file asynchronously
        await fs.writeFile(articlesFilePath, JSON.stringify(articles, null, 2), 'utf8');

        // After writing the file, redirect to frontend
        console.log('Redirecting...');
        res.redirect('http://localhost:3000/');  // Redirect to frontend after success

    } catch (err) {
        // Handle errors for reading or writing the file
        console.error(err);
        res.status(500).json({ error: 'Failed to process the data' });
    }
});

app.delete('/api/articles/delete/:id', async (req, res) => {
    const { id } = req.params;  // Get the article id from the URL params

    try {
        // Read the current articles from the file

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
