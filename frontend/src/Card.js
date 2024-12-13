


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