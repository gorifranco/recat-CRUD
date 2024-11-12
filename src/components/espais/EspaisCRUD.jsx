import {Form, Button, Alert, Toast, Spinner, FormGroup, FormLabel} from "react-bootstrap";
import {useContext, useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import SelectGrauAcces from "../selects/SelectGrauAcces";
import SelectTipusEspai from "../selects/SelectTipusEspai";
import SelectModalitats from "../selects/SelectModalitats";
import PlusButton from "../botons/PlusButton";
import MenosButton from "../botons/MenosButton";
import SelectArquitectes from "../selects/SelectArquitectes";
import SelectMunuicipis from "../selects/SelectMunuicipis";
import SelectServeis from "../selects/SelectServeis";
import axios from "axios";
import InputError from "../utils/InputError";
import EliminarModal from "../utils/EliminarModal";
import {MenuContext} from "../utils/MenuContext";

export default function EspaisCRUD() {
    const usuari = useContext(MenuContext)
    const [numeroModalitats, setNumeroModalitats] = useState(1);
    const [numeroArquitectes, setNumeroArquitectes] = useState(1);
    const [numeroServeis, setNumeroServeis] = useState(1);
    const [selectedImage, setSelectedImage] = useState(null)
    const [data, setData] = useState({
        nom: '',
        email: '',
        descripcio: '',
        direccio: '',
        web: '',
        telefon: '',
        any_construccio: '',
        grau_accessibilitat: '',
        fk_tipusEspai: '',
        fk_municipi: '',
        modalitats: [],
        arquitectes: [],
        serveis: [],
        imatge: null,
        validat: '',
    })
    const [errors, setErrors] = useState({
        nom: '',
        email: '',
        descripcio: '',
        direccio: '',
        web: '',
        telefon: '',
        any_construccio: '',
        grau_accessibilitat: '',
        fk_tipusEspai: '',
        fk_municipi: '',
        modalitats: '',
        arquitectes: '',
        serveis: '',
        imatge: '',
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
        axios.get('http://www.gorifranco.com/api/espais/' + id)
            .then((response) => {
                const modalitatsIds = response.data.data.modalitats.map(modalitat => modalitat.id);
                const arquitectesIds = response.data.data.arquitectes.map(arquitecte => arquitecte.id);
                const serveisIds = response.data.data.serveis.map(servei => servei.id);
                setNumeroModalitats(modalitatsIds.length)
                setNumeroServeis(serveisIds.length)
                setNumeroArquitectes(arquitectesIds.length)

                setData({
                    nom: response.data.data.nom,
                    email: response.data.data.email,
                    descripcio: response.data.data.descripcio,
                    direccio: response.data.data.direccio,
                    web: response.data.data.web,
                    telefon: response.data.data.telefon,
                    any_construccio: response.data.data.any_construccio,
                    grau_accessibilitat: response.data.data.grau_accessibilitat,
                    fk_tipusEspai: response.data.data.fk_tipusEspai,
                    fk_municipi: response.data.data.municipi.id,
                    modalitats: modalitatsIds,
                    arquitectes: arquitectesIds,
                    serveis: serveisIds,
                    imatge: response.data.data.imatge
                })
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
        fdc.append('direccio', data.direccio);
        fdc.append('web', data.web);
        fdc.append('email', data.email);
        fdc.append('telefon', data.telefon);
        fdc.append('any_construccio', data.any_construccio);
        fdc.append('grau_accessibilitat', data.grau_accessibilitat);
        fdc.append('tipusEspai', data.fk_tipusEspai);
        fdc.append('municipi', data.fk_municipi);
        fdc.append('serveis', data.serveis);
        if (Array.isArray(data.modalitats)) {
            data.modalitats.forEach((modalitat, index) => {
                fdc.append(`modalitats[${index}]`, modalitat);
            });
        } else {
            fdc.append('modalitats', data.modalitats);
        }
        if (Array.isArray(data.arquitectes)) {
            data.arquitectes.forEach((arq, index) => {
                fdc.append(`arquitectes[${index}]`, arq);
            });
        } else {
            fdc.append('arquitectes', data.arquitectes);
        }
        if (Array.isArray(data.serveis)) {
            data.serveis.forEach((ser, index) => {
                fdc.append(`serveis[${index}]`, ser);
            });
        } else {
            fdc.append('serveis', data.serveis);
        }

        return fdc;
    }


    function crea() {
        axios.post('http://www.gorifranco.com/api/espais', creaFormData(), {
            headers: {
                'Authorization': `Bearer ${usuari.api_token}`,
                'Content-Type': 'multipart/form-data',
            },
        }).then(() => {
            navigate('/espaistable');
        }).catch((e) => {
            setErrors(e.response.data.data)
        })
    }

    function modifica() {
        axios.post('http://www.gorifranco.com/api/espais/' + id, creaFormData(), {
            headers: {
                'Authorization': `Bearer ${usuari.api_token}`,
                'Content-Type': 'multipart/form-data',
            },
        }).then(() => {
            alert("Espai modificat amb èxit")
            navigate('/espaistable');
        }).catch((e) => {
            setErrors(e.response.data.errors)
            console.error(e)
        })
    }

    function esborra() {

        axios.delete('http://www.gorifranco.com/api/espais/' + id, {
            headers: {
                'Authorization': `Bearer ${usuari.api_token}`,
            },
        }).then(() => {
            alert("Espai eliminat amb èxit")
            navigate("/espaistable")
        })
            .catch((e) => {
                alert(e)
                console.error(e)
            })

    }

    async function handleChangeImatge(e) {
        const newImageData = {...data, imatge: e.target.files[0]}; // Creamos una nueva copia de 'data' con la imagen actualizada
        await setData(newImageData);
        setSelectedImage(URL.createObjectURL(newImageData.imatge));
    }

    function handleChange(e) {
        const {name, value} = e.target;
        setData({
            ...data,
            [name]: value,
        });
    }

    function modalitats() {
        let mod = [];

        for (let i = 0; i < numeroModalitats; i++) {
            mod.push(<SelectModalitats classname={"mb-3"} name={"modalitats " + i} value={data.modalitats[i]}
                                       key={"mod" + i}
                                       onChange={changeSelects}></SelectModalitats>)
        }
        return mod;
    }

    function afegirModalitat() {
        setNumeroModalitats(numeroModalitats + 1)
    }

    function llevarModalitat() {
        setNumeroModalitats(numeroModalitats - 1)
        const newModalitats = [...data.modalitats];
        newModalitats.pop();
        setData(prevData => ({
            ...prevData,
            modalitats: newModalitats,
        }));
    }

    function serveis() {
        let ser = [];

        for (let i = 0; i < numeroServeis; i++) {
            ser.push(<SelectServeis classname={"mb-3"} name={"serveis " + i} value={data.serveis[i]} key={"ser" + i}
                                    onChange={changeSelects}></SelectServeis>)
        }
        return ser;
    }

    function afegirServei() {
        setNumeroServeis(numeroServeis + 1)
    }

    function llevarServei() {
        setNumeroServeis(numeroServeis - 1)
        const newServeis = [...data.serveis];
        newServeis.pop();
        setData(prevData => ({
            ...prevData,
            serveis: newServeis,
        }));
    }


    function arquitectes() {
        let arq = [];

        for (let i = 0; i < numeroArquitectes; i++) {
            arq.push(<SelectArquitectes key={"arq" + i} value={data.arquitectes[i]} className={"mb-3"}
                                        name={"arquitectes " + i}
                                        onChange={changeSelects}></SelectArquitectes>)
        }
        return arq;
    }

    function afegirArquitecte() {
        setNumeroArquitectes(numeroArquitectes + 1)
    }

    function llevarArquitecte() {
        setNumeroArquitectes(numeroArquitectes - 1)
        const newArquitectes = [...data.arquitectes];
        newArquitectes.pop();
        setData(prevData => ({
            ...prevData,
            arquitectes: newArquitectes,
        }));
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

    if (descarregant) {
        return <Spinner/>
    }

    return (
        <div>
            {edita ? (
                <h2 className={"text-center my-4"}>Edita un espai</h2>
            ) : (
                <h2 className={"text-center my-4"}>Afegir un espai</h2>
            )}
            <Form>
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
                        placeholder="Nom de l'espai"
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
                        placeholder="Descripció de l'espai"
                        rows={3}
                        onChange={handleChange}/>
                    <InputError message={errors.descripcio}/>
                </FormGroup>
                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Email de l'espai"
                        name="email"
                        value={data.email}
                        onChange={handleChange}
                    />
                    <InputError message={errors.email}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Direcció</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Direcció de l'espai"
                        name="direccio"
                        value={data.direccio}
                        onChange={handleChange}
                    />
                    <InputError message={errors.direccio}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Web</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Web de l'espai"
                        name="web"
                        value={data.web}
                        onChange={handleChange}
                    />
                    <InputError message={errors.web}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Telèfon</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Telèfon de l'espai"
                        name="telefon"
                        value={data.telefon}
                        onChange={handleChange}
                    />
                    <InputError message={errors.telefon}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Any de construcció</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Any de construcció"
                        name="any_construccio"
                        value={data.any_construccio}
                        onChange={handleChange}
                    />
                    <InputError message={errors.any_construccio}/>
                </Form.Group>
                <FormGroup className="mb-3">
                    <FormLabel>Grau d'accessibilitat</FormLabel>
                    <SelectGrauAcces name={"grau_accessibilitat"} onChange={handleChange}
                                     value={data.grau_accessibilitat}/>
                    <InputError message={errors.grau_accessibilitat}/>
                </FormGroup>
                <FormGroup className="mb-3">
                    <FormLabel>Municipi</FormLabel>
                    <SelectMunuicipis name={"fk_municipi"} onChange={handleChange} value={data.fk_municipi}/>
                    <InputError message={errors.fk_municipi}/>
                </FormGroup>
                <FormGroup className="mb-3">
                    <FormLabel>Tipus d'espai</FormLabel>
                    <SelectTipusEspai name={"fk_tipusEspai"} onChange={handleChange} value={data.fk_tipusEspai}/>
                    <InputError message={errors.fk_tipusEspai}/>
                </FormGroup>
                <FormGroup>
                    <FormLabel>Modalitats</FormLabel>
                    {modalitats()}
                    <div className={"flex"}>
                        <PlusButton color={"#222222"}
                                    onClick={afegirModalitat}></PlusButton>
                        {numeroModalitats > 1 && (
                            <MenosButton color={"#222222"}
                                         onClick={llevarModalitat}></MenosButton>
                        )}
                    </div>
                    <InputError message={errors.modalitats}/>
                </FormGroup>
                <FormGroup>
                    <FormLabel>Serveis</FormLabel>
                    {serveis()}
                    <div className={"flex"}>
                        <PlusButton color={"#222222"}
                                    onClick={afegirServei}></PlusButton>
                        {numeroServeis > 1 && (
                            <MenosButton color={"#222222"}
                                         onClick={llevarServei}></MenosButton>
                        )}
                    </div>
                    <InputError message={errors.serveis}/>
                </FormGroup>
                <FormGroup>
                    <FormLabel>Arquitectes</FormLabel>
                    {arquitectes()}
                    <div className={"flex"}>
                        <PlusButton color={"#222222"}
                                    onClick={afegirArquitecte}></PlusButton>
                        {numeroArquitectes > 1 && (
                            <MenosButton color={"#222222"}
                                         onClick={llevarArquitecte}></MenosButton>
                        )}
                    </div>
                    <InputError message={errors.arquitectes}/>
                </FormGroup>

                <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>Imatge de l'espai</Form.Label>
                    <Form.Control type="file" onChange={handleChangeImatge}/>
                    {(data.imatge !== null || selectedImage !== null) && (
                        <img style={{maxHeight: "150px", maxWidth: "150px"}} className={"my-3"}
                             alt={"imatge de l'espai"} src={(selectedImage !== null) ? selectedImage : data.imatge.url}/>
                    )}
                    <InputError message={errors.imatge}/>
                </Form.Group>
                <Button variant="primary" type="button" onClick={guarda}>
                    {edita ? "Guarda" : "Crea"}
                </Button>
                &nbsp;&nbsp;
                <Button variant="warning" type="button" onClick={() => navigate("/espaistable")}>
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