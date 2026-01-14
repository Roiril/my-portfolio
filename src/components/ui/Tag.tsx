import React from 'react';

interface TagProps {
    children: React.ReactNode;
    className?: string;
}

export const Tag: React.FC<TagProps> = ({ children, className = '' }) => {
    return (
        <span
            className={`text-[13px] text-gray-700 bg-gray-100 border border-gray-200 px-3 py-0.5 leading-snug ${className}`}
        >
            {children}
        </span>
    );
};

export default Tag;
