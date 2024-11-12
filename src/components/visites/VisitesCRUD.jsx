import {Form, Button, Spinner, FormGroup, FormLabel} from "react-bootstrap";
import {useContext, useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import EliminarModal from "../utils/EliminarModal";
import InputError from "../utils/InputError";
import {MenuContext} from "../utils/MenuContext";
import InputDate from "../utils/InputDate";
import PlusButton from "../botons/PlusButton";
import MenosButton from "../botons/MenosButton";
import SelectServeis from "../selects/SelectServeis";
import SelectPuntsInteres from "../selects/SelectPuntsInteres";

export default function VisitesCRUD() {
    const usuari = useContext(MenuContext)
    const [numeroPunts, setNumeroPunts] = useState(1)
    const [data, setData] = useState({
        nom: '',
        descripcio: '',
        dataInici: '',
        dataFi: '',
        reqInscripcio: false,
        preu: '',
        places: '',
        punts_interes: [],
        fk_espai: ''
    })
    const [errors, setErrors] = useState({
        nom: '',
        descripcio: '',
        dataInici: '',
        dataFi: '',
        reqInscripcio: '',
        preu: '',
        places: '',
        punts_interes: '',

    });
    const [edita, setEdita] = useState(false);
    const navigate = useNavigate();
    const {accio, id} = useParams();
    const [descarregant, setDescarregant] = useState(true);

    useEffect(() => {
        if (accio === "editar") {
            descarrega()
        }
        if (accio === "afegir") {
            data.fk_espai = id
            setDescarregant(false)
        }
    }, []);

    async function descarrega() {
        setDescarregant(true);
        setEdita(true);
        try {
            // 1. Obtener la respuesta del servidor
            const resposta = await axios.get('http://www.gorifranco.com/api/visites/' + id);

            // 2. Meter los datos en data de la forma correcta
            const puntsIds = resposta.data.data.punts_interes.map(punt => punt.id);
            setNumeroPunts(puntsIds.length)
            await setData({
                ...resposta.data.data,
                punts_interes: puntsIds
            });

            setDescarregant(false);
        } catch (error) {
            console.log(error);
            setDescarregant(false);
        }
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
        axios.post('http://www.gorifranco.com/api/visites', data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${usuari.api_token}`,
            },
        }).then(() => {
            alert("Visita creada amb èxit")
            navigate("/visitestable")
        }).catch((e) => {
            setErrors(e.response.data.errors)
        })
    }

    function modifica() {
        axios.put('http://www.gorifranco.com/api/visites/' + id, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${usuari.api_token}`,
            },
        }).then(() => {
            alert("Visita creada amb èxit")
            navigate("/visitestable")
        }).catch((e) => {
            setErrors(e.response.data.errors)
        })
    }

    function esborra() {
        axios.delete('http://www.gorifranco.com/api/visites/' + id, {
            headers: {
                'Authorization': `Bearer ${usuari.api_token}`,
                'Content-Type': 'multipart/form-data'
            },
        }).then(() => {
            alert("Visita eliminada amb èxit")
            navigate("/visitestable")
        }).catch((e) => {
            alert(e)
        })
    }

    function changeSelects(e) {
        const {name, value} = e.target;
        let [fieldName, index] = name.split(" ");
        index = parseInt(index, 10);

        setData((prevData) => {

            const newArrayField = [...prevData[fieldName]];
            newArrayField[index] = value;

            return {
                ...prevData,
                [fieldName]: newArrayField,
            };
        });
    }

    function handleChange(e) {
        const {name, value} = e.target;
        setData({
            ...data,
            [name]: value,
        });
    }

    function punts() {
        let pt = [];

        for (let i = 0; i < numeroPunts; i++) {
            pt.push(<SelectPuntsInteres espai={data.fk_espai} classname={"mb-3"} name={"punts_interes " + i}
                                        value={(data.punts_interes[i]) ? data.punts_interes[i] : -1} key={"punt" + i}
                                        onChange={changeSelects}></SelectPuntsInteres>)
        }
        return pt;
    }

    function afegirPunt() {
        setNumeroPunts(numeroPunts + 1)
    }

    function llevarPunt() {
        setNumeroPunts(numeroPunts - 1)
        const newPunts = [...data.punts_interes];
        newPunts.pop();
        setData(prevData => ({
            ...prevData,
            punts_interes: newPunts,
        }));
    }


    if (descarregant) {
        return <Spinner/>
    }

    return (
        <div>
            {edita ? (
                <h2 className={"text-center my-4"}>Edita una visita</h2>
            ) : (
                <h2 className={"text-center my-4"}>Afegir una visita</h2>
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
                <FormGroup className={"mb-3"}>
                    <FormLabel>Data d'inici</FormLabel>
                    <InputDate
                        name={"dataInici"}
                        onChange={handleChange}
                        value={data.dataInici}/>
                    <InputError message={errors.dataInici}/>
                </FormGroup>
                <FormGroup className={"mb-3"}>
                    <FormLabel>Data de fi</FormLabel>
                    <InputDate
                        name={"dataFi"}
                        onChange={handleChange}
                        value={data.dataFi}/>
                    <InputError message={errors.dataFi}/>
                </FormGroup>
                <FormGroup>
                    <FormLabel>Punts d'interès per ordre</FormLabel>
                    {punts()}
                    <div className={"flex"}>
                        <PlusButton color={"#222222"}
                                    onClick={afegirPunt}></PlusButton>
                        {numeroPunts > 1 && (
                            <MenosButton color={"#222222"}
                                         onClick={llevarPunt}></MenosButton>
                        )}
                    </div>
                    <InputError message={errors.serveis}/>
                </FormGroup>
                <Form.Group className="mb-3">
                    <Form.Label>Preu</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Preu"
                        name="preu"
                        value={data.preu}
                        onChange={handleChange}
                    />
                    <InputError message={errors.preu}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Places</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Place"
                        name="places"
                        value={data.places}
                        onChange={handleChange}
                    />
                    <InputError message={errors.places}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Check
                        checked={data.reqInscripcio}
                        type="checkbox"
                        label={"Requereix inscripció? " + (data.reqInscripcio ? "SI" : "NO")}
                        name="reqInscripcio"
                        onChange={(e) => {
                            setData({
                                ...data,
                                reqInscripcio: e.target.checked
                            })
                        }}
                    />
                    <InputError message={errors.reqInscripcio}/>
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