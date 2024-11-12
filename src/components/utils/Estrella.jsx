import {useEffect, useState} from "react";
import Switch from "react-switch";

export default function Estrella({estat, onClick}) {
    const [checked, setChecked] = useState(estat);

    useEffect(() => {
        setChecked(estat);
    }, [estat]);

    function click() {
        setChecked(!checked);
        onClick()
    }

    return (
        <label>
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 50 50" onClick={click}>
                <title>Five Pointed Star</title>
                <path fill={(!checked) ? "none" : "#fcf40a"} stroke="#f0cb00" strokeWidth={"3px"}
                      d="m25,1 6,17h18l-14,11 5,17-15-10-15,10 5-17-14-11h18z"/>
            </svg>
        </label>
    );
};