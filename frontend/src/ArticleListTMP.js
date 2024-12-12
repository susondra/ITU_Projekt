import './articleList.css';
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
/*import Card from 'react-bootstrap/Card';*/
import { Container, Row, Col, Image } from 'react-bootstrap';


const ArticleList = ({ activeAuthor }) => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchArticles = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/articles/user/${activeAuthor}`);
            console.log("Načítaná data:", response.data);
            setArticles(response.data);
            setLoading(false);  // Data loaded, set loading to false
        } catch (error) {
            console.error("Chyba při načítání článků:", error);
            setLoading(false);  // Error loading data, set loading to false
        }
    }, [activeAuthor]);

    useEffect(() => {
        fetchArticles();  // Fetch articles when the component is mounted
    }, []);

    useEffect(() => {
        fetchArticles();  // Fetch articles on component mount
    }, [fetchArticles]);

    const handleSettings = async (id) => {
        try {
            const updatedSettings = { /* settings data */ };
            const response = await axios.edit(`http://localhost:5000/api/articles/settings/${id}`, updatedSettings);
            console.log(response.data);
            fetchArticles();
        } catch (error) {
            console.error("Error updating settings", error);
            fetchArticles();
        }
    };

    // Function to handle close (delete) click and make the API call to remove the article
    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:5000/api/articles/delete/${id}`);
            console.log(response.data);
            fetchArticles();
        } catch (error) {
            console.error("Error deleting article", error);
            fetchArticles();
        }
    };

    if (loading) {
        return <p>Načítání článků...</p>;
    }
    return (
        <Container>
            {articles.filter(article => article.visibility).map((article, index) => (
                <div key={index} className="article-container mb-4">
                    <Col className="article-header">
                        {/* First Column: Date, Author, Title, Keywords stacked vertically */}
                        <Row md={8}>
                            <p className="article-date text-muted">{article.timestamp}</p>
                            <p className="article-author">{article.author || 'Unknown Author'}</p>
                            <h2>{article.title}</h2>
                            <div className="article-keywords">
                                {article.keywords ? article.keywords.map((keyword, index) => (
                                    <span key={index} className="hashtag">#{keyword}</span>
                                )) : 'No Keywords'}
                            </div>
                        </Row>

                        {/* Second Column: Image */}
                        <Col md={4} className='position-relative'>
                            <button
                                className="icon-button settings"
                                onClick={() => handleSettings(article.id)}
                            >
                                <i className="fas fa-cog"></i> {/* Settings icon */}
                            </button>

                            {/* Close Icon */}
                            <button
                                className="icon-button close"
                                onClick={() => handleDelete(article.id)}
                            >
                                <i className="fas fa-times"></i> {/* Close icon */}
                            </button>
                            <Image
                                src={article.imageUrl}
                                alt={article.title}
                                fluid
                                className="article-image"  // Added class for image styling
                            />
                        </Col>
                    </Col>

                    {/* Article Content */}
                    <Row>
                        <Col md={12}>
                            <p>{article.content}</p>
                        </Col>
                    </Row>
                </div>
            ))}
        </Container>
    );
};

export default ArticleList;
