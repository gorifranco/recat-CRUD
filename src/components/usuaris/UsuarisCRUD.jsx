import {Form, Button, Spinner} from "react-bootstrap";
import {useContext, useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import InputError from "../utils/InputError";
import EliminarModal from "../utils/EliminarModal";
import {MenuContext} from "../utils/MenuContext";
import SelectTipusUsuari from "../selects/SelectTipusUsuari";

export default function UsuarisCRUD() {
    const usuari = useContext(MenuContext)
    const [data, setData] = useState({
        name: '',
        email: '',
        llinatge1: '',
        llinatge2: '',
        DNI: '',
        telefon: '',
        tipusUsuari: 'usuari',
        password: '',
    });
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        llinatge1: '',
        llinatge2: '',
        DNI: '',
        telefon: '',
        tipusUsuari: '',
        password: '',
    });

    const [edita, setEdita] = useState(false);
    const navigate = useNavigate();
    const {id} = useParams();
    const [descarregant, setDescarregant] = useState(false);
    const perfil = window.location.pathname === "/perfil"
    let idFinal

    useEffect(() => {
        if (perfil) {
            idFinal = usuari.id
            descarrega()
        } else if (id !== "afegir") {
            idFinal = id
            descarrega()
        }
    }, []);

    function descarrega() {
        setDescarregant(true);
        setEdita(true);
        axios.get('http://www.gorifranco.com/api/usuaris/' + idFinal, {
            headers: {
                'Authorization': `Bearer ${usuari.api_token}`,
            }
        })
            .then((response) => {
                setData(response.data.data)
            })
            .catch((e) => {
                console.error(e);
                alert(e)
            })
        setDescarregant(false);
    }

    function guarda(e) {
        e.preventDefault()

        if (edita) {
            modifica();
        } else {
            crea();
        }
    }


    function crea() {
        axios.post('http://www.gorifranco.com/api/usuaris', data, {
            headers: {
                'Authorization': `Bearer ${usuari.api_token}`,
                'Content-Type': 'application/json'
            },
        }).then(() => {
            alert("Usuari creat amb èxit");
            (perfil) ? navigate("/perfil") : navigate("/usuaristable")
        }).catch((e) => {
            console.log(e)
            setErrors(e.response.data.errors)
        })
    }

    function modifica() {
        idFinal = (perfil) ? usuari.id : id
        axios.put('http://www.gorifranco.com/api/usuaris/' + idFinal, data, {
            headers: {
                'Authorization': `Bearer ${usuari.api_token}`,
                'Content-Type': 'application/json'
            },
        }).then(() => {
            alert("Usuari modificat amb èxit");
            (perfil) ? navigate("/perfil") : navigate("/usuaristable")
        }).catch((e) => {
            setErrors(e.response.data.errors)
        })
    }

    function esborra() {

        axios.delete('http://www.gorifranco.com/api/usuaris/' + id, {
            headers: {
                'Authorization': `Bearer ${usuari.api_token}`,
                'Content-Type': 'application/json'
            },
        }).then(() => {
            alert("Usuari eliminat amb èxit");
            (perfil)?navigate("/"):navigate("/usuaristable")
        }).catch((e) => {
            alert(e)
        })
    }

    function handleChange(e) {
        const {name, value} = e.target;
        setData({
            ...data,
            [name]: value,
        });
    }

    if (descarregant) {
        return <Spinner/>
    }

    return (
        <div>
            {(edita && perfil) && (
                <h2 className={"text-center my-4"}>El meu perfil</h2>
            )}
            {(edita && !perfil) && (
                <h2 className={"text-center my-4"}>Edita un usuari</h2>
            )}
            {!edita && (
                <h2 className={"text-center my-4"}>Afegir un usuari</h2>
            )}
            <Form onSubmit={guarda}>
                <Form.Group className="mb-3">
                    <Form.Label>Nom</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Nom"
                        name="name"
                        value={data.name}
                        onChange={handleChange}
                    />
                    <InputError message={errors.name}/>
                </Form.Group>
                {id === "afegir" && (
                    <Form.Group className="mb-3">
                        <Form.Label>Contrassenya</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Password"
                            name="password"
                            value={data.password}
                            onChange={handleChange}
                        />
                        <InputError message={errors.password}/>
                    </Form.Group>
                )}
                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Email"
                        name="email"
                        value={data.email}
                        onChange={handleChange}
                    />
                    <InputError message={errors.email}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Primer llinatge</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Primer llinatge"
                        name="llinatge1"
                        value={data.llinatge1}
                        onChange={handleChange}
                    />
                    <InputError message={errors.llinatge1}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Segon llinatge</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Segon llinatge"
                        name="llinatge2"
                        value={data.llinatge2}
                        onChange={handleChange}
                    />
                    <InputError message={errors.llinatge2}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>DNI</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="DNI"
                        name="DNI"
                        value={data.DNI}
                        onChange={handleChange}
                    />
                    <InputError message={errors.DNI}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Telèfon</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Telèfon"
                        name="telefon"
                        value={data.telefon}
                        onChange={handleChange}
                    />
                    <InputError message={errors.telefon}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Contrassenya</Form.Label>
                    <Form.Control
                        type="password"
                        name="password"
                        value={data.password}
                        onChange={handleChange}
                    />
                    <InputError message={errors.password}/>
                </Form.Group>
                {window.location.pathname !== "/perfil" && (
                    <Form.Group className="mb-3">
                        <Form.Label>Tipus d'usuari</Form.Label>
                        <SelectTipusUsuari
                            name="tipusUsuari"
                            value={data.tipusUsuari}
                            onChange={handleChange}
                        />
                        <InputError message={errors.tipusUsuari}/>
                    </Form.Group>
                )}
                <Button variant="primary" type="button" onClick={guarda}>
                    {edita ? "Guarda" : "Crea"}
                </Button>
                {!perfil && (
                    <>
                        &nbsp;&nbsp;
                        <Button variant="warning" type="button" onClick={() => navigate("/usuaristable")}>
                            Cancel·la
                        </Button>
                    </>
                )}
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                {edita &&
                    <EliminarModal missatge={"Segur que desitges eliminar l'usuari?"} handleAccept={esborra}/>
                }
            </Form>
            <br/>
        </div>
    );
}