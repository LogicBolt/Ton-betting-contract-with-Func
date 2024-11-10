// BottomBar.tsx
import React, { useState } from 'react';
import './style.css';

interface ButtomProps {
    onBottomFilterChange: (filter: number | null) => void; // Accept filter change as a prop
}

const BottomBar: React.FC<ButtomProps> = ({ onBottomFilterChange }) => {
    const [activeButton, setActiveButton] = useState<number | null>(1);

    const handleButtonClick = (index: number) => {
        setActiveButton(index);
        onBottomFilterChange(index);
    };

    return (
        <div className="bottom-bar">
            <div className="button-group">
                <button
                    key='all_lot'
                    className={`bottom-button ${activeButton === 1 ? 'active' : ''}`}
                    onClick={() => handleButtonClick(1)}
                >
                    All Lot
                </button>
                <button
                    key="my_lot"
                    className={`bottom-button ${activeButton === 2 ? 'active' : ''}`}
                    onClick={() => handleButtonClick(2)}
                >
                    My Lot
                </button>
            </div>
        </div>
    );
};

export default BottomBar;
