import React, {useState, useEffect, Fragment} from "react";
import {ListGroup, Row, Col, Spinner, Button} from 'react-bootstrap';
import {useNavigate} from "react-router-dom";
import {AgGridReact} from 'ag-grid-react'; // React Grid Logic
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css";
import {AG_GRID_LOCALE_CAT} from "../utils/language.cat";
import PlusButton from "../botons/PlusButton"; // Theme

export default function ModalitatsTable() {
    const [modalitats, setModalitats] = useState([]);
    const [descarregant, setDescarregant] = useState(true);
    const navigate = useNavigate();
    const [columnes, setColumnes] = useState([
        {field: "id", headerName: "Codi", width: 150, filter: true, floatingFilter: true},
        {field: "nom", headerName: "Arquitecte", width: 390, sortable: true, filter: true, floatingFilter: true},
    ]);


    useEffect(() => {
        descarrega()
    }, []);
    const descarrega = async () => {
        try {
            const resposta = await fetch('http://www.gorifranco.com/api/modalitats');
            // if (resposta.status !== 200) throw 'Error en descarregar les dades';
            const jsonresposta = await resposta.json();
            setModalitats(jsonresposta.data)
        } catch (error) {
            console.log(error);
        }
        setDescarregant(false);
    }

    if (descarregant) {
        return (
            <div>
                <h1>Modalitats</h1>
                <Spinner/>
            </div>
        );
    } else {
        return (
            <>
                <hr/>
                <Row md={4} className="justify-content-center">
                    <Col className={"align-middle my-auto"}>
                        <h4 className="text-center mb-0">Llista de modalitats</h4>
                    </Col>
                    <Col md={1}>
                        <PlusButton
                            onClick={() => {
                                navigate("/modalitats/afegir");
                            }}
                        />
                    </Col>
                </Row>
                <br/>
                <div className="ag-theme-quartz text-capitalize mx-auto mb-3" style={{height: 400, width: '100%', maxWidth: 550}}>
                    <AgGridReact
                        columnDefs={columnes}
                        rowData={modalitats}
                        pagination={true}
                        localeText={AG_GRID_LOCALE_CAT}
                        paginationPageSize={8}
                        onRowClicked={(e) => {
                            navigate("/modalitats/" + e.data.id);
                        }}
                    />
                </div>
            </>
        );
    }

}    