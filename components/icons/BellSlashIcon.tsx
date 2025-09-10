import React from 'react';

export const BellSlashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        {...props}
    >
        <path fillRule="evenodd" d="M12 2.25c-2.429 0-4.82-1.298-6-3.375a.75.75 0 00-1.125.041L.375 10.5a.75.75 0 00.18.981c1.455.97 3.03.97 4.485 0l.09-.06a29.96 29.96 0 0113.74 0l.09.06c1.455.97 3.03.97 4.485 0a.75.75 0 00.18-.981l-4.5-11.625a.75.75 0 00-1.125-.041C16.82 1.047 14.429 2.25 12 2.25zM3.097 12.358a.75.75 0 011.06 0l15.607 15.607a.75.75 0 01-1.06 1.06L3.097 13.418a.75.75 0 010-1.06z" clipRule="evenodd" />
        <path d="M14.25 18a2.25 2.25 0 10-4.5 0 2.25 2.25 0 004.5 0z" />
    </svg>
);