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
        fetchArticles();
    }, [fetchArticles]);

    const handleInputChange = (id, field, value) => {
        setArticles((prevArticles) =>
            prevArticles.map((article) =>
                article.id === id ? { ...article, [field]: value } : article
            )
        );
    };

    const handleUpdateArticle = async (articleId, updatedData) => {
        try {
            const response = await axios.put(`http://localhost:5000/api/articles/${articleId}`, updatedData);
            console.log("Článek aktualizován:", response.data);

            // Aktualizujte lokální stav článků (přepište pouze aktualizovaný článek)
            setArticles((prevArticles) =>
                prevArticles.map((article) =>
                    article.id === articleId ? response.data.article : article
                )
            );
        } catch (error) {
            console.error("Chyba při aktualizaci článku:", error);
        }
    };

    const handleVisibilityToggle = (id) => {
        setArticles((prevArticles) =>
            prevArticles.map((article) =>
                article.id === id ? { ...article, visibility: !article.visibility } : article
            )
        );
    };

    const handleSettings = async (id) => {
        try {
            const response = await axios.patch(`http://localhost:5000/api/articles/${id}/isEditing`);
            console.log('Stav isEditing aktualizován:', response.data);
            fetchArticles(); // Načíst články znovu, abychom zobrazili změny
        } catch (error) {
            console.error("Chyba při změně isEditing", error);
        }
    };


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

    const handleCancelEdit = async (id) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/articles/cancelEdit/${id}`);
            setArticles((prevArticles) =>
                prevArticles.map((article) =>
                    article.id === id
                        ? { ...response.data, isEditing: false } // Obnovíme data a ukončíme režim editace
                        : article
                )
            );
        } catch (error) {
            console.error("Chyba při rušení změn:", error);
        }
    };

    if (loading) {
        return <p>Načítání článků...</p>;
    }
    return (
        <Container>
            {articles.map((article) => ( // articles.filter(article => article.visibility).map((article, index) => (
                <div key={article.id} className="article-container mb-4">
                    {article.isEditing ? (
                        <><Row>
                            <Col className="article-header">
                                <Row md={10}>
                                    <Col>
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => handleVisibilityToggle(article.id)}
                                        >
                                            {article.visibility ? "Visible" : "Hidden"}
                                        </button>
                                        <p className="article-author">{article.author || 'Unknown Author'}</p>
                                    </Col>
                                    <Col>
                                        <p className="article-date text-muted">{article.timestamp}</p>
                                        <button>update time</button>
                                    </Col>
                                    <input
                                        type="text"
                                        value={article.title}
                                        onChange={(e) => handleInputChange(article.id, "title", e.target.value)}
                                        className="form-control mb-2"
                                    />
                                    <div className="article-keywords">
                                        {article.keywords ? article.keywords.map((keyword) => (
                                            <span key={keyword.id} className="hashtag">#{keyword}</span>
                                        )) : 'Unknown Keywords'}
                                    </div>
                                    <button
                                    ></button>
                                </Row>
                            </Col>

                            <Col className='position-relative img-col'>
                                <button
                                    className="icon-button settings"
                                    onClick={() => handleUpdateArticle(article.id, { ...article, isEditing: false })}
                                >
                                    <i className="fas fa-check"></i> {/* Settings icon */}
                                </button>

                                {/* Close Icon */}
                                <button
                                    className="icon-button close"
                                    onClick={() => handleCancelEdit(article.id)}
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
                        </Row>
                            <Row className='article-content'>
                                <textarea
                                    value={article.content}
                                    onChange={(e) => handleInputChange(article.id, "content", e.target.value)}
                                    className="form-control mb-2"
                                />
                            </Row>
                        </>
                    ) : (
                        <>
                            <Row>
                                <Col className="article-header">
                                    {/* First Column: Date, Author, Title, Keywords stacked vertically */}
                                    <Row md={10}>
                                        <Col>
                                            <span>{article.visibility ? 'visible' : 'hidden'}</span>
                                        </Col>
                                        <Col>
                                            <p className="article-date text-muted">{article.timestamp}</p>
                                        </Col>
                                        <p className="article-author">{article.author || 'Unknown Author'}</p>
                                        <h2>{article.title}</h2>
                                        <div className="article-keywords">
                                            {article.keywords ? article.keywords.map((keyword) => (
                                                <span key={keyword.id} className="hashtag">#{keyword}</span>
                                            )) : 'Unknown Keywords'}
                                        </div>
                                    </Row>
                                </Col>

                                <Col className='position-relative img-col'>
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
                                        <i className="fas fa-trash"></i> {/* Close icon */}
                                    </button>
                                    <Image
                                        src={article.imageUrl}
                                        alt={article.title}
                                        fluid
                                        className="article-image"  // Added class for image styling
                                    />
                                </Col>
                            </Row>
                            <Row className='article-content'>
                                <p>{article.content}</p>
                            </Row>
                        </>
                    )}
                </div>
            ))}
        </Container>
    );
};

export default ArticleList;
