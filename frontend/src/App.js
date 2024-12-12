import './index.css';
import './app.css';
import './articleList.css';
import React, { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import axios from 'axios';
/*import Card from 'react-bootstrap/Card';*/
import { Container, Row, Col, Image } from 'react-bootstrap';

function App() {
    const [activeAuthor, setActiveAuthor] = useState('Red Angle');
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showKeywords, setShowKeywords] = useState(false);
    const [availableKeywords, setAvailableKeywords] = React.useState([]);

    const fetchArticles = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/articles/user/${activeAuthor}`);
            console.log("Načítaná data:", response.data);

            const sortedArticles = response.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

            setArticles(sortedArticles);
            fetchKeywords();
            setLoading(false);  // Data loaded, set loading to false
        } catch (error) {
            console.error("Chyba při načítání článků:", error);
            setLoading(false);  // Error loading data, set loading to false
        }
    }, [activeAuthor]);

    useEffect(() => {
        fetchArticles();
    }, [fetchArticles]);

    const fetchKeywords = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/keywords`); // Váš endpoint pro získání klíčových slov
            setAvailableKeywords(response.data);
        } catch (error) {
            console.error('Error fetching keywords:', error);
        }
    };

    const addKeywordToArticle = (id, keyword) => {
        setArticles((prevArticles) => prevArticles.map((article) => {
            if (article.id === id) {
                const updatedKeywords = article.keywords.includes(keyword) ? article.keywords : [...article.keywords, keyword];
                return { ...article, keywords: updatedKeywords };
            } return article;
        }));
    };

    const removeKeywordFromArticle = (id, keyword) => {
        setArticles((prevArticles) =>
            prevArticles.map((article) => {
                if (article.id === id) {
                    const updatedKeywords = article.keywords.filter(kw => kw !== keyword);
                    return { ...article, keywords: updatedKeywords };
                }
                return article;
            })
        );
    };

    const handleInputChange = (id, field, value) => {
        setArticles((prevArticles) =>
            prevArticles.map((article) =>
                article.id === id ? { ...article, [field]: value } : article
            )
        );
    };

    const handleUpdateTimestamp = (id) => {
        // Nastavíme nový timestamp na aktuální čas
        const newTimestamp = new Date().toISOString();
        handleInputChange(id, 'timestamp', newTimestamp); // Aktualizujeme timestamp prostřednictvím handleInputChange
        setShowKeywords(false);
    };


    const handleAuthorChange = (e) => {
        setActiveAuthor(e.target.value);
        setShowKeywords(false);
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return format(date, 'dd.MM. HH:mm');
    };

    const handleVisibilityToggle = (id) => {
        setArticles((prevArticles) =>
            prevArticles.map((article) =>
                article.id === id ? { ...article, visibility: !article.visibility } : article
            )
        );
        setShowKeywords(false);
    };

    const handleImageUrlChange = (id, newUrl) => {
        setArticles((prevArticles) => prevArticles
            .map((article) => (article.id === id ? { ...article, imageUrl: newUrl } : article))
        );
    };
    const handleUpdateArticle = async (articleId, updatedData) => {
        try {
            const response = await axios.put(`http://localhost:5000/api/articles/${articleId}`, updatedData);
            console.log("Článek aktualizován:", response.data);
            console.log(response.data);
            fetchArticles();
            setShowKeywords(false);
        } catch (error) {
            console.error("Chyba při aktualizaci článku:", error);
        }
    };

    const handleSettings = async (id) => {
        try {
            const response = await axios.patch(`http://localhost:5000/api/articles/${id}/isEditing`);
            console.log('Stav isEditing aktualizován:', response.data);
            fetchArticles(); // Načíst články znovu, abychom zobrazili změny
            setShowKeywords(false);
        } catch (error) {
            console.error("Chyba při změně isEditing", error);
        }
    };


    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:5000/api/articles/delete/${id}`);
            console.log(response.data);
            fetchArticles();
            setShowKeywords(false);
        } catch (error) {
            console.error("Error deleting article", error);
            fetchArticles();
        }
    };

    const handleCancelEdit = async (id) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/articles/${id}/cancelEdit`);
            console.log(response.data);
            fetchArticles();
            setShowKeywords(false);
        } catch (error) {
            console.error("Chyba při rušení změn:", error);
        }
    };

    const handleNewPost = async () => {
        try {
            const newArticle = {
                author: activeAuthor,
            };

            const response = await axios.post('http://localhost:5000/api/articles', newArticle);
            console.log('Nový článek vytvořen:', response.data);

            fetchArticles(); // Znovu načteme články, aby se nový článek objevil v seznamu
            setShowKeywords(false);
        } catch (error) {
            console.error('Chyba při vytváření nového článku:', error);
        }
    };

    if (loading) {
        return <p>Načítání článků...</p>;
    }
    return (
        <div className="body">
            <header className="App-header">
                <div className='App-header-title'>
                    <select onChange={handleAuthorChange} value={activeAuthor}>
                        <option value="Red Angle">Red Angle</option>
                        <option value="Daily.News">Daily.News</option>
                    </select>
                    <h1 className="App-title">FreshNews</h1>  {/* Název stránky */}
                    <button className="Add-article-button" onClick={handleNewPost}>New Post</button>
                </div>
                <div className='App-header-text'>
                    <h1>My Articles</h1>
                </div>
            </header>
            <main>
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
                                                    <h5>{article.visibility ? "Visible" : "Hidden"}</h5>
                                                </button>
                                                <h3 className="article-author">{article.author || 'Unknown Author'}</h3>
                                            </Col>
                                            <Col className='on-right'>
                                                <p className="article-date">{formatDate(article.timestamp)}</p>
                                                <button onClick={() => handleUpdateTimestamp(article.id)}>update time</button>
                                            </Col>
                                            <input
                                                type="text"
                                                value={article.title}
                                                onChange={(e) => handleInputChange(article.id, "title", e.target.value)}
                                                className="form-control mb-2"
                                                placeholder="Enter article title"
                                            />
                                            <div className="article-keywords">
                                                {article.keywords ? article.keywords.map((keyword, index) => (
                                                    <button key={index} className="hashtag" onClick={() => removeKeywordFromArticle(article.id, keyword)
                                                    }>#{keyword} <i className="fas fa-times"></i></button>
                                                )) : 'Unknown Keywords'}
                                                {showKeywords ? (
                                                    <><button onClick={() => setShowKeywords(false)} className='hashtag' ><i className="fas fa-plus"></i>
                                                    </button>
                                                    </>
                                                ) : (
                                                    <><button onClick={() => {
                                                        fetchKeywords();
                                                        setShowKeywords(true);
                                                    }} className='hashtag' ><i className="fas fa-plus"></i>
                                                    </button>
                                                    </>
                                                )}
                                                {showKeywords && (
                                                    <div className="keyword-dropdown">
                                                        {availableKeywords.map(keyword => (
                                                            <button
                                                                key={keyword.id}
                                                                className="keyword-item"
                                                                onClick={() => addKeywordToArticle(article.id, keyword.name)} > {keyword.name}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </Row>
                                    </Col>

                                    <Col md={5} className='position-relative img-col'>
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
                                        <div> <input
                                            type="text"
                                            value={article.imageUrl}
                                            onChange={(e) => handleImageUrlChange(article.id, e.target.value)}
                                            placeholder="Enter image URL" />
                                        </div>
                                    </Col>
                                </Row>
                                    <Row className='article-content'>
                                        <textarea
                                            value={article.content}
                                            onChange={(e) => handleInputChange(article.id, "content", e.target.value)}
                                            className="form-control mb-2"
                                            placeholder="Enter article content"
                                        />
                                    </Row>
                                </>
                            ) : (
                                <>
                                    <Row>
                                        <Col className="article-header">
                                            {/* First Column: Date, Author, Title, Keywords stacked vertically */}
                                            <Row md={10}>
                                                <Col className={article.visibility ? 'visible' : 'hidden'}>
                                                    <h5>{article.visibility ? 'visible' : 'hidden'}</h5>
                                                </Col>
                                                <Col className='on-right'>
                                                    <p className="article-date">{formatDate(article.timestamp)}</p>
                                                </Col>
                                                <h3 className="article-author">{article.author || 'Unknown Author'}</h3>
                                                <h2>{article.title}</h2>
                                                <div className="article-keywords">
                                                    {article.keywords ? article.keywords.map((keyword, index) => (
                                                        <span key={index} className="hashtag">#{keyword}</span>
                                                    )) : 'Unknown Keywords'}
                                                </div>
                                            </Row>
                                        </Col>

                                        <Col md={5} className='position-relative img-col'>
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
                    ))
                    }
                </Container >
            </main >
        </div >
    );
}

export default App;
