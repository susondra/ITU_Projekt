import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const ArticleList = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Načítání dat z JSON souboru (nebo API)
        axios.get('http://localhost:5000/api/articles') // nebo z API endpointu
            .then(response => {
                console.log("Načtená data: ", response.data); // Logování načtených dat
                setArticles(response.data);
                setLoading(false); // Po načtení dat nastavíme loading na false
            })
            .catch(error => {
                console.error("Chyba při načítání článků:", error);
                setLoading(false); // Po načtení dat nastavíme loading na false
            });
    }, []);


    if (loading) {
        return <p>Načítání článků...</p>;
    }
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
};

export default ArticleList;
