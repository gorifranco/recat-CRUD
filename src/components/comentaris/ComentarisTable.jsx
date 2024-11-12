import React, {useState, useEffect, Fragment, useContext} from "react";
import {Row, Col, Spinner, Button} from 'react-bootstrap';
import {AgGridReact} from 'ag-grid-react'; // React Grid Logic
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme
import {AG_GRID_LOCALE_CAT} from "../utils/language.cat";
import axios from "axios";
import {MenuContext} from "../utils/MenuContext";
import CustomSwitch from "../utils/CustomSwitch";
import Modal from "react-bootstrap/Modal";
import EliminarModal from "../utils/EliminarModal";

export default function ComentarisTable() {
    const usuari = useContext(MenuContext)
    const [showModal, setShowModal] = useState(false)
    const [modalInfo, setModalInfo] = useState({
        id: '',
        comentari: '',
        espai: '',
        valoracio: '',
        validat: '',
    })
    const [comentaris, setComentaris] = useState([]);
    const [descarregant, setDescarregant] = useState(true);
    const [columnes, setColumnes] = useState([
        {field: "id", headerName: "Codi", width: 90, filter: true, floatingFilter: true, onCellClicked: obrirInfo},
        {
            field: "comentari",
            headerName: "Comentari",
            width: 450,
            sortable: true,
            filter: true,
            floatingFilter: true,
            onCellClicked: obrirInfo
        },
        {
            field: "espai.nom",
            headerName: "Espai",
            width: 250,
            sortable: true,
            filter: true,
            floatingFilter: true,
            onCellClicked: obrirInfo
        },
        {
            field: "valoracio",
            headerName: "Valoració",
            width: 115,
            sortable: true,
            filter: true,
            floatingFilter: true,
            onCellClicked: obrirInfo
        },
        {
            field: "validat",
            headerName: "Activat",
            cellRenderer: SwitchRender,
            editable: true,
            width: 150,
            sortable: true
        },
    ]);
    if ((usuari.tipusUsuari === "administrador" || window.location.pathname === "/comentaris/meus") && columnes.length === 5) {
        setColumnes(prevColumnes => [
            ...prevColumnes,
            {
                headerName: "Eliminar",
                cellRenderer: botoEsborrar,
                editable: false,
                width: 150,
                sortable: false,
            }
        ]);
    }

    function botoEsborrar({value, data}) {
        return (
            <span
                style={{
                    display: 'flex',
                    verticalAlign: 'middle',
                }}
            >
                <EliminarModal missatge={"Segur que desitges eliminar el comentari?"}
                               handleAccept={() => eliminar_comentari(data.id)}>Eliminar</EliminarModal>
    </span>
        );
    }

    function obrirInfo({data}) {
        setModalInfo(data)
        setShowModal(true)
    }

    function SwitchRender({value, data}) {

        if (window.location.pathname === "/comentaris/meus") {
            return (
                <span
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        height: '100%',
                        alignItems: 'center',
                    }}
                >
    {
        <img
            alt={`${value}`}
            src={`https://www.ag-grid.com/example-assets/icons/${
                value ? 'tick-in-circle' : 'cross-in-circle'
            }.png`}
            style={{width: 'auto', height: 'auto'}}
        />
    }
  </span>
            );
        }
        return (

            <span
                style={{
                    display: 'flex',
                    verticalAlign: 'middle',
                    marginTop: '5px',
                }}
                onClick={() => {
                    activa_desactiva_Comentari(data.id)
                }}
            >
      <CustomSwitch estat={Boolean(value)}/>
    </span>
        );
    }

    async function activa_desactiva_Comentari(id) {
        await axios.get('http://www.gorifranco.com/api/comentaris/validar_invalidar/' + id, {
            headers: {
                'Authorization': `Bearer ${usuari.api_token}`,
            },
        });
    }

    async function eliminar_comentari(id) {
        try {
            await axios.delete('http://www.gorifranco.com/api/comentaris/' + id, {
                headers: {
                    'Authorization': `Bearer ${usuari.api_token}`,
                },
            });
            window.location.reload()
        } catch (e) {
            alert("No s'ha pogut eliminar el comentari")
        }
    }

    useEffect(() => {
        descarrega()
    }, [window.location.pathname]);

    async function descarrega() {
        try {
            let resposta = null;
            if (window.location.pathname === "/comentaris/meus") {
                resposta = await axios.get('http://www.gorifranco.com/api/comentaris_per_usuari/' + usuari.id, {
                    headers: {
                        'Authorization': `Bearer ${usuari.api_token}`,
                        'Content-Type': 'application/json'
                    },
                });
                setComentaris(resposta.data.data)
            }else{
            if (usuari.tipusUsuari === "administrador") {
                resposta = await axios.get('http://www.gorifranco.com/api/comentaris', {
                    headers: {
                        'Authorization': `Bearer ${usuari.api_token}`,
                        'Content-Type': 'application/json'
                    },
                });
                setComentaris(resposta.data.data)
            } else {
                resposta = await axios.get('http://www.gorifranco.com/api/comentaris_per_gestor/' + usuari.id, {
                    headers: {
                        'Authorization': `Bearer ${usuari.api_token}`,
                        'Content-Type': 'application/json'
                    },
                });
                let comentaris = resposta.data.data.flatMap(e => {
                    return e.comentaris.map(c => {
                        return {
                            ...c,
                            espai: e.nom
                        };
                    });
                });
                setComentaris(comentaris);
            }
        }
        } catch (error) {
            console.error(error);
        }
        setDescarregant(false);
    }


    if (descarregant) {
        return (
            <div>
                <h1>Comentaris</h1>
                <Spinner/>
            </div>
        );
    } else {
        return (
            <>
                <hr/>
                <Row md={4} className="justify-content-center">
                    <Col className={"align-middle my-auto"}>
                        <h4 className={"text-center"}>{window.location.pathname === "/comentaris/meus" ? "Els meus comentaris" : "Llista de comentaris"}</h4>
                    </Col>
                </Row>
                <br/>
                <div className="ag-theme-quartz text-capitalize mx-auto mb-3" style={{height: 400, width:"100%",  maxWidth: 1060}}>
                    <AgGridReact
                        columnDefs={columnes}
                        rowData={comentaris}
                        pagination={true}
                        localeText={AG_GRID_LOCALE_CAT}
                        paginationPageSize={8}
                    />
                </div>
                <Modal
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    show={showModal}
                    onHide={() => setShowModal(false)}

                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Comentari {modalInfo.id}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className={"row"}>
                            <div className={"col-md-6"}><h4>Valoració</h4><p>{modalInfo.valoracio}</p></div>
                            <div className={"col-md-6"}><h4>Validat</h4><p>{modalInfo.validat ? "SI" : "NO"}</p></div>
                        </div>
                        <h4>Comentari</h4>
                        <p>{modalInfo.comentari}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        {window.location.pathname !== "/comentaris/meus" &&
                            (<Button onClick={async () => {
                                    await activa_desactiva_Comentari(modalInfo.id);
                                    setShowModal(false);
                                    window.location.reload();
                                }}>
                                    {modalInfo.validat ? "Invalidar" : "Validar"}</Button>
                            )}
                        {(usuari.tipusUsuari === "administrador" || window.location.pathname === "/comentaris/meus") && (
                            <EliminarModal missatge={"Segur que desitges eliminar el comentari?"}
                                           handleAccept={async () => {
                                               await eliminar_comentari(modalInfo.id);
                                           }}>Eliminar</EliminarModal>)}
                    </Modal.Footer>
                </Modal>
            </>
        );

    }

}    