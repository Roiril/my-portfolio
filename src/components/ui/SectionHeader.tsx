import React from 'react';

interface SectionHeaderProps {
    title: string;
    className?: string;
    size?: 'md' | 'lg';
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
    title,
    className = '',
    size = 'lg',
}) => {
    const sizeClasses = {
        md: 'text-2xl',
        lg: 'text-3xl sm:text-4xl',
    };

    return (
        <h2 className={`${sizeClasses[size]} font-bold text-black mb-6 ${className}`}>
            {title}
        </h2>
    );
};

export default SectionHeader;
