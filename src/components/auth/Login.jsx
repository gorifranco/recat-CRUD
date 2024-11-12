import React, {useState} from 'react';
import {Alert, Spinner, Form, Button} from 'react-bootstrap';
import {useNavigate} from "react-router-dom";


export default function Login(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [usuari_nom, setUsuari_nom] = useState('');
    const navigate = useNavigate();

    function ferLogin() {
        let data = {email: email, password: password}
        setLoading(true);
        fetch('http://www.gorifranco.com/api/login',
            {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(resposta => {
                return resposta.json()
            })
            .then(respostajson => {
                if (respostajson.usuari) {
                    let token = respostajson.token;
                    let usuari = respostajson.usuari;
                    setUsuari_nom(usuari.nom + ' ' + usuari.llinatge1);
                    props.guardaUsuari(usuari);  //executa la funció guardaUsuari que li passam per props
                    setError(false);
                    navigate('/');
                } else {
                    setError(true);
                }
                setLoading(false);
            })
            .catch(function (error) {
                console.log(error);
                setError(true);
                setLoading(false);
            })

    }

    function handleKeyPress(e) {
        if (e.key === 'Enter') {
            ferLogin()
        }
    }

    if (usuari_nom !== '') {
        return (
            <>
                <hr/>
                <Alert variant="success">
                    Benvingut {usuari_nom}
                </Alert>
            </>
        );
    }

    return (
        <>
            <Button onClick={() => {
                navigate("/")
            }} className="mt-3">
                Tornar
            </Button>
            <h2 className={"text-center mt-4 mb-3"}>Valida Usuari</h2>
            <hr/>
            <Form onSubmit={ferLogin} method='post'>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Entar email" value={email}
                                  onChange={(e) => setEmail(e.target.value)}/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" value={password}
                                  onChange={(e) => setPassword(e.target.value)} name="password"
                                  required
                                  autoComplete="current-password"
                                  onKeyDown={handleKeyPress}
                    />
                </Form.Group>
                <Button variant="primary" onClick={ferLogin}>
                    Login
                </Button>
            </Form>
            {error && <Alert variant="danger">Usuari o password incorrectes.</Alert>}
            {loading && <Alert variant="info"><Spinner/></Alert>}
        </>
    );
}