import {Form, Button, Alert, Spinner} from "react-bootstrap";
import {useContext, useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import EliminarModal from "../utils/EliminarModal";
import InputError from "../utils/InputError";
import {MenuContext} from "../utils/MenuContext";

export default function ServeisCRUD() {
    const usuari = useContext(MenuContext)
    const [data, setData] = useState({
        nom: ''
    });
    const [errors, setErrors] = useState({
        nom: ''
    });
    const [edita, setEdita] = useState(false);
    const navigate = useNavigate();
    const {id} = useParams();
    const [descarregant, setDescarregant] = useState(false);

    useEffect(() => {
        if (id !== "afegir") {
            descarrega()
        }
    }, []);

    function descarrega() {
        setDescarregant(true);
        setEdita(true);
        axios.get('http://www.gorifranco.com/api/serveis/' + id)
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
        axios.post('http://www.gorifranco.com/api/serveis', data, {
            headers: {
                'Authorization': `Bearer ${usuari.api_token}`,
                'Content-Type': 'application/json'
            },
        })
            .then(() => {
                alert("Servei creat amb èxit")
                navigate('/serveistable')
            })
            .catch((e) => {
                setErrors(e.response.data.errors)
                console.error(e)
            })
    }

    function modifica() {
        axios.put('http://www.gorifranco.com/api/serveis/' + id, data, {
            headers: {
                'Authorization': `Bearer ${usuari.api_token}`,
                'Content-Type': 'application/json'
            },
        })
            .then(() => {
                alert("Servei modificat amb èxit")
                navigate('/serveistable')
            })
            .catch((e) => {
                setErrors(e.response.data.errors)
                console.error(e)
            })
    }

    function esborra() {
        axios.delete('http://www.gorifranco.com/api/serveis/' + id, {
            headers: {
                'Authorization': `Bearer ${usuari.api_token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(() => {
                alert("Servei eliminat amb èxit")
                navigate('/serveistable')
            })
            .catch((e) => {
                alert(e)
                console.error(e)
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
            {edita ? (
                <h2 className={"text-center my-4"}>Edita un servei</h2>
            ) : (
                <h2 className={"text-center my-4"}>Afegir un servei</h2>
            )}
            <Form onSubmit={guarda}>
                {edita &&
                    <Form.Group className="mb-3">
                        <Form.Label>Id</Form.Label>
                        <Form.Control type="text" name="id" value={id} disabled/>
                    </Form.Group>
                }
                <Form.Group className="mb-3">
                    <Form.Label>Servei</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Nom del servei"
                        name="nom"
                        value={data.nom}
                        onChange={handleChange}
                    />
                    <InputError message={errors.nom}/>
                </Form.Group>
                <Button variant="primary" type="button" onClick={guarda}>
                    {edita ? "Guarda" : "Crea"}
                </Button>
                &nbsp;&nbsp;
                <Button variant="warning" type="button" onClick={() => navigate("/serveistable")}>
                    Cancel·la
                </Button>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                {edita &&
                    <EliminarModal missatge={"Segur que desitges eliminar el tipus d'espai?"} handleAccept={esborra}/>
                }
            </Form>
            <br/>
        </div>
    );
}