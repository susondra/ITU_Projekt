import React from 'react';
import logo from './logo.svg';
import './App.css';
import NewsComponent from './NewsComponent';
import ArticleList from './ArticleList';  // Importujeme komponentu pro seznam článků


function App() {
    return (
        <div className="App">
            <header className="App-header">
                <h1 className="App-title">FreshNews</h1>  {/* Název stránky */}
                <button className="Add-article-button">Tlačítko</button>  {/* Tlačítko vpravo */}
                <button>Tlacitko</button>
            </header>
            <main>
                <ArticleList />
            </main>
            <footer className="App-footer">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    Edit <code>src/App.js</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </footer>
        </div>
    );
}

export default App;
