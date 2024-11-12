import {useEffect, useState} from "react";
import React from "react";
import axios from "axios";
import EspaiDisplay from "./EspaiDisplay";
import {Spinner} from "react-bootstrap";
import CercadorEspais from "./varis/CercadorEspais";

export default function Home() {
    const [data, setData] = useState([])
    const [descarregant, setDescarregant] = useState(true)
    const [espaisVisibles, setEspaisVisibles] = useState([])

    useEffect(() => {
        descarrega()
    }, []);

    async function filtrar(cerca, bools){
        let espaisFiltrados =data.filter(espai => espai.nom.toLowerCase().includes(cerca.toLowerCase()));
        if(bools) {
            espaisFiltrados = espaisFiltrados.filter(espai => {
                const modalitatsSeleccionadas = Object.entries(bools.modalitats)
                    .filter(([modalitat, seleccionada]) => seleccionada)
                    .map(([modalitat]) => modalitat);
                const modalitatsCoinciden = espai.modalitats.some(modalitat => modalitatsSeleccionadas.includes(modalitat.nom));
                const serveisSeleccionados = Object.entries(bools.serveis)
                    .filter(([servei, seleccionado]) => seleccionado)
                    .map(([servei]) => servei);
                const serveisCoinciden = espai.serveis.some(servei => serveisSeleccionados.includes(servei.nom));
                const tipusSeleccionados = Object.entries(bools.tipus)
                    .filter(([tipus, seleccionada]) => seleccionada)
                    .map(([tipus]) => tipus);
                const tipusCoinciden = tipusSeleccionados.includes(espai.tipus_espai.nom);
                const grausSeleccionados = Object.entries(bools.graus)
                    .filter(([grau, seleccionada]) => seleccionada)
                    .map(([grau]) => grau);
                const grausCoinciden = grausSeleccionados.includes(espai.grau_accessibilitat)
                return modalitatsCoinciden && serveisCoinciden && tipusCoinciden && grausCoinciden;
            });
        }
            console.log(espaisFiltrados)

            setEspaisVisibles(espaisFiltrados)
    }

    function descarrega() {
        axios.get('http://www.gorifranco.com/api/espais')
            .then((response) => {
                setData(response.data.data)
                setEspaisVisibles(response.data.data)
            })
            .catch((e) => {
                console.error(e);
                alert(e)
            })
        setDescarregant(false);
    }
    return descarregant ? (
        <div><p>Carregant espais </p><Spinner/></div>
    ) : (
        <div className={"container"}>
            <h1 className={"title text-center mt-4 mb-5"}>TEAM ROCKET</h1>
            <CercadorEspais onSubmit={filtrar}/>
            {Object.values(espaisVisibles).map((value) => (
                <React.Fragment key={value.id}>
                    <EspaiDisplay data={value}></EspaiDisplay>
                    <hr className={"my-5"}/>
                </React.Fragment>
            ))}
        </div>

    )
}
