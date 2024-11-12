import React, {useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Form, Row, Col, Alert, Spinner} from "react-bootstrap";

export default function SelectServeis(props) {
    const [serveis, setServeis] = useState([]);
    const [descarrega, setDescarrega] = useState(true);

    const omplirOptions = () => {
        return serveis.map(function (tupla) {
            return <option key={tupla.id} value={tupla.id}>{tupla.nom}</option>;
        });
    }

    useEffect(
        () => {
            fetch('http://www.gorifranco.com/api/serveis')
                .then(response => {
                    return response.json(response);
                })
                .then(jsonresposta => {
                        setServeis(jsonresposta.data);
                        setDescarrega(false);
                    }
                )
                .catch(function (error) {
                    console.log(error);
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
                        <option key="-1" value="-1">Tria un servei...</option>
                        {omplirOptions()}
                    </Form.Select>
                </Col>
            </Row>
        );
}