import {Form, Button, Spinner} from "react-bootstrap";
import {useContext, useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import InputError from "../utils/InputError";
import EliminarModal from "../utils/EliminarModal";
import {MenuContext} from "../utils/MenuContext";

export default function TipusEspaisCRUD() {
    const usuari = useContext(MenuContext)
    const [data, setData] = useState({
        nom: '',
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
        axios.get('http://www.gorifranco.com/api/tipus_espais/' + id)
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
        axios.post('http://www.gorifranco.com/api/tipus_espais', data, {
            headers: {
                'Authorization': `Bearer ${usuari.api_token}`,
                'Content-Type': 'application/json'
            },
        }).then(() => {
            alert("Tipus d'espai creat amb èxit")
            navigate("/tipusespaistable")
        }).catch((e) => {
            console.log(e)
            setErrors(e.response.data.errors)
        })
    }

    function modifica() {
        axios.put('http://www.gorifranco.com/api/tipus_espais/' + id, data, {
            headers: {
                'Authorization': `Bearer ${usuari.api_token}`,
                'Content-Type': 'application/json'
            },
        }).then(() => {
            alert("Tipus d'espai modificat amb èxit")
            navigate("/tipusespaistable")
        }).catch((e) => {
            setErrors(e.response.data.errors)
        })
    }

    function esborra() {

        axios.delete('http://www.gorifranco.com/api/tipus_espais/' + id, {
            headers: {
                'Authorization': `Bearer ${usuari.api_token}`,
                'Content-Type': 'application/json'
            },
        }).then(() => {
            alert("Tipus d'espai eliminat amb èxit")
            navigate("/tipusespaistable")
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
            {edita ? (
                <h2 className={"text-center my-4"}>Edita un tipus d'espai</h2>
            ) : (
                <h2 className={"text-center my-4"}>Afegir un tipus d'espai</h2>
            )}
            <Form onSubmit={guarda}>
                {edita &&
                    <Form.Group className="mb-3">
                        <Form.Label>Id</Form.Label>
                        <Form.Control type="text" name="id" value={id} disabled/>
                    </Form.Group>
                }
                <Form.Group className="mb-3">
                    <Form.Label>Tipus d'espai</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Nom del tipus d'espai"
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
                <Button variant="warning" type="button" onClick={() => navigate("/tipusespaistable")}>
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