import React, {useEffect, useState} from "react";
import axios from "axios";
import Comentari from "./Comentari";
import {Spinner} from "react-bootstrap";

export default function ComentarisEspai({espaiId}) {
    const [comentaris, setComentaris] = useState([])
    const [descarregant, setDescarregant] = useState(true)

    useEffect(() => {
        descarregar()
    }, []);

    function descarregar() {
        axios.get("http://www.gorifranco.com/api/comentaris_per_espai/" + espaiId)
            .then((response) => setComentaris(response.data.data))
            .then(() => setDescarregant(false))
            .catch((e) => {
                console.error(e)
            })
    }

    if (descarregant) {
        return (
            <div>
                <Spinner/>
            </div>
        );
    }

    return (
        <>
            {comentaris.map((val) => (
                <Comentari data={val}/>
            ))}
        </>
    )
}