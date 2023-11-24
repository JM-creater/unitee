import { useState } from "react";

export const SearchBar = ({ onSearchChange }) => {
    const [input, setInput] = useState('');

    const handleChange = (event) => {
        const value = event.target.value;
        setInput(value);
        onSearchChange(value);
    }

    return (
        <div className="input-wrapper">
            <input
                placeholder="Type to search..."
                value={input}
                onChange={handleChange}
            />
        </div>
    );
}