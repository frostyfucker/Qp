import React from 'react';

export const BellIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        {...props}
    >
        <path fillRule="evenodd" d="M12 2.25c-2.429 0-4.82-1.298-6-3.375a.75.75 0 00-1.125.041L.375 10.5a.75.75 0 00.18.981c1.455.97 3.03.97 4.485 0l.09-.06a29.96 29.96 0 0113.74 0l.09.06c1.455.97 3.03.97 4.485 0a.75.75 0 00.18-.981l-4.5-11.625a.75.75 0 00-1.125-.041C16.82 1.047 14.429 2.25 12 2.25zM12 8.25a.75.75 0 00-.75.75v6a.75.75 0 001.5 0v-6a.75.75 0 00-.75-.75zM12 18a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" clipRule="evenodd" />
    </svg>
);