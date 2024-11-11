import React, { useState } from 'react';
import './index.css';
import InputField from './inputField.js';
import { Link } from 'react-router-dom';


function Add() {
    const [formData, setFormData] = useState({
        id: 9,
        author: 'Red Angle',
        title: '',
        content: '',
        visibility: true,
        keywords: '',
    });

    const toggleVisibility = () => {
        setFormData((prevState) => ({
            ...prevState,
            visibility: !prevState.visibility, // Toggle the visibility state
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value, // Dynamically update the correct field based on 'name'
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();  // Prevent default form submission

        const updatedFormData = {
            ...formData,
            keywords: formData.keywords.split(/[\s,]+/).map(keyword => keyword.trim()) // Split and trim each keyword
        };

        fetch('http://localhost:5000/api/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedFormData),  // Send form data as JSON
        })
            .then((response) => {
                if (response.ok) {
                    // Manually redirect after the form submission
                    window.location.href = 'http://localhost:3000/'; // Redirect the user
                } else {
                    console.error('Form submission failed');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="controls">
                {/* Cancel button on the left */}
                <Link to="/"><button type="button" className="cancel-post-button">X</button>
                </Link>
                {/* Buttons on the right */}
                <div className="controls-buttons">
                    <button type="submit" className="post-button">Upload</button>
                    {/* Visibility toggle button */}
                    <div className='visibility-container'>
                        <span className="visibility-text">Visibility:</span>
                        <button
                            type="button"
                            className={`visibility-button ${formData.visibility ? 'visible' : 'hidden'}`}
                            onClick={toggleVisibility}
                        >
                            {formData.visibility ? 'Yes' : 'No'}
                        </button>
                    </div>
                </div>
            </div>

            <div className='input-container'>
                <InputField
                    placeholder="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                />
            </div>
            <div className='input-container'>
                <InputField
                    placeholder="key words"
                    name="keywords"
                    value={formData.keywords || ''}
                    onChange={handleInputChange}
                />
            </div>
            <div className='input-container'>
                <InputField
                    placeholder="article content"
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                />
            </div>
        </form >
    );
}

export default Add;
