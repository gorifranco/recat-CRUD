import "../espai.css"
import {useState} from "react";
export default function NavbarCuston({canviaActiu, className}){

    const [active, setActive] = useState("1")

    function canvia(e) {
        const newActive = e.target.id;
        if (newActive !== active) {
            setActive(newActive);
            canviaActiu(Number(newActive));
        }
    }


    return(
    <div id={"nav"} className={"text-center mx-auto mt-3 " + className}>
        <ul>
            <li className={(active==="1")?"active":""} onClick={canvia} id={"1"}>Informació</li>
            <li className={(active==="2")?"active":""} onClick={canvia} id={"2"}>Punts d'interès</li>
            <li className={(active==="3")?"active":""} onClick={canvia} id={"3"}>Visites</li>
        </ul>
    </div>
    )
}