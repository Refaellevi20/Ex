export function DetailsIcon({ width = 24, height = 24, color = 'currentColor' }){
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect x="2" y="2" width="20" height="20" rx="2" ry="2" />
            <line x1="2" y1="8" x2="22" y2="8" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <line x1="2" y1="16" x2="22" y2="16" />
            <line x1="6" y1="20" x2="18" y2="20" />
        </svg>
    )
}


export function EditIcon ({ width = 24, height = 24, color = 'currentColor' }){
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 20h9" />
            <path d="M16.5 3l4.5 4.5-9 9H7.5V12l9-9z" />
            <path d="M2 22l2-2h14l2 2" />
        </svg>
    )
}

export function RemoveIcon({ width = 24, height = 24, color = 'currentColor' }){
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M3 6h18" />
            <path d="M6 6v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V6" />
            <path d="M10 11v2" />
            <path d="M14 11v2" />
        </svg>
    )
}