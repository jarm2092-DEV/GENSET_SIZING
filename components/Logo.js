export default function Logo({ className }) {
    return (
        <svg
            className={className}
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="MyGensSizing Logo"
        >
            <defs>
                <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="1.5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>

            {/* Cuerpo de la Rueda Dentada (Gear) */}
            <path
                d="M20 28C24.4183 28 28 24.4183 28 20C28 15.5817 24.4183 12 20 12C15.5817 12 12 15.5817 12 20C12 24.4183 15.5817 28 20 28Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Dientes del Engranaje */}
            <path
                d="M20 8V4M20 36V32M8 20H4M36 20H32M11.51 11.51L8.68 8.68M31.32 31.32L28.49 28.49M11.51 28.49L8.68 31.32M31.32 8.68L28.49 11.51"
                stroke="white"
                strokeWidth="3.5"
                strokeLinecap="round"
            />

            {/* Relámpago Central */}
            <path
                d="M22 14L15 22H19L17 28L24 20H20L22 14Z"
                fill="white"
                filter="url(#logoGlow)"
                stroke="white"
                strokeWidth="0.5"
                strokeLinejoin="round"
            />
        </svg>
    );
}
