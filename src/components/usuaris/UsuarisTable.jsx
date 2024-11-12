import React, {useState, useEffect, Fragment, useContext} from "react";
import {Row, Col, Spinner, Button} from 'react-bootstrap';
import {useNavigate} from "react-router-dom";
import {AgGridReact} from 'ag-grid-react'; // React Grid Logic
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css";
import {AG_GRID_LOCALE_CAT} from "../utils/language.cat";
import axios from "axios";
import {MenuContext} from "../utils/MenuContext";
import PlusButton from "../botons/PlusButton"; // Theme

export default function UsuarisTable() {
    const usuari = useContext(MenuContext)
    const [usuaris, setUsuaris] = useState([]);
    const [descarregant, setDescarregant] = useState(true);
    const navigate = useNavigate();
    const [columnes, setColumnes] = useState([
        {field: "id", headerName: "Codi", width: 100, filter: true, floatingFilter: true},
        {field: "name", headerName: "Nom", width: 200, sortable: true, filter: true, floatingFilter: true},
        {field: "email", headerName: "Email", width: 200, sortable: true, filter: true, floatingFilter: true},
        {
            field: "tipusUsuari",
            headerName: "Tipus d'usuari",
            width: 200,
            sortable: true,
            filter: true,
            floatingFilter: true
        },
    ]);


    useEffect(() => {
        descarrega()
    }, []);

    // Exemple de ftech amb async/await
    async function descarrega() {
        try {
            const resposta = await axios.get('http://www.gorifranco.com/api/usuaris', {
                headers: {
                    'Authorization': `Bearer ${usuari.api_token}`,
                }
            });
            setUsuaris(resposta.data.data);
        } catch (error) {
            console.error(error);
        }
        setDescarregant(false);
    }

    if (descarregant) {
        return (
            <div>
                <h1>Usuaris</h1>
                <Spinner/>
            </div>
        );
    } else {
        return (
            <>
                <hr/>
                <Row md={4} className="justify-content-center">
                    <Col className={"align-middle my-auto"}>
                        <h4 className={"text-center mb-0"}>Llista d'usuaris</h4>
                    </Col>
                    <Col md={1}>
                        <PlusButton
                            onClick={() => {
                                navigate("/usuaris/afegir");
                            }}
                        />
                    </Col>
                </Row>
                <br/>
                <div className="ag-theme-quartz mx-auto mb-3" style={{height: 400, width: '100%', maxWidth: 750}}>
                    <AgGridReact
                        columnDefs={columnes}
                        rowData={usuaris}
                        pagination={true}
                        localeText={AG_GRID_LOCALE_CAT}
                        paginationPageSize={8}
                        onRowClicked={(e) => {
                            navigate("/usuaris/" + e.data.id);
                        }}
                    />
                </div>
            </>
        );
    }

}    