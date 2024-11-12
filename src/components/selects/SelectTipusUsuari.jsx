import {Col, Form, Row} from "react-bootstrap";
import React from "react";

export default function SelectTipusUsuari(props) {

    return (
        <Row>
            <Col sm={6}>
                <Form.Select onChange={props.onChange} value={props.value} name={props.name}>
                    <option key="usuari" value="usuari">Usuari</option>
                    <option key="gestor" value="gestor">Gestor</option>
                    <option key="administrador" value="administrador">Administrador</option>
                </Form.Select>
            </Col>
        </Row>
    );
}
