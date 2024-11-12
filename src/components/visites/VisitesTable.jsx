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

export default function VisitesTable() {
    const usuari = useContext(MenuContext)
    const [espaiId, setEspaiId] = useState()
    const [visites, setVisites] = useState([])
    const [descarregant, setDescarregant] = useState(false);
    const navigate = useNavigate();
    const [columnes, setColumnes] = useState([
        {field: "id", headerName: "Codi", width: 100, filter: true, floatingFilter: true},
        {field: "nom", headerName: "Nom", width: 200, filter: true, floatingFilter: true},
        {
            field: "dataInici",
            headerName: "data d'inici",
            width: 300,
            sortable: true,
            filter: true,
            floatingFilter: true
        },
        {field: "dataFi", headerName: "Data de fi", width: 300, sortable: true, filter: true, floatingFilter: true},
        {field: "places", headerName: "Places", width: 100, sortable: true, filter: true, floatingFilter: true},
    ]);

    useEffect(() => {
        descarrega()
    }, [espaiId]);

    async function descarrega() {
        if (espaiId !== -1) {
            try {
                const response = await axios.get("http://www.gorifranco.com/api/visites_per_espai/" + espaiId, {
                    headers: {
                        'Authorization': `Bearer ${usuari.api_token}`,
                    }
                })
                setVisites(response.data.data)
            } catch (error) {
                console.log(error);
            }
        }
        setDescarregant(false);
    }

    function changeEspai(espai) {
        if (espai) {
            setEspaiId(espai)
        } else {
            setEspaiId(0)
        }
    }

    if (descarregant) {
        return (
            <div>
                <h1>Visites</h1>
                <Spinner/>
            </div>
        );
    }
    return (
        <>
            <div className={"my-4 mx-auto"}>
                <SelectEspais onChange={changeEspai}/>
            </div>
            <hr/>
            <Row md={4} className="justify-content-center">
                <Col className={"align-middle my-auto"}>
                    <h4 className={"text-center mb-0"}>Llista de visites</h4>
                </Col>
                {espaiId > 0 && (
                    <Col md={1}>
                        <PlusButton
                            onClick={() => {
                                navigate(`/visites/afegir/${espaiId}`);
                            }}
                        />
                    </Col>
                )}

            </Row>
            <br/>
            <div className="ag-theme-quartz mx-auto mb-3" style={{height: 400, width: '100%', maxWidth: 1020}}>
                <AgGridReact
                    columnDefs={columnes}
                    rowData={visites}
                    pagination={true}
                    localeText={AG_GRID_LOCALE_CAT}
                    paginationPageSize={8}
                    onRowClicked={(e) => {
                        navigate("/visites/editar/" + e.data.id);
                    }}
                />
            </div>
        </>
    );


}    