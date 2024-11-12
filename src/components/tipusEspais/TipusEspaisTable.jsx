import React, {useState, useEffect, Fragment} from "react";
import {Row, Col, Spinner, Button} from 'react-bootstrap';
import {useNavigate} from "react-router-dom";
import {AgGridReact} from 'ag-grid-react'; // React Grid Logic
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css";
import {AG_GRID_LOCALE_CAT} from "../utils/language.cat";
import PlusButton from "../botons/PlusButton"; // Theme

export default function TipusEspaisTable() {
    const [tipus_espais, setTipus_espais] = useState([]);
    const [descarregant, setDescarregant] = useState(true);
    const navigate = useNavigate();
    const [columnes, setColumnes] = useState([
        {field: "id", headerName: "Codi", width: 150, filter: true, floatingFilter: true},
        {field: "nom", headerName: "Tipus d'espai", width: 390, sortable: true, filter: true, floatingFilter: true},
    ]);


    useEffect(() => {
        descarrega()
    }, []);
    // Exemple de ftech amb async/await
    const descarrega = async () => {
        try {
            const resposta = await fetch('http://www.gorifranco.com/api/tipus_espais');
            // if (resposta.status !== 200) throw 'Error en descarregar les dades';
            const jsonresposta = await resposta.json();
            setTipus_espais(jsonresposta.data);
        } catch (error) {
            console.log(error);
        }
        setDescarregant(false);
    }

    if (descarregant) {
        return (
            <div>
                <h1>Tipus d'espais</h1>
                <Spinner/>
            </div>
        );
    } else {
        return (
            <>
                <hr/>
                <Row md={4} className="justify-content-center">
                    <Col className={"align-middle my-auto"}>
                        <h4 className={"text-center mb-0"}>Llista de tipus d'espais</h4>
                    </Col>
                    <Col md={1}>
                        <PlusButton
                            onClick={() => {
                                navigate("/tipusespais/afegir");
                            }}
                        />
                    </Col>
                </Row>
                <br/>
                <div className="ag-theme-quartz mx-auto mb-3" style={{height: 400, width: '100%', maxWidth: 560}}>
                    <AgGridReact
                        columnDefs={columnes}
                        rowData={tipus_espais}
                        pagination={true}
                        localeText={AG_GRID_LOCALE_CAT}
                        paginationPageSize={8}
                        onRowClicked={(e) => {
                            navigate("/tipusespais/" + e.data.id);
                        }}
                    />
                </div>
            </>
        );
    }

}    