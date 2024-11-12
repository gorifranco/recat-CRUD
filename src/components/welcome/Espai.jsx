import {useNavigate, useParams} from "react-router-dom";
import {Button, Navbar, Spinner} from "react-bootstrap";
import FormComentari from "../comentaris/FormComentari";
import {useContext, useEffect, useState} from "react";
import {MenuContext} from "../utils/MenuContext";
import axios from "axios";
import AlertModal from "../utils/AlertModal";
import ComentarisEspai from "../comentaris/ComentarisEspai";
import CarouselCustom from "./varis/CarouselCustom";
import Informacio from "./Informacio";
import NavbarCuston from "./varis/NavbarCustom";
import Punts from "./Punts";
import Visites from "./Visites";

export default function Espai() {
    const usuari = useContext(MenuContext)
    const [descarregant, setDescarregant] = useState(true)
    const navigate = useNavigate()
    const id = useParams()
    const [missatgeAlert, setMissatgeAlert] = useState("")
    const [imatges, setImatges] = useState([])
    const [modalVisible, setModalVisible] = useState(false)
    const [errors, setErrors] = useState({
        comentari: '', valoracio: '',
    })
    const [espaiData, setEspaiData] = useState({})
    const [active, setActive] = useState(1)

    function canviaActiu(actiu){
        setActive(actiu)
    }


    function creaFormData(comentari) {
        let fdc = new FormData();
        fdc.append("fk_usuari", usuari.id)
        fdc.append("fk_espai", id.id)
        fdc.append("comentari", comentari.comentari)
        fdc.append("valoracio", comentari.valoracio)
        return fdc
    }

    function enviarComentari(comentari) {
        axios.post("http://www.gorifranco.com/api/comentaris", creaFormData(comentari), {
            headers: {
                'Authorization': `Bearer ${usuari.api_token}`,
            }
        }).then(() => {
            setMissatgeAlert("Comentari enviat amb èxit")
            setModalVisible(true)
        })
            .catch((e) => {
                console.log(e)
                setErrors(e.response.data.errors)
            })
    }

    useEffect(() => {
        descarrega()
    }, []);

    async function descarrega(){
        try {
            const resposta = await axios.get('http://www.gorifranco.com/api/espais/' + id.id);
            setEspaiData(resposta.data.data);
            let tmp = []
            tmp.push(resposta.data.data.imatge.url)
            resposta.data.data.punts_interes.forEach(p => {
                if(p.imatge) tmp.push(p.imatge.url)
            })
            setImatges(tmp)
        } catch (error) {
            console.error(error);
        }
        setDescarregant(false);
    }


    return (descarregant) ? (
        <>
            <Spinner className={"mt-4"}/>
        </>

    ) : (
        <>
            <Button onClick={() => navigate("/")} className="mt-3">
                Tornar
            </Button>
            <div className={"container"}>
                <h1 className={"text-center"}>{espaiData.nom}</h1>
                    <CarouselCustom imatges={imatges}/>
            </div>

            <NavbarCuston canviaActiu={canviaActiu} className={"mb-5"} />
            {active === 1 && (<Informacio informacio={espaiData}/>)}
            {active === 2 && (<Punts punts={espaiData.punts_interes}/>)}
            {active === 3 && (<Visites visites={espaiData.visites}/>)}

            <h3 className={"mt-5 mb-4 text-center"}>Comentaris</h3>
            <ComentarisEspai espaiId={id.id}/>
            <FormComentari onSubmit={enviarComentari} errors={errors} className={"mt-5"}/>
            <AlertModal onHide={() => setModalVisible(false)} visible={modalVisible} missatge={missatgeAlert} titol={"Comentari"}/>
        </>
    )

}