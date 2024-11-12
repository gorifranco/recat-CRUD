import React from "react";

export default function MenosButton({onClick, size = 24, color = "#ffffff", className}) {

    return (
        <button
            onClick={onClick}
            type={"button"}
            style={{
                marginRight: "5px",
                marginLeft: "5px"
            }}
            className={"btn btn-primary " + className}
        >
            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none"
                 stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
        </button>
    )
}
