import {Form, Button, Spinner, FormGroup} from "react-bootstrap";
import {useContext, useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import EliminarModal from "../utils/EliminarModal";
import InputError from "../utils/InputError";
import {MenuContext} from "../utils/MenuContext";

export default function PuntsCRUD() {
    const usuari = useContext(MenuContext)
    const [data, setData] = useState({
        nom: '',
        descripcio: '',
        fk_espai: '',
        imatge: null,
    })
    const [errors, setErrors] = useState({
        nom: '',
        descripcio: '',
        imatge: '',
    });
    const [selectedImage, setSelectedImage] = useState(null);
    const [edita, setEdita] = useState(false);
    const navigate = useNavigate();
    const {accio, id} = useParams();
    const [descarregant, setDescarregant] = useState(false);

    useEffect(() => {
        if (accio === "editar") {
            descarrega()
        }
        if (accio === "afegir") {
            data.fk_espai = id
        }
    }, []);

    function descarrega() {
        setDescarregant(true);
        setEdita(true);
        axios.get('http://www.gorifranco.com/api/punts_interes/' + id)
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


    function creaFormData() {
        const fdc = new FormData();

        if (data.imatge !== undefined && selectedImage) fdc.append('imatge', data.imatge);
        fdc.append('nom', data.nom);
        fdc.append('descripcio', data.descripcio);
        fdc.append('fk_espai', data.fk_espai);

        return fdc;
    }

    function crea() {
        axios.post('http://www.gorifranco.com/api/punts_interes', creaFormData(), {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${usuari.api_token}`,
            },
        }).then(() => {
            alert("Punt d'interès creat amb èxit")
            navigate("/puntstable")
        }).catch((e) => {
            setErrors(e.response.data.data)
        })
    }

    function modifica() {
        axios.post('http://www.gorifranco.com/api/punts_interes/' + id, creaFormData(), {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${usuari.api_token}`,
            },
        }).then(() => {
            alert("Punt d'interès modificat amb èxit")
            navigate("/puntstable")
        }).catch((e) => {
            setErrors(e.response.data.errors)
        })
    }

    function esborra() {
        axios.delete('http://www.gorifranco.com/api/punts_interes/' + id, {
            headers: {
                'Authorization': `Bearer ${usuari.api_token}`,
                'Content-Type': 'multipart/form-data'
            },
        }).then(() => {
            alert("Punt d'interès eliminat amb èxit")
            navigate("/puntstable")
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

    async function handleChangeImatge(e) {
        const newImageData = {...data, imatge: e.target.files[0]}; // Creamos una nueva copia de 'data' con la imagen actualizada
        await setData(newImageData);
        setSelectedImage(URL.createObjectURL(newImageData.imatge));
    }


    if (descarregant) {
        return <Spinner/>
    }

    return (
        <div>
            {edita ? (
                <h2 className={"text-center my-4"}>Edita un punt d'interès</h2>
            ) : (
                <h2 className={"text-center my-4"}>Afegir un punt d'interès</h2>
            )}
            <Form onSubmit={guarda}>
                {edita &&
                    <Form.Group className="mb-3">
                        <Form.Label>Id</Form.Label>
                        <Form.Control type="text" name="id" value={id} disabled/>
                    </Form.Group>
                }
                <Form.Group className="mb-3">
                    <Form.Label>Nom</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Nom"
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
                        name={"descripcio"}
                        placeholder="Descripció"
                        rows={3}
                        onChange={handleChange}/>
                    <InputError message={errors.descripcio}/>
                </FormGroup>
                <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>Imatge de l'espai</Form.Label>
                    <Form.Control type="file" onChange={handleChangeImatge}/>
                    {(data.imatge !== null || selectedImage !== null) && (
                        <img style={{maxHeight: "150px", maxWidth: "150px"}} className={"my-3"}
                             alt={"imatge de l'espai"} src={(selectedImage) ? selectedImage : data.imatge.url}/>
                    )}
                    <InputError message={errors.imatge}/>
                </Form.Group>
                <Button variant="primary" type="button" onClick={guarda}>
                    {edita ? "Guarda" : "Crea"}
                </Button>
                &nbsp;&nbsp;
                <Button variant="warning" type="button" onClick={() => navigate("/puntstable")}>
                    Cancel·la
                </Button>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                {edita &&
                    <EliminarModal missatge={"Segur que desitges eliminar el punt d'interès?"} handleAccept={esborra}/>
                }
            </Form>
            <br/>
        </div>
    );
}