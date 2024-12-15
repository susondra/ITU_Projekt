import './app.css';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import Card from './Card.js';
import { Container } from 'react-bootstrap';

/*
autor: Ondřej Šustr (xsustro00)

hlavní dokument aplikace
struktura aplikace se nachází zde (+ volání Card, nižší komponenta)

*/

function App() {
    const [activeAuthor, setActiveAuthor] = useState('Red Angle');
    const [newArticleId, setNewArticleId] = useState([0]);
    const [articles, setArticles] = useState([]);
    const [filteredArticles, setFilteredArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [availableKeywords, setAvailableKeywords] = React.useState([]);
    const [editingActive, setEditingActive] = useState(false);
    const [sortOrder, setSortOrder] = useState('desc');
    const [dateFrom, setDateFrom] = useState(false);
    const [dateTo, setDateTo] = useState(false);
    const headerControlsRef = useRef(null);


    const fetchArticles = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/articles/user/${activeAuthor}`);
            console.log("Načítaná data:", response.data);

            let sortedArticles = response.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            if (sortOrder === 'asc') {
                sortedArticles = sortedArticles.reverse();
            }
            setArticles(sortedArticles);
            setFilteredArticles(sortedArticles);
            fetchKeywords();
            setLoading(false);
        } catch (error) {
            console.error("Chyba při načítání článků:", error);
            setLoading(false);
        }
    }, [activeAuthor, sortOrder]);

    useEffect(() => {
        fetchArticles();
    }, [fetchArticles]);

    const fetchKeywords = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/keywords`); // Endpoint pro získání klíčových slov
            setAvailableKeywords(response.data);
        } catch (error) {
            console.error('Error fetching keywords:', error);
        }
    };

    const addKeywordToArticle = (id, keyword) => {
        setFilteredArticles((prevArticles) => prevArticles.map((article) => {
            if (article.id === id) {
                const updatedKeywords = article.keywords.includes(keyword) ? article.keywords : [...article.keywords, keyword];
                return { ...article, keywords: updatedKeywords };
            } return article;
        }));
    };

    const removeKeywordFromArticle = (id, keyword) => {
        setFilteredArticles((prevArticles) =>
            prevArticles.map((article) => {
                if (article.id === id) {
                    const updatedKeywords = article.keywords.filter(kw => kw !== keyword);
                    return { ...article, keywords: updatedKeywords };
                }
                return article;
            })
        );
    };

    const toggleSortOrder = () => {
        setSortOrder((prevOrder) => (prevOrder === 'desc' ? 'asc' : 'desc'));
    };

    const handleDateFilter = async () => {
        const filteredArticles = articles.filter(article => {
            const articleDate = new Date(article.timestamp);
            const from = dateFrom ? new Date(dateFrom) : new Date('1970-01-01');
            const to = dateTo ? new Date(dateTo) : new Date();
            return articleDate >= from && articleDate <= to;
        });
        setFilteredArticles(filteredArticles);
    };

    const handleCleanFilter = async () => {
        setDateFrom('');
        setDateTo('');
        fetchArticles();
    }

    const startEditing = (articleId) => {
        if (editingActive) {
            alert('Prvně ukončete úpravu předchozího článku, než budete upravovat nový.');
            return false;
        } else {
            setEditingActive(articleId);
            return true;
        }
    };

    const newPost = () => {
        if (editingActive) {
            alert('Prvně ukončete úpravu předchozího článku, než vytvoříte nový.');
            return false;
        } else {
            return true;
        }
    };

    const stopEditing = () => {
        setEditingActive(false);
    };

    const handleInputChange = (id, field, value) => {
        setFilteredArticles((prevArticles) =>
            prevArticles.map((article) =>
                article.id === id ? { ...article, [field]: value } : article
            )
        );
    };

    const handleAuthorChange = (e) => {
        setActiveAuthor(e.target.value);
    };


    const handleVisibilityToggle = (id) => {
        setFilteredArticles((prevArticles) =>
            prevArticles.map((article) =>
                article.id === id ? { ...article, visibility: !article.visibility } : article
            )
        );

    };

    const handleImageUrlChange = (id, newUrl) => {
        setFilteredArticles((prevArticles) => prevArticles
            .map((article) => (article.id === id ? { ...article, imageUrl: newUrl } : article))
        );
    };

    const handleUpdateArticle = async (articleId, updatedData) => {
        try {
            const response = await axios.put(`http://localhost:5000/api/articles/${articleId}`, updatedData);
            console.log("Článek aktualizován:", response.data);
            console.log(response.data);
            if (newArticleId !== 0) {
                setNewArticleId(0);
            }
            fetchArticles();
        } catch (error) {
            console.error("Chyba při aktualizaci článku:", error);
        }
    };

    const handleDelete = async (id) => {
        if (editingActive && newArticleId !== id) {
            alert('Prvně ukončete úpravu článku.');
        } else {
            try {

                const response = await axios.delete(`http://localhost:5000/api/articles/delete/${id}`);
                console.log(response.data);
                if (newArticleId !== 0) {
                    setNewArticleId(0);
                }
                fetchArticles();
            } catch (error) {
                console.error("Error deleting article", error);
                fetchArticles();
            }
        }
    };

    const handleCancelEdit = async (id) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/articles/${id}/cancelEdit`);
            console.log(response.data);
            if (newArticleId !== 0) {
                setNewArticleId(0);
            }
            fetchArticles();
        } catch (error) {
            console.error("Chyba při rušení změn:", error);
        }
    };

    const handleNewPost = async () => {
        if (newPost()) {
            try {
                const newArticle = {
                    author: activeAuthor,
                };

                const response = await axios.post('http://localhost:5000/api/articles', newArticle);
                console.log('Nový článek vytvořen:', response.data);
                setNewArticleId(response.data.article.id);
                setEditingActive(true);
                setSortOrder('desc');
                fetchArticles();
            } catch (error) {
                console.error('Chyba při vytváření nového článku:', error);
            }
        }
    };


    useEffect(() => {
        let lastScrollTop = 0;

        const checkHeaderControls = () => {
            if (headerControlsRef.current) {
                const onScroll = () => {
                    let scrollTop = window.scrollY || document.documentElement.scrollTop;
                    if (scrollTop > lastScrollTop) {
                        headerControlsRef.current.style.top = '-60px';
                        console.log('Scrolling down');
                    } else {
                        headerControlsRef.current.style.top = '0px';
                        console.log('Scrolling up');
                    }
                    lastScrollTop = scrollTop;
                };

                window.addEventListener('scroll', onScroll);

                return () => {
                    window.removeEventListener('scroll', onScroll);
                };
            } else {
                setTimeout(checkHeaderControls, 100); // Znovu zkontrolovat po 100 ms
            }
        };

        checkHeaderControls();
    }, []);


    if (loading) {
        return <p>Načítání článků...</p>;
    }
    return (
        <div className="body">
            <header>
                <div className='App-header'>
                    <div className='App-header-title'>
                        <select onChange={handleAuthorChange} value={activeAuthor}>
                            <option value="Red Angle">Red Angle</option>
                            <option value="Daily.News">Daily.News</option>
                            <option value="Tester">Tester</option>
                        </select>
                        <h1 className="App-title">FreshNews</h1>
                        <button className="Add-article-button" onClick={handleNewPost}><h4>New Post</h4></button>
                    </div>
                    <div className='App-header-text'>
                        <h2>My Articles</h2>
                    </div>
                </div>
                <div className='header-controls' ref={headerControlsRef}>
                    <button className="filter-button" onClick={toggleSortOrder}>
                        By time <i className={sortOrder === 'desc' ? 'fas fa-arrow-down' : 'fas fa-arrow-up'}></i>
                    </button>
                    <div className='filter'>
                        <span>od </span><input
                            type="date"
                            className="date-input"
                            value={dateFrom}
                            onChange={(e) => setDateFrom(e.target.value)} />
                        <span>do </span><input
                            type="date"
                            className="date-input"
                            value={dateTo}
                            onChange={(e) => setDateTo(e.target.value)} />
                        <button className="search-button" onClick={handleDateFilter}>
                            <i className="fas fa-search"></i>
                        </button>
                        <button className="search-button" onClick={handleCleanFilter}>
                            Clean filter
                        </button>
                    </div>
                </div>
            </header>
            <main>
                <Container>
                    {filteredArticles.map((article) => (
                        <Card
                            key={article.id}
                            article={article}
                            articles={articles}
                            fetchArticles={fetchArticles}
                            handleVisibilityToggle={handleVisibilityToggle}
                            handleInputChange={handleInputChange}
                            removeKeywordFromArticle={removeKeywordFromArticle}
                            availableKeywords={availableKeywords}
                            fetchKeywords={fetchKeywords}
                            addKeywordToArticle={addKeywordToArticle}
                            handleUpdateArticle={handleUpdateArticle}
                            handleDelete={handleDelete}
                            handleCancelEdit={handleCancelEdit}
                            handleImageUrlChange={handleImageUrlChange}
                            startEditing={startEditing}
                            stopEditing={stopEditing}
                            newArticleId={newArticleId}
                        />
                    ))
                    }
                </Container >
            </main >
        </div >
    );
}

export default App;
