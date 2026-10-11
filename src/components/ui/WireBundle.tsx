import './wire-bundle.css';

export default function WireBundle() {
    return <span className="wire-bundle" aria-hidden="true">
        {Array.from({ length: 30 }, (_, index) => (
            <i key={index} style={{ rotate: `${(index - 14.5) * 4}deg`, scale: 1 - index * .018 }} />
        ))}
    </span>;
}
