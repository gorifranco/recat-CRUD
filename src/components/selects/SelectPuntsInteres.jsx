import React, {useState, useEffect, useContext} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Form, Row, Col, Alert} from "react-bootstrap";
import {MenuContext} from "../utils/MenuContext";
import axios from "axios";

export default function SelectPuntsInteres(props) {
    const usuari = useContext(MenuContext)
    const [punts, setPunts] = useState([]);
    const [descarrega, setDescarrega] = useState(true);

    const omplirOptions = () => {
        return punts.map(function (tupla) {
            return <option key={tupla.id} value={tupla.id}>{tupla.nom}</option>;
        });
    }

    useEffect(
        () => {
            axios.get('http://www.gorifranco.com/api/punts_per_espai/' + props.espai, {
                headers: {
                    'Authorization': `Bearer ${usuari.api_token}`,
                }
            })
                .then(jsonresposta => {
                        setPunts(jsonresposta.data.data);
                        setDescarrega(false);
                    }
                )
                .catch(function (error) {
                    console.error(error);
                })
        }
        ,
        []
    );

    if (descarrega) {
        return <Alert variant="info">Descarregant....</Alert>;
    } else
        return (
            <Row>
                <Col sm={6}>
                    <Form.Select onChange={props.onChange} value={props.value} name={props.name}>
                        <option key="-1" value="-1">Tria un Punt d'interès...</option>
                        {omplirOptions()}
                    </Form.Select>
                </Col>
            </Row>
        );
}