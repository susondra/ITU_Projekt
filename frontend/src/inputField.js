import React from 'react';

function InputField({ type = 'text', placeholder, name, value, onChange }) {
    return (
        <div>
            <h3>{placeholder}</h3>
            <input
                type={type}
                placeholder={'insert ' + placeholder}
                name={name}
                value={value}
                onChange={onChange}
            />
        </div>
    );
}

export default InputField;