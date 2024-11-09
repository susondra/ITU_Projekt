import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Image } from 'react-bootstrap';

const NewsComponent = () => {
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await axios.get('https://newsapi.org/v2/top-headlines', {
                    params: {
                        country: 'us',
                        apiKey: '6c311fcf210e4d72ab7b70bde7744a41',
                    },
                });
                setArticles(response.data.articles);
            } catch (error) {
                console.error('Chyba při načítání novinek:', error);
            }
        };
        fetchNews();
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
};

export default NewsComponent;
