import {useEffect, useState} from "react";
import axios from "axios";
import {Form} from "react-bootstrap";

export default function CercaAvansada(props){


    return (
        <Form>
        <div className={"container border rounded-1 d-flex p-2"}>
            <div className={"col-md-3 d-flex flex-column"}>
             <h6>Tipus d'espai</h6>
                {props.inputs.tipus.map((t) => (
                        <Form.Check
                            key={t.id}
                            name={"tipus." + t.nom}
                            className={"mx-2"}
                            value={t.id}
                            label={t.nom}
                            onChange={props.handleChange}
                            type="checkbox"
                            checked={props.bools.tipus[t.nom]}
                        />
                ))}
            </div>
            <div className={"col-md-3 d-flex flex-column"}>
                <h6>Modalitats</h6>
                {props.inputs.modalitats.map((m) => (
                        <Form.Check
                            key={m.id}
                            label={m.nom}
                            name={"modalitats." + m.nom}
                            className={"mx-2"}
                            onChange={props.handleChange}
                            type="checkbox"
                            checked={props.bools.modalitats[m.nom]}
                        />
                ))}
            </div>
            <div className={"col-md-3 d-flex flex-column"}>
                <h6>Serveis</h6>
                {props.inputs.serveis.map((s) => (
                        <Form.Check
                            key={s.id}
                            label={s.nom}
                            name={"serveis." + s.nom}
                            className={"mx-2"}
                            onChange={props.handleChange}
                            type="checkbox"
                            checked={props.bools.serveis[s.nom]}
                        />
                ))}
            </div>
            <div className={"col-md-3 d-flex flex-column"}>
                <h6>Accessibilitat</h6>
                {props.inputs.graus.map((s) => {
                    return (
                            <Form.Check
                                key={s.nom}
                                label={s.nom}
                                name={"graus." + s.nom}
                                className={"mx-2"}
                                value={s.nom}
                                onChange={props.handleChange}
                                type="checkbox"
                                checked={props.bools.graus[s.nom]}
                            />
                    )
                })}
            </div>
        </div>
        </Form>
    )
}