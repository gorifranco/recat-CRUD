import React, {useState} from 'react';
import {Alert, Spinner, Form, Button} from 'react-bootstrap';
import {useNavigate} from "react-router-dom";
import InputError from "../utils/InputError";
import axios from "axios";


export default function Registre() {
    const [registreOkey, setRegistreOkey] = useState(false)
    const [data, setData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        llinatge1: '',
        llinatge2: '',
        DNI: '',
        telefon: '',
        tipusUsuari: 'usuari',
    });
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        llinatge1: '',
        llinatge2: '',
        DNI: '',
        telefon: '',
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    function registrar(e) {
        e.preventDefault()

        if(data.password !== data.confirmPassword){
            setErrors({
                ...errors,
                password: "No coincideix",
                confirmPassword: "No coincideix",
            })
        }else{
            axios.post("http://www.gorifranco.com/api/registre", data)
                .then((resposta) => {
                    console.log(resposta)
                    setRegistreOkey(true)
                })
                .catch((e) => {
                    console.error(e.response.data.data)
                    setErrors(e.response.data.data)
                })
        }
    }

    function handleChange(e) {
        const {name, value} = e.target;
        setData({
            ...data,
            [name]: value,
        });
    }
return (registreOkey)?(
    <>
        <Button onClick={() => {
            navigate("/")
        }} className="mt-3">
            Tornar
        </Button>
    <div style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    }}>

        <div className={"container-md text-center mt-5"}>
            <h2 className={"mb-5"}>Usuari registrat</h2>
            <p>Gràcies per confiar amb TEAMROCKET :)</p>
            <p>S'ha enviat un mail de confirmació a {"data.email"}. Confirmi el correu amb el link que us hem
                proporcionat abans de fer login.</p>
            <a className={"link-primary"} style={{cursor: "pointer"}} onClick={() => navigate("/login")}>Anar a Login</a>
        </div>
    </div>
        </>
) : (
    <>
        <Button onClick={() => {
            navigate("/")
        }} className="mt-3">
            Tornar
        </Button>
        <h2 className={"text-center"}>Registre</h2>
        <hr/>
        <Form onSubmit={registrar}>
            <Form.Group className="mb-3">
                <Form.Label>Nom</Form.Label>
                <Form.Control type="text" value={data.name} name={"name"}
                              onChange={handleChange}/>
                <InputError message={errors.name}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="text" value={data.email} name={"email"}
                                  onChange={handleChange}/>
                    <InputError message={errors.email}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Contrassenya</Form.Label>
                    <Form.Control type="password" value={data.password}
                                  onChange={handleChange} name="password"
                    />
                    <InputError message={errors.password}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Confirmar contrassenya</Form.Label>
                    <Form.Control type="password" value={data.confirmPassword}
                                  onChange={handleChange} name="confirmPassword"
                    />
                    <InputError message={errors.confirmPassword}/>

                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Tipus d'usuari</Form.Label>
                    <Form.Select name={"tipusUsuari"} onChange={handleChange} value={data.tipusUsuari}>
                        <option value={"usuari"}>Usuari</option>
                        <option value={"gestor"}>Gestor</option>
                    </Form.Select>
                </Form.Group>
                {data.tipusUsuari ==="gestor" && (
                    <div>
                    <Form.Group className="mb-3">
                        <Form.Label>Primer llinatge</Form.Label>
                        <Form.Control type="text" value={data.llinatge1} name={"llinatge1"}
                                      onChange={handleChange}/>
                        <InputError message={errors.llinatge1}/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Segon llinatge</Form.Label>
                        <Form.Control type="text" value={data.llinatge2} name={"llinatge2"}
                                      onChange={handleChange}/>
                        <InputError message={errors.llinatge2}/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>DNI</Form.Label>
                        <Form.Control type="text" value={data.DNI} name={"DNI"}
                                      onChange={handleChange}/>
                        <InputError message={errors.DNI}/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Telefon</Form.Label>
                        <Form.Control type="text" value={data.telefon} name={"telefon"}
                                      onChange={handleChange}/>
                        <InputError message={errors.telefon}/>
                    </Form.Group>
                </div>
                    )}
                <Button variant="primary" onClick={registrar}>
                    Registrar
                </Button>
            </Form>
            {loading && <Alert variant="info"><Spinner/></Alert>}
        </>
    );
}