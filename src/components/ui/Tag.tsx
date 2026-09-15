import React from 'react';

interface TagProps {
    children: React.ReactNode;
    className?: string;
}

export const Tag: React.FC<TagProps> = ({ children, className = '' }) => {
    return (
        <span
            className={`work-tag ${className}`}
        >
            {children}
        </span>
    );
};

export default Tag;
