import {useEffect, useState} from "react";
import Switch from "react-switch";

export default function CustomSwitch({estat}) {
    const [checked, setChecked] = useState(estat);

    useEffect(() => {
        setChecked(estat);
    }, [estat]);

    const handleChange = () => {
        const newCheckedState = !checked;
        setChecked(newCheckedState);
    };
    return (
        <label>
            <Switch
                onChange={handleChange}
                checked={checked}
                className="react-switch"
                offColor={"#B22222"}
            />
        </label>
    );
};