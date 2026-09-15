import type { AnchorHTMLAttributes, ReactNode } from 'react';

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string;
    children: ReactNode;
    isExternal?: boolean;
    size?: 'sm' | 'base' | 'lg';
}

export function Link({ href, children, isExternal = false, className = '', size = 'base', ...props }: LinkProps) {
    return (
        <a href={href} target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            className={'text-link text-link--' + size + ' ' + className} {...props}>
            <span>{children}</span>
            {isExternal && <span className="text-link-arrow" aria-hidden="true">↗</span>}
        </a>
    );
}

export default Link;
