import React, {useState, useEffect, Fragment, useContext} from "react";
import {Row, Col, Spinner, Button} from 'react-bootstrap';
import {useNavigate} from "react-router-dom";
import {AgGridReact} from 'ag-grid-react'; // React Grid Logic
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css";
import {AG_GRID_LOCALE_CAT} from "../utils/language.cat";
import SelectEspais from "../selects/SelectEspais";
import axios from "axios";
import {MenuContext} from "../utils/MenuContext";
import PlusButton from "../botons/PlusButton"; // Theme

export default function PuntsTable() {
    const usuari = useContext(MenuContext)
    const [espaiId, setEspaiId] = useState()
    const [punts, setPunts] = useState([])
    const [descarregant, setDescarregant] = useState(false);
    const navigate = useNavigate();
    const [columnes, setColumnes] = useState([
        {field: "id", headerName: "Codi", width: 150, filter: true, floatingFilter: true},
        {field: "nom", headerName: "Punt d'interès", width: 390, sortable: true, filter: true, floatingFilter: true},
    ]);


    useEffect(() => {
        descarrega()
    }, [espaiId]);
    const descarrega = async () => {
        if (espaiId !== -1) {
            try {
                const response = await axios.get("http://www.gorifranco.com/api/punts_per_espai/" + espaiId, {
                    headers: {
                        'Authorization': `Bearer ${usuari.api_token}`,
                    }
                })
                setPunts(response.data.data)
            } catch (error) {
                console.log(error);
            }
        }
        setDescarregant(false);
    }

    function changeEspai(espai) {
        console.log(espai)
        if (espai) {
            setEspaiId(espai)
        } else {
            setEspaiId(0)
        }
    }

    if (descarregant) {
        return (
            <div>
                <h1>Punts d'interès</h1>
                <Spinner/>
            </div>
        );
    } else {
        return (
            <>
                <div className={"my-4 mx-auto"}>
                    <SelectEspais onChange={changeEspai}/>
                </div>
                <hr/>
                <Row md={4} className="justify-content-center">
                    <Col className={"align-middle my-auto"}>
                        <h4 className={"text-center mb-0"}>Llista de punts d'interès</h4>
                    </Col>
                    {espaiId > 0 && (
                        <Col md={1}>
                            <PlusButton
                                onClick={() => {
                                    navigate(`/punts/afegir/${espaiId}`);
                                }}
                            />
                        </Col>
                    )}

                </Row>
                <br/>
                <div className="ag-theme-quartz mx-auto mb-3" style={{height: 400, width: '100%', maxWidth:550}}>
                    <AgGridReact
                        columnDefs={columnes}
                        rowData={punts}
                        pagination={true}
                        localeText={AG_GRID_LOCALE_CAT}
                        paginationPageSize={8}
                        onRowClicked={(e) => {
                            navigate("/punts/editar/" + e.data.id);
                        }}
                    />
                </div>
            </>
        );
    }

}    