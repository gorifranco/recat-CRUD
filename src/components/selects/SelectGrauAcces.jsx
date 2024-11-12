import {Col, Form, Row} from "react-bootstrap";
import React from "react";

export default function (props) {
    return (
        <Row>
            <Col sm={6}>
                <Form.Select onChange={props.onChange} value={props.value} name={props.name}>
                    <option key="-1" value="-1">Tria un grau d'accessibilitat</option>
                    <option key={"1"} value={"baix"}>Baix</option>
                    <option key={"2"} value={"mitj"}>Mitj</option>
                    <option key={"3"} value={"alt"}>Alt</option>
                </Form.Select>
            </Col>
        </Row>
    );
}

