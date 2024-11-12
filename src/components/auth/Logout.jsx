import {Button, Container, Form} from 'react-bootstrap';
import {storage} from "../utils/storage";
import axios from "axios";
import {useContext} from "react";
import {MenuContext} from "../utils/MenuContext";
import {useNavigate} from "react-router-dom";


export default function Logout() {
    const navigate = useNavigate()
    const usuari = useContext(MenuContext)

    function tancar(e) {
        e.preventDefault()
        axios.get("http://www.gorifranco.com/api/logout", {
            headers: {
                'Authorization': `Bearer ${usuari.api_token}`,
            }
        }).then(() => {
            storage.remove('token');
            storage.remove('usuari');
        }).then(() => {
            navigate("/")
            window.location.reload()
        })
    }

    return (
        <Container className={"my-5 text-center"}>
            <h2>Sortir de la sessió?</h2>
            <Form onSubmit={tancar} action="/">
                <Button variant="primary" type="submit">
                    Sortir
                </Button>
            </Form>
        </Container>
    );
}