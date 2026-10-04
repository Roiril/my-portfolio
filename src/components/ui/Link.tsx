import type { AnchorHTMLAttributes, ReactNode } from 'react';
import ArtIcon from './ArtIcon';

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
            {isExternal && <ArtIcon name="arrow" size={16} className="text-link-arrow" />}
        </a>
    );
}

export default Link;
