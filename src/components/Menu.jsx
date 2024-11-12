import {Link, Outlet} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Navbar, Nav, Container, NavDropdown} from 'react-bootstrap';
import {useContext} from "react";
import {MenuContext} from "./utils/MenuContext";
import Footer from "./utils/Footer";

export default function Menu() {
    const usuari = useContext(MenuContext)
    return (
        <>
            <Navbar bg="dark" className="color-nav" variant="dark" expand="sm" sticky="top">
                <Nav className="mr-auto" style={{marginLeft: "20px", minHeight: "40px"}}>
                    {usuari ? (
                        <>
                            {usuari.tipusUsuari !== "usuari" && (
                                <>
                                    <Link className="nav-link" to={"/"}>Home</Link>
                                    <Link className="nav-link" to="/espaistable">Espais</Link>
                                    <Link className="nav-link" to="/puntstable">Punts d'interès</Link>
                                    <Link className={"nav-link"} to="/visitestable">Visites</Link>
                                    <Link className={"nav-link"} to={"/comentaristable"}>Comentaris</Link>
                                    {usuari.tipusUsuari === "administrador" && (
                                        <Link className={"nav-link"} to={"/usuaristable"}>Usuaris</Link>
                                    )}
                                    <NavDropdown drop={"down-centered"} title={"Altres"}>
                                        <NavDropdown.Item href="/municipistable">Municipis</NavDropdown.Item>
                                        <NavDropdown.Item href="/arquitectestable">Arquitectes</NavDropdown.Item>
                                        <NavDropdown.Item href="/serveistable">Serveis</NavDropdown.Item>
                                        <NavDropdown.Item href="/tipusespaistable">Tipus d'espai</NavDropdown.Item>
                                        <NavDropdown.Item href="/modalitatstable">Modalitats</NavDropdown.Item>
                                    </NavDropdown>
                                </>
                            )}
                            <NavDropdown className={"position-absolute"} style={{right: "5%"}}
                                         drop={"down-centered"} title={usuari.email}>
                                <NavDropdown.Item href="/perfil">Perfil</NavDropdown.Item>
                                <NavDropdown.Item href="/comentaris/meus">Els meus comentaris</NavDropdown.Item>
                                <NavDropdown.Item href="/logout">Logout</NavDropdown.Item>
                            </NavDropdown>

                        </>
                    ) : (
                        <div className={"position-absolute d-flex"} style={{right: "5%"}}>
                            <Link className={"nav-link"} to={"/registre"}>Registre</Link>
                            <Link className="nav-link" to="/login">Login</Link>
                        </div>
                    )}
                </Nav>
            </Navbar>
            <Container>
                <Outlet/>
            </Container>
            <Footer/>
        </>
    );
}