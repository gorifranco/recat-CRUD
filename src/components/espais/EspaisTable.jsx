import React, {useState, useEffect, Fragment, useContext} from "react";
import {ListGroup, Row, Col, Spinner, Button} from 'react-bootstrap';
import {useNavigate} from "react-router-dom";
import {AgGridReact} from 'ag-grid-react'; // React Grid Logic
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css";
import {AG_GRID_LOCALE_CAT} from "../utils/language.cat";
import CustomSwitch from "../utils/CustomSwitch";
import axios from "axios";
import {MenuContext} from "../utils/MenuContext";
import Estrella from "../utils/Estrella";
import PlusButton from "../botons/PlusButton"; // Theme

export default function EspaisTable() {
    const usuari = useContext(MenuContext)
    const [espais, setEspais] = useState([]);
    const [descarregant, setDescarregant] = useState(true);
    const navigate = useNavigate();

    function SwitchRender({value, data}) {
        return (

            <span
                style={{
                    display: 'flex',
                    verticalAlign: 'middle',
                    marginTop: '5px',
                }}
                onClick={() => {
                    activa_desactiva_Espai(data.id)
                }}
            >
      <CustomSwitch estat={Boolean(value)}/>
    </span>
        );
    }

    function EstrellaRender({value, data}) {
        return (
            <span
                style={{
                    display: 'flex',
                    verticalAlign: 'middle',
                    height: "100%",
                    marginBottom: "5px",
                }}
            >
            <Estrella estat={Boolean(value)} onClick={() => canvia_destacat_Espai(data.id)}/>
    </span>
        );
    }

    function handleClick(e) {
        navigate("/espais/" + e.data.id)
    }

    const [columnes, setColumnes] = useState([
        {field: "id", headerName: "Codi", width: 100, filter: true, floatingFilter: true, onCellClicked: handleClick},
        {
            field: "nom",
            headerName: "Espai",
            width: 300,
            sortable: true,
            filter: true,
            floatingFilter: true,
            onCellClicked: handleClick
        },
        {
            field: "direccio",
            headerName: "Direcció",
            width: 500,
            sortable: true,
            filter: true,
            floatingFilter: true,
            onCellClicked: handleClick
        },
        {
            field: "activat",
            headerName: "Activat",
            cellRenderer: SwitchRender,
            editable: true,
            width: 125,
            sortable: true
        },]);
    if (usuari.tipusUsuari === "administrador" && columnes.length === 4) {
        setColumnes(prevColumnes => [
            ...prevColumnes,
            {
                field: "destacada",
                headerName: "Destacat",
                cellRenderer: EstrellaRender,
                editable: false,
                width: 100,
                sortable: true
            }
        ]);
    }

    useEffect(() => {
        descarrega()
    }, []);

    const descarrega = async () => {
        try {
            let resposta;
            if(usuari.tipusUsuari === "administrador"){
                resposta = await axios.get('http://www.gorifranco.com/api/espais_tots', {
                    headers:{
                        'Authorization': `Bearer ${usuari.api_token}`,
                    }
                });
            }else{
                resposta = await axios.get('http://www.gorifranco.com/api/espais_per_gestor/' + usuari.id, {
                    headers:{
                        'Authorization': `Bearer ${usuari.api_token}`,
                    }
                });
            }
            setEspais(resposta.data.data)
        } catch (error) {
            console.error(error);
        }
        setDescarregant(false);
    }

    async function activa_desactiva_Espai(id) {
        await axios.put('http://www.gorifranco.com/api/espais/' + id + "/activar_desactivar", null, {
            headers: {
                'Authorization': `Bearer ${usuari.api_token}`,
            },
        });
    }

    async function canvia_destacat_Espai(id) {
        await axios.put('http://www.gorifranco.com/api/espais/' + id + "/canvia_destacat", null, {
            headers: {
                'Authorization': `Bearer ${usuari.api_token}`,
            },
        });
    }

    if (descarregant) {
        return (
            <div>
                <h1>Espais</h1>
                <Spinner/>
            </div>
        );
    } else {
        return (
            <>
                <hr/>
                <Row md={4} className="justify-content-center">
                    <Col className={"align-middle my-auto"}>
                        <h4 className={"text-center mb-0"}>Llista d'espais</h4>

                    </Col>
                    <Col md={1}>
                        <PlusButton
                            onClick={() => {
                                navigate("/espais/afegir");
                            }}
                        />
                    </Col>
                </Row>
                <br/>
                <div className="ag-theme-quartz text-capitalize mb-3 mx-auto"
                     style={{height: 400, width: '100%', maxWidth: (usuari.tipusUsuari==="administrador")?1130:1030}}>
                    <AgGridReact
                        columnDefs={columnes}
                        rowData={espais}
                        pagination={true}
                        localeText={AG_GRID_LOCALE_CAT}
                        paginationPageSize={8}
                    />
                </div>
            </>
        );
    }

}    