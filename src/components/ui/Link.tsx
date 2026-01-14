import React from 'react';

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string;
    children: React.ReactNode;
    isExternal?: boolean;
    className?: string;
    size?: 'sm' | 'base' | 'lg';
}

export const Link: React.FC<LinkProps> = ({
    href,
    children,
    isExternal = false,
    className = '',
    size = 'base',
    ...props
}) => {
    const sizeClasses = {
        sm: 'text-sm',
        base: 'text-base sm:text-lg',
        lg: 'text-lg sm:text-xl',
    };

    const baseClasses = `group relative pb-1 font-bold text-black border-b-2 border-black/10 transition-colors duration-300 inline-flex items-center gap-0.5 ${sizeClasses[size]} ${className}`;

    return (
        <a
            href={href}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            className={baseClasses}
            {...props}
        >
            <span>
                {children}
                {isExternal && ' ↗'}
            </span>
            <div className="absolute bottom-[-2px] left-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></div>
        </a>
    );
};

export default Link;
