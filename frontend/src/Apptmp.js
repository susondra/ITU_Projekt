import React from 'react';
import './App.css';
import ArticleList from './ArticleList';  // Importujeme komponentu pro seznam článků
import TESTAPP from './testapp';

function App() {
    return (
        <div className="App">
            <TESTAPP />
            <ArticleList /> {/* Zobrazí seznam článků */}
        </div>
    );
}

export default App;

