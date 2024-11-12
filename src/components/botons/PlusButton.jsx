import React from "react";

export default function PlusButton({onClick, size = 24, color = "#ffffff", className}) {

    return (
        <button
            type={"button"}
            onClick={onClick}
            className={"btn btn-primary " + className}
        >
            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none"
                 stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19">
                </line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
        </button>
    )
}
