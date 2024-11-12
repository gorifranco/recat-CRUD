import {Button, Form} from "react-bootstrap";
import CercaAvansada from "./CercaAvansada";
import {useEffect, useState} from "react";
import axios from "axios";

export default function CercadorEspais(props){
    const [cercaAvanzada, setCercaAvanzada] = useState(false)
    const [inputs, setInputs] = useState({
        modalitats: [],
        tipus: [],
        serveis: [],
        graus: [
            {nom: "baix"},
            {nom: "mitj"},
            {nom: "alt"},
        ]
    });
    const [bools, setBools] = useState([])
    const [filtre, setFiltre] = useState("")

    useEffect(() => {
        descarrega()
    }, []);

    async function descarrega() {
        try {
            await Promise.all([
                axios.get("http://www.gorifranco.com/api/modalitats")
                    .then((r) => {
                        const modalitatsData = r.data.data;
                        setInputs(prevInputs => ({
                            ...prevInputs,
                            modalitats: modalitatsData
                        }));
                        const modalitatsObj = modalitatsData.reduce((acc, modalitat) => {
                            acc[modalitat.nom] = true;
                            return acc;
                        }, {});
                        setBools((prevBools) => ({
                            ...prevBools,
                            modalitats: modalitatsObj
                        }));
                    }),
                axios.get('http://www.gorifranco.com/api/tipus_espais')
                    .then((r) => {
                        const tipusData = r.data.data;
                        setInputs(prevInputs => ({
                            ...prevInputs,
                            tipus: tipusData
                        }));
                        let tmp = {}
                        r.data.data.forEach((tipus) => {
                            tmp[tipus.nom] = true;
                        });
                        setBools((prevBools) => ({
                            ...prevBools,
                            tipus: tmp
                        }));
                    }),
                axios.get('http://www.gorifranco.com/api/serveis')
                    .then((r) => {
                        const serveisData = r.data.data;
                        setInputs(prevInputs => ({
                            ...prevInputs,
                            serveis: serveisData
                        }));
                        let tmp = {}
                        r.data.data.forEach((servei) => {
                            tmp[servei.nom] = true;
                        });
                        setBools((prevBools) => ({
                            ...prevBools,
                            serveis: tmp
                        }));
                        setBools((prevBools) => ({
                            ...prevBools,
                            graus: {baix: true,
                                mitj: true,
                                alt: true}
                        }))
                    })
            ])
        } catch (error) {
            console.error("Error al descargar los datos:", error);
        }
    }

    function canviaChecked(e) {
        const { name, checked } = e.target;

        const [grupo, propiedad] = name.split('.');

        setBools(prevBools => ({
            ...prevBools,
            [grupo]: {
                ...prevBools[grupo],
                [propiedad]: checked
            }
        }));
    }

    function handleSubmit(e){
        e.preventDefault()
        cercaAvanzada ? props.onSubmit(filtre, bools) : props.onSubmit(filtre, null)
    }

    function cercaAvançada(e){
        e.preventDefault()
        setCercaAvanzada(!cercaAvanzada)
    }

    return (
        <>
            <div className={`d-flex align-items-center justify-content-center ${props.className}`}>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3 d-flex align-items-center">
                    <Form.Label className="me-2">Cercador: </Form.Label>
                    <Form.Control type="text" style={{ width: "200px", marginRight: "10px" }}
                                  value={filtre} onChange={(e) => setFiltre(e.target.value)}/>
                    <Button variant="primary" onClick={handleSubmit}>Cercar</Button>
                    <Button variant="primary" onClick={cercaAvançada} style={{ marginLeft: "10px" }}>Cerca avançada</Button>
                </Form.Group>
            </Form>
        </div>
            {cercaAvanzada && <CercaAvansada handleChange={canviaChecked} bools={bools} inputs={inputs}/>}
        </>
    )
}