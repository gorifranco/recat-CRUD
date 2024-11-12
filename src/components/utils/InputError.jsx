export default function InputError({message, className = '', ...props}) {
    return message ? (
        <p
            {...props}
            style={{
                fontSize: '0.875rem',
                color: '#DC2626',
            }}
            className={className}
        >
            {message}
        </p>
    ) : null;
}
