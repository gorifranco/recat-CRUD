import React, {useState, useEffect, useContext} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Form, Row, Col, Alert} from "react-bootstrap";
import {MenuContext} from "../utils/MenuContext";
import axios from "axios";

export default function SelectEspais(props) {
    const usuari = useContext(MenuContext)
    const [espais, setEspais] = useState([]);
    const [descarregant, setDescarregant] = useState(true);

    const omplirOptions = () => {
        return espais.map(function (tupla) {
            return <option key={tupla.id} value={tupla.id}>{tupla.nom}</option>;
        });
    }

    const handleChange = (event) => {
        const selectedIndex = event.target.selectedIndex;
        const selectedOption = espais[selectedIndex - 1];
        props.onChange((selectedOption) ? selectedOption.id : null);
    };

    async function descarrega() {
        let resposta;
        try {
            if (usuari.tipusUsuari === "administrador") {
                resposta = await axios.get('http://www.gorifranco.com/api/espais_tots', {
                    headers: {
                        'Authorization': `Bearer ${usuari.api_token}`,
                    }
                });
            } else {
                resposta = await axios.get('http://www.gorifranco.com/api/espais_per_gestor/' + usuari.id, {
                    headers: {
                        'Authorization': `Bearer ${usuari.api_token}`,
                    }
                });
            }
            setEspais(resposta.data.data)
        } catch (error) {
            console.error(error);
        }
        setDescarregant(false);
    }

    useEffect(
        () => {
            descarrega()
        },[]
    );

    if (descarregant) {
        return <Alert variant="info">Descarregant....</Alert>;
    } else
        return (
            <Row className={"justify-content-center"}>
                <Col sm={6}>
                    <Form.Select onChange={handleChange} value={props.value} name={props.name}>
                        <option key="-1"
                                value="-1">{espais.length > 0 ? "Tria un espai..." : "No tens cap espai"}</option>
                        {omplirOptions()}
                    </Form.Select>
                </Col>
            </Row>
        );
}