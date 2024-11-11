import './index.css';
import './app.css';
import React, { useState } from 'react';
import ArticleList from './ArticleList';  // Importujeme komponentu pro seznam článků
import { Link } from 'react-router-dom';  // Import Link from react-router-dom


function App() {
    const [activeAuthor, setActiveAuthor] = useState('Red Angle');

    const handleAuthorChange = (e) => {
        setActiveAuthor(e.target.value);
    };
    return (
        <div className="body">
            <header className="App-header">
                <div className='App-header-title'>
                    <select onChange={handleAuthorChange} value={activeAuthor}>
                        <option value="Red Angle">Red Angle</option>
                        <option value="Daily.News">Daily.News</option>
                    </select>
                    <h1 className="App-title">FreshNews</h1>  {/* Název stránky */}
                    <Link to="/add"><button className="Add-article-button">New Post</button>
                    </Link>
                </div>
                <div className='App-header-text'>
                    <h1>My Articles</h1>
                </div>
            </header>
            <main>
                <ArticleList activeAuthor={activeAuthor} />
            </main>
        </div>
    );
}

export default App;
