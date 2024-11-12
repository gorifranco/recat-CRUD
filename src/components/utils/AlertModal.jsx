import {Button} from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import {useEffect, useState} from "react";

export default function AlertModal({visible, titol, missatge, onHide}) {

    const [show, setShow] = useState(visible)

    useEffect(() => {
        setShow(visible);
    }, [visible]);

    function handleClose() {
        onHide()
    }

    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{titol}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{missatge}</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleClose}>
                        Tanca
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}