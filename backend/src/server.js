const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

// Použití middleware
app.use(cors()); // Povolit požadavky z jiných domén
app.use(express.json()); // Pro práci s JSON daty

let articles = [{
    id: "1",
    title: "První článek",
    isPublic: true,
    keywords: ["React", "JavaScript", "Backend"],
    imageUrl: "https://example.com/image1.jpg",
    content: "Toto je obsah prvního článku."
},
{
    id: "2",
    title: "Druhý článek",
    isPublic: false,
    keywords: ["Node.js", "Express"],
    imageUrl: "https://example.com/image2.jpg",
    content: "Toto je obsah druhého článku."
}
];

// Hlavní routa pro získání seznamu článků
app.get('/api/articles', (req, res) => {
    res.json(articles);  // Odeslání článků do frontendové aplikace
});

// Spuštění serveru
app.listen(port, () => {
    console.log(`Server běží na http://localhost:${port}`);
});
