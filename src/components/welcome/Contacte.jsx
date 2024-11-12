import {Button, Form, FormControl, FormGroup, FormLabel} from "react-bootstrap";
import axios from "axios";
import InputError from "../utils/InputError";
import React, {useState} from "react";
import {useNavigate} from "react-router-dom";

export default function Contacte(){
    const navigate = useNavigate()
    const [data, setData] = useState({
        nom: '',
        email: '',
        missatge: ''
    })
    const [errors, setErrors] = useState({
        nom: '',
        email: '',
        missatge: ''
    })

    function handleChange(e) {
        const {name, value} = e.target;
        setData({
            ...data,
            [name]: value,
        });
    }

    function handleSubmit(e){
        e.preventDefault()
        axios.post("http://www.gorifranco.com/api/contacte", data)
            .then(() => {
                alert("Missatge enviat amb èxit")
            })
            .catch((e) => {setErrors(e.response.data.errors)})
    }

    return(
        <div className={"container mb-4"}>
            <Button onClick={() => {
                navigate("/")
            }} className="mt-3">
                Tornar
            </Button>
            <h2 className={"text-center mt-2 mb-3"}>CONTACTE</h2>
            <Form onSubmit={handleSubmit}>
                <FormGroup className={"mb-4"}>
                    <FormLabel>Nom</FormLabel>
                    <FormControl
                        type={"text"}
                        name={"nom"}
                        value={data.nom}
                        onChange={handleChange}
                    ></FormControl>
                    <InputError message={errors.nom}/>
                </FormGroup>
                <FormGroup className={"mb-4"}>
                    <FormLabel>Email</FormLabel>
                    <FormControl
                        type={"text"}
                        name={"email"}
                        value={data.email}
                        onChange={handleChange}
                    ></FormControl>
                    <InputError message={errors.email}/>
                </FormGroup>
                <FormGroup className="mb-4">
                    <Form.Label>Missatge</Form.Label>
                    <Form.Control
                        as="textarea"
                        value={data.missatge}
                        name={"missatge"}
                        rows={6}
                        onChange={handleChange}/>
                    <InputError message={errors.missatge}/>
                </FormGroup>
                <div className="text-center">
                    <Button className={"px-4"} type={"submit"} variant={"primary"}>Enviar</Button>
                </div>
            </Form>
        </div>
    )
}