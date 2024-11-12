import {Form, Button, Alert, Spinner} from "react-bootstrap";
import {useContext, useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import EliminarModal from "../utils/EliminarModal";
import InputError from "../utils/InputError";
import {MenuContext} from "../utils/MenuContext";

export default function ModalitatsCRUD() {
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
        axios.get('http://www.gorifranco.com/api/modalitats/' + id)
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
        axios.post('http://www.gorifranco.com/api/modalitats', data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${usuari.api_token}`,
            },
        }).then(() => {
            alert("Modalitat creada amb èxit")
            navigate("/modalitatstable")
        }).catch((e) => {
            console.error(e)
            setErrors(e.response.data.errors)
        })
    }

    function modifica() {
        axios.put('http://www.gorifranco.com/api/modalitats/' + id, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${usuari.api_token}`,
            },
        }).then(() => {
            alert("Modalitat modificada amb èxit")
            navigate("/modalitatstable")
        }).catch((e) => {
            setErrors(e.response.data.errors)
        })
    }

    function esborra() {
        axios.delete('http://www.gorifranco.com/api/modalitats/' + id, {
            headers: {
                'Authorization': `Bearer ${usuari.api_token}`,
                'Content-Type': 'multipart/form-data'
            },
        }).then(() => {
            alert("Modalitat eliminada amb èxit")
            navigate("/modalitatstable")
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
                <h2 className={"text-center my-4"}>Edita una modalitat</h2>
            ) : (
                <h2 className={"text-center my-4"}>Afegir un modalitats</h2>
            )}
            <Form onSubmit={guarda}>
                {edita &&
                    <Form.Group className="mb-3">
                        <Form.Label>Id</Form.Label>
                        <Form.Control type="text" name="id" value={id} disabled/>
                    </Form.Group>
                }
                <Form.Group className="mb-3">
                    <Form.Label>Modalitats</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Nom de la modalitat"
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
                <Button variant="warning" type="button" onClick={() => navigate("/modalitatstable")}>
                    Cancel·la
                </Button>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                {edita &&
                    <EliminarModal missatge={"Segur que desitges eliminar la modalitat?"} handleAccept={esborra}/>
                }
            </Form>
            <br/>
        </div>
    );
}