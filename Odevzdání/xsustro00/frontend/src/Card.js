import './card.css';
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Image, Row, Col } from 'react-bootstrap';

const getTopKeywords = (articles, articleKeywords, count = 3) => {
    const keywordCounts = {};

    // Projdeme všechny články autora a spočítáme klíčová slova 
    articles.forEach(article => {
        article.keywords.forEach(keyword => {
            if (!articleKeywords.includes(keyword)) {
                keywordCounts[keyword] = (keywordCounts[keyword] || 0) + 1;
            }
        });
    });

    // Seřadíme klíčová slova podle počtu výskytů 
    const sortedKeywords = Object.entries(keywordCounts).sort((a, b) => b[1] - a[1]);

    // Vrátíme top klíčová slova 
    return sortedKeywords.slice(0, count).map(entry => ({ name: entry[0] }));
};


const sortKeywordsAlphabetically = (keywords) => {
    return keywords.sort((a, b) => a.name.localeCompare(b.name));
};

const Card = ({ article, articles, fetchArticles, handleVisibilityToggle, handleInputChange,
    removeKeywordFromArticle, availableKeywords, fetchKeywords, addKeywordToArticle, handleUpdateArticle,
    handleDelete, handleCancelEdit, handleImageUrlChange, startEditing, stopEditing, newArticleId }) => {

    const [isEditing, setIsEditing] = useState(false);
    const [showKeywords, setShowKeywords] = useState(false);
    const [topKeywords, setTopKeywords] = useState([]);


    useEffect(() => {
        setTopKeywords(getTopKeywords(articles, article.keywords));
    }, [article.keywords, articles]);

    const filteredKeywords = availableKeywords.filter(
        keyword => !article.keywords.includes(keyword.name)
    );


    const otherKeywords = sortKeywordsAlphabetically(
        filteredKeywords.filter(keyword => !topKeywords.some(topKeyword => topKeyword.name === keyword.name))
    );

    useEffect(() => {
        if (article.id === newArticleId) {
            setIsEditing(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newArticleId]); // article.id je ignorováno

    const handleUpdateTimestamp = (id) => {
        // Nastavíme nový timestamp na aktuální čas
        const newTimestamp = new Date().toISOString();
        handleInputChange(id, 'timestamp', newTimestamp); // Aktualizujeme timestamp prostřednictvím handleInputChange
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return format(date, 'dd.MM. HH:mm');
    };

    const handleEditClick = () => {
        if (startEditing(article.id)) {
            setIsEditing(true);
        }
    };

    const handleSaveClick = () => {
        stopEditing();
        setIsEditing(false);
        setShowKeywords(false);
    };

    return (
        <div key={article.id} className="article-container mb-4">
            {isEditing ? (
                <><Row>
                    <Col className="article-header">
                        <Row md={10}>
                            <input
                                type="text"
                                value={article.title}
                                onChange={(e) => handleInputChange(article.id, "title", e.target.value)}
                                className="form-control mb-2"
                                placeholder="Enter article title"
                            />
                            <Col>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => {
                                        handleVisibilityToggle(article.id);
                                        setShowKeywords(false);
                                    }}
                                >
                                    <h5 className={article.visibility ? 'visible' : 'hidden'}>{article.visibility ? "VISIBLE" : "HIDDEN"}</h5>
                                </button>
                                <h3 className="article-author">Author: {article.author || 'Unknown Author'}</h3>
                            </Col>
                            <Col>
                                <p className="article-date">Date: {formatDate(article.timestamp)}</p>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => {
                                        handleUpdateTimestamp(article.id);
                                        setShowKeywords(false);
                                    }}>update time</button>
                            </Col>

                            <div className="article-keywords">
                                {article.keywords ? article.keywords.map((keyword, index) => (
                                    <button key={index} className="hashtag" onClick={() => {
                                        removeKeywordFromArticle(article.id, keyword);
                                    }
                                    }>#{keyword} <i className="fas fa-times"></i></button>
                                )) : 'Unknown Keywords'}
                                {showKeywords ? (
                                    <><button onClick={() => setShowKeywords(false)} className='hashtag' ><i className="fas fa-minus"></i>
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
                                        <table className="keyword-table">
                                            <tbody>
                                                {/* První řádek se statisticky nejčastějšími klíčovými slovy */}
                                                <tr className="special-row">
                                                    {topKeywords.map((keyword, index) => (
                                                        <td key={index}>
                                                            <button
                                                                className="keyword-item hashtag"
                                                                onClick={() => {
                                                                    addKeywordToArticle(article.id, keyword.name);
                                                                }}
                                                            >
                                                                #{keyword.name}
                                                            </button>
                                                        </td>
                                                    ))}
                                                </tr>
                                                {/* Ostatní klíčová slova */}
                                                {otherKeywords.map((keyword, index) => {
                                                    if (index % 3 === 0) {
                                                        return (
                                                            <tr key={index}>
                                                                <td>
                                                                    <button
                                                                        className="keyword-item hashtag"
                                                                        onClick={() => {
                                                                            addKeywordToArticle(article.id, keyword.name);
                                                                        }}
                                                                    >
                                                                        #{keyword.name}
                                                                    </button>
                                                                </td>
                                                                <td>
                                                                    {index + 1 < otherKeywords.length && (
                                                                        <button
                                                                            className="keyword-item hashtag"
                                                                            onClick={() => {
                                                                                addKeywordToArticle(article.id, otherKeywords[index + 1].name);
                                                                            }}
                                                                        >
                                                                            #{otherKeywords[index + 1].name}
                                                                        </button>
                                                                    )}
                                                                </td>
                                                                <td>
                                                                    {index + 2 < otherKeywords.length && (
                                                                        <button
                                                                            className="keyword-item hashtag"
                                                                            onClick={() => {
                                                                                addKeywordToArticle(article.id, otherKeywords[index + 2].name);
                                                                            }}
                                                                        >
                                                                            #{otherKeywords[index + 2].name}
                                                                        </button>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        );
                                                    }
                                                    return null;
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                            </div>
                        </Row>
                    </Col>

                    <Col md={5} className='position-relative img-col'>
                        <div className='article-controls'>
                            <button
                                className="icon-button settings"
                                onClick={() => {
                                    handleUpdateArticle(article.id, { ...article });
                                    handleSaveClick();
                                }}
                            >
                                <i className="fas fa-check"></i> {/* Settings icon */}
                            </button>

                            {/* Close Icon */}
                            <button
                                className="icon-button close"
                                onClick={() => {
                                    console.log(newArticleId);
                                    if (article.id === newArticleId) {
                                        handleDelete(article.id);
                                    } else {
                                        handleCancelEdit(article.id);
                                    }
                                    handleSaveClick();
                                }}
                            >
                                <i className="fas fa-times"></i> {/* Close icon */}
                            </button>
                        </div>
                        <div className='article-edit-img'>
                            <div className='url-input'><input
                                type="text"
                                value={article.imageUrl}
                                onChange={(e) => {
                                    handleImageUrlChange(article.id, e.target.value);
                                    setShowKeywords(false);
                                }}
                                placeholder="Enter image URL" />
                            </div>
                            <Image
                                src={article.imageUrl}
                                alt={article.title}
                                fluid
                                className="article-image"  // Added class for image styling
                            />
                        </div>
                    </Col>
                </Row>
                    <Row className='article-content'>
                        <textarea
                            value={article.content}
                            onChange={(e) => {
                                handleInputChange(article.id, "content", e.target.value);
                                setShowKeywords(false);
                            }}
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
                                <h1>{article.title}</h1>
                                <Col className={article.visibility ? 'visible' : 'hidden'}>
                                    <h5>{article.visibility ? "VISIBLE" : "HIDDEN"}</h5>
                                </Col>
                                <Col className='on-right'>
                                    <p className="article-date">Date: {formatDate(article.timestamp)}</p>
                                </Col>
                                <h3 className="article-author">Author: {article.author || 'Unknown Author'}</h3>

                                <div className="article-keywords">
                                    {article.keywords ? article.keywords.map((keyword, index) => (
                                        <span key={index} className="hashtag shown-keywords">#{keyword}</span>
                                    )) : 'Unknown Keywords'}
                                </div>
                            </Row>
                        </Col>

                        <Col md={5} className='position-relative img-col'>
                            <button
                                className="icon-button settings"
                                onClick={() => {
                                    handleEditClick();
                                    fetchArticles();
                                }}
                            >
                                <i className="fas fa-cog"></i> {/* Settings icon */}
                            </button>

                            {/* Close Icon */}
                            <button
                                className="icon-button close"
                                onClick={() =>
                                    handleDelete(article.id)
                                }
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
            )
            }
        </div >)

};

export default Card;