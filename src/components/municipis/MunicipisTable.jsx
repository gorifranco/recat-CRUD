import React, {useState, useEffect, Fragment} from "react";
import {ListGroup, Row, Col, Spinner, Button} from 'react-bootstrap';
import {useNavigate} from "react-router-dom";
import {AgGridReact} from 'ag-grid-react'; // React Grid Logic
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css";
import {AG_GRID_LOCALE_CAT} from "../utils/language.cat"; // Theme

export default function MunicipisTable() {
    const [municipis, setMunicipis] = useState([]);
    const [descarregant, setDescarregant] = useState(true);
    const navigate = useNavigate();
    const [columnes, setColumnes] = useState([
        {field: "id", headerName: "Codi", width: 100, filter: true, floatingFilter: true},
        {field: "nom", headerName: "Municipi", width: 200, sortable: true, filter: true, floatingFilter: true},
        {field: "illa.nom", headerName: "Illa", width: 200, sortable: true, filter: true, floatingFilter: true},
        {field: "zona.nom", headerName: "Zona", width: 200, sortable: true, filter: true, floatingFilter: true},
    ]);


    useEffect(() => {
        descarrega()
    }, []);
    // Exemple de ftech amb async/await
    const descarrega = async () => {
        try {
            const resposta = await fetch('http://www.gorifranco.com/api/municipis');
            // if (resposta.status !== 200) throw 'Error en descarregar les dades';
            const jsonresposta = await resposta.json();
            setMunicipis(jsonresposta.data);
        } catch (error) {
            console.log(error);
        }
        setDescarregant(false);
    }

    if (descarregant) {
        return (
            <div>
                <h1>Municipis</h1>
                <Spinner/>
            </div>
        );
    } else {
        return (
            <>
                <hr/>
                    <Row md={4} className="justify-content-center">
                        <Col>
                            <h4 className="text-center">Llista de Municipis</h4>
                        </Col>
                    </Row>
                <br/>
                <div className="ag-theme-quartz mx-auto mb-3" style={{height: 400, width: 725}}>
                    <AgGridReact
                        columnDefs={columnes}
                        rowData={municipis}
                        pagination={true}
                        localeText={AG_GRID_LOCALE_CAT}
                        paginationPageSize={8}
                    />
                </div>
            </>
        );
    }

}    