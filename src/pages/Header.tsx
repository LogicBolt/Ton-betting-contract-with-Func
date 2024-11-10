// Header.tsx
import React, { useEffect, useState } from 'react';
import './style.css';
import {
    TonConnectButton,

} from '@tonconnect/ui-react';
interface HeaderProps {
    onFilterChange: (filter: number[] | null) => void; // Accept filter change as a prop
}
const Header: React.FC<HeaderProps> = ({ onFilterChange }) => {
    const [activeButtons, setActiveButtons] = useState<number[]>([0, 1, 2]);

    const handleButtonClick = (index: number) => {
        setActiveButtons((prev) => {
            const newActiveButtons = prev.includes(index)
                ? prev.filter((i) => i !== index) // Deselect
                : [...prev, index];                // Select

            // Call the parent function to update the filter
            onFilterChange(newActiveButtons.length > 0 ? newActiveButtons : null); // Update filter to the first selected button or null
            return newActiveButtons;
        });
    };
    useEffect(() => {
    }, [activeButtons]);
    return (
        <>
            <div className="header">
                <div className="button-group"> {/* Add button group wrapper */}
                    <button
                        className={`header-button ${activeButtons.includes(0) ? 'active' : ''}`}
                        onClick={() => handleButtonClick(0)}
                    >
                        Upcoming
                    </button>
                    <button
                        className={`header-button ${activeButtons.includes(1) ? 'active' : ''}`}
                        onClick={() => handleButtonClick(1)}
                    >
                        Ongoing
                    </button>
                    <button
                        className={`header-button ${activeButtons.includes(2) ? 'active' : ''}`}
                        onClick={() => handleButtonClick(2)}
                    >
                        Completed
                    </button>
                </div>

            </div>
            <div className='connect-wallet'>
                <TonConnectButton />
            </div>
        </>
    );
};

export default Header;
