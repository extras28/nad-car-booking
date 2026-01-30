import React from "react";

const Logo = ({ className = "w-24 h-24" }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className={className}>
            <defs>
                <linearGradient id="blueGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: "#003366", stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: "#007BFF", stopOpacity: 1 }} />
                </linearGradient>
            </defs>

            <circle cx="50" cy="50" r="45" fill="none" stroke="url(#blueGradient1)" strokeWidth="7" />

            <path
                d="M50 5 L50 25 M95 50 L75 50 M5 50 L25 50 M20 78 L38 62 M80 78 L62 62"
                stroke="url(#blueGradient1)"
                strokeWidth="5"
                strokeLinecap="round"
            />

            <text
                x="50"
                y="59"
                fontFamily="'Roboto', Arial, sans-serif"
                fontWeight="900"
                fontSize="26"
                textAnchor="middle"
                fill="#002244"
                letterSpacing="1"
            >
                NAD
            </text>
        </svg>
    );
};

export default Logo;
