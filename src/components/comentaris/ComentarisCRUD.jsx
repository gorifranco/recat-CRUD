import {Form, Button, Alert, Toast, Spinner, FormGroup, FormLabel} from "react-bootstrap";
import {useContext, useEffect, useState} from "react";
import {useBlocker, useNavigate, useParams} from "react-router-dom";
import InputError from "../utils/InputError";
import axios from "axios";
import EliminarModal from "../utils/EliminarModal";
import InputDate from "../utils/InputDate";
import {MenuContext} from "../utils/MenuContext";

export default function ComentarisCRUD() {
    const usuari = useContext(MenuContext)
    const [data, setData] = useState({
        nom: '',
        descripcio: '',
        data_naix: ''
    });
    const [errors, setErrors] = useState({
        nom: '',
        descripcio: '',
        data_naix: '',
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
        axios.get('http://www.gorifranco.com/api/arquitectes/' + id)
            .then((response) => {
                setData(response.data.data)
            })
            .catch((e) => {
                console.error(e)
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
        axios.post('http://www.gorifranco.com/api/arquitectes', data, {
            headers: {
                'Authorization': `Bearer ${usuari.api_token}`,
                'Content-Type': 'application/json'
            },
        }).then(() => {
            alert("Arquitecte creat amb èxit")
            navigate("/arquitectestable");
        })
            .catch((e) => {
                setErrors(e.response.data.errors)
            })
    }

    function modifica() {
        axios.put('http://www.gorifranco.com/api/arquitectes/' + id, data, {
            headers: {
                'Authorization': `Bearer ${usuari.api_token}`,
                'Content-Type': 'application/json'
            }
        }).then(() => {
            alert("Arquitecte modificat amb èxit")
            navigate("/arquitectestable");
        })
            .catch((e) => {
                setErrors(e.response.data.errors)
            })
    }

    function esborra() {
        axios.delete('http://www.gorifranco.com/api/arquitectes/' + id, {
            headers: {
                'Authorization': `Bearer ${usuari.api_token}`,
            },
        }).then(() => {
            alert("Arquitecte eliminat amb èxit")
            navigate("/arquitectestable");
        })
            .catch((e) => {
                setErrors(e.response.data.errors)
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
                <h2 className={"text-center my-4"}>Edita un arquitecte</h2>
            ) : (
                <h2 className={"text-center my-4"}>Afegir un arquitecte</h2>
            )}
            <Form onSubmit={guarda}>
                {edita &&
                    <Form.Group className="mb-3">
                        <Form.Label>Id</Form.Label>
                        <Form.Control type="text" name="id" value={id} disabled/>
                    </Form.Group>
                }
                <Form.Group className="mb-3">
                    <Form.Label>Arquitecte</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Nom de l'arquitecte"
                        name="nom"
                        value={data.nom}
                        onChange={handleChange}
                    />
                    <InputError message={errors.nom}/>
                </Form.Group>
                <FormGroup className="mb-3">
                    <Form.Label>Descripció</Form.Label>
                    <Form.Control
                        as="textarea"
                        value={data.descripcio}
                        placeholder="Descripció de l'arquitecte"
                        rows={3}
                        name={"descripcio"}
                        onChange={handleChange}/>
                    <InputError message={errors.descripcio}/>
                </FormGroup>
                <FormGroup className={"mb-3"}>
                    <FormLabel>Data de naixament</FormLabel>
                    <InputDate
                        name={"data_naix"}
                        onChange={handleChange}
                        value={data.data_naix}/>
                    <InputError message={errors.data_naix}/>
                </FormGroup>
                <Button variant="primary" type="button" onClick={guarda}>
                    {edita ? "Guarda" : "Crea"}
                </Button>
                &nbsp;&nbsp;
                <Button variant="warning" type="button" onClick={() => navigate("/arquitectestable")}>
                    Cancel·la
                </Button>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                {edita &&
                    <EliminarModal missatge={"Segur que desitges eliminar l'arquitecte?"} handleAccept={esborra}/>
                }
            </Form>
            <br/>
        </div>
    );
}