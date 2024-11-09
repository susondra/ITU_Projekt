import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TESTAPP() {
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        // Načítání článků při spuštění komponenty
        axios.get('http://localhost:5000/api/articles') // Tady dáváme URL na server
            .then(response => {
                setArticles(response.data); // Uložení článků do stavu
            })
            .catch(error => {
                console.error('Chyba při načítání článků:', error);
            });
    }, []);

    return (
        <Container>
            <h1>Moje články</h1>
            {articles.map((article, index) => (
                <div key={index} className="mb-4">
                    <Row>
                        <Col md={8} className="text-muted">
                            {article.publishedAt}
                        </Col>
                        <Col md={6}>
                            {article.author || 'Unknown Author'}
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Image src={article.urlToImage} alt={article.title} fluid />
                        </Col>
                        <Col md={6}>
                            <h2>{article.title}</h2>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6} className="text-info">
                            {article.keywords?.join(', ') || 'No Keywords'}
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12}>
                            <p>{article.content}</p>
                            <a href={article.url} target="_blank" rel="noopener noreferrer">
                                Číst více
                            </a>
                        </Col>
                    </Row>
                </div>
            ))}
        </Container>
    );
}

export default TESTAPP;
