import {BrowserRouter, Routes, Route} from "react-router-dom";
import Menu from "./components/Menu";
import './style.css';
import MunicipisTable from "./components/municipis/MunicipisTable";
import ServeisTable from "./components/serveis/ServeisTable";
import ServeisCRUD from "./components/serveis/ServeisCRUD";
import ArquitectesTable from "./components/arquitectes/ArquitectesTable";
import ArquitectesCRUD from "./components/arquitectes/ArquitectesCRUD";
import TipusEspaisTable from "./components/tipusEspais/TipusEspaisTable";
import TipusEspaisCRUD from "./components/tipusEspais/TipusEspaisCRUD";
import ModalitatsTable from "./components/modalitats/ModalitatsTable";
import ModalitatsCRUD from "./components/modalitats/ModalitatsCRUD";
import EspaisTable from "./components/espais/EspaisTable";
import EspaisCRUD from "./components/espais/EspaisCRUD";
import {useEffect, useState} from "react";
import {storage} from "./components/utils/storage";
import Login from "./components/auth/Login";
import Logout from "./components/auth/Logout";
import {MenuContext} from "./components/utils/MenuContext";
import Home from "./components/welcome/Home";
import Espai from "./components/welcome/Espai";
import PuntsTable from "./components/puntsInteres/PuntsTable";
import PuntsCRUD from "./components/puntsInteres/PuntsCRUD";
import VisitesCRUD from "./components/visites/VisitesCRUD";
import VisitesTable from "./components/visites/VisitesTable";
import ComentarisTable from "./components/comentaris/ComentarisTable";
import UsuarisTable from "./components/usuaris/UsuarisTable";
import UsuarisCRUD from "./components/usuaris/UsuarisCRUD";
import Registre from "./components/auth/Registre";
import Contacte from "./components/welcome/Contacte";

export default function App() {
    const [usuari, setUsuari] = useState(null)

    useEffect(() => {
        const us = storage.get("usuari"); // llegint l'usuari del localStorage
        if (us) {
            setUsuari(us);
        }
    }, []);

    const ferGuardaUsuari = (usuari) => {
        storage.set("usuari", usuari);  // guardant l'usuari al localStorage
        setUsuari(usuari);
    }

    return (
        <MenuContext.Provider value={usuari}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Menu/>}>
                        <Route path={"/"} element={<Home/>}/>
                        <Route path={"/espai/:id"} element={<Espai/>}/>
                        <Route path={"/contacte"} element={<Contacte />} />
                        {usuari ? (<>
                                {usuari.tipusUsuari !== "usuari" &&
                                    (
                                        <>
                                            <Route path="/municipistable" element={<MunicipisTable/>}/>
                                            <Route path="/arquitectestable" element={<ArquitectesTable/>}/>
                                            <Route path="/arquitectes/:id" element={<ArquitectesCRUD/>}></Route>
                                            <Route path="/serveistable" element={<ServeisTable/>}/>
                                            <Route path="/serveis/:id" element={<ServeisCRUD/>}></Route>
                                            <Route path="/tipusespaistable" element={<TipusEspaisTable/>}/>
                                            <Route path="/tipusespais/:id" element={<TipusEspaisCRUD/>}></Route>
                                            <Route path="/modalitatstable" element={<ModalitatsTable/>}/>
                                            <Route path="/modalitats/:id" element={<ModalitatsCRUD/>}></Route>
                                            <Route path="/espaistable" element={<EspaisTable/>}/>
                                            <Route path="/espais/:id" element={<EspaisCRUD/>}></Route>
                                            <Route path="/puntstable" element={<PuntsTable/>}/>
                                            <Route path="/punts/:accio/:id" element={<PuntsCRUD/>}></Route>
                                            <Route path="/visitestable" element={<VisitesTable/>}/>
                                            <Route path="/visites/:accio/:id" element={<VisitesCRUD/>}></Route>
                                            <Route path={"/comentaristable"} element={<ComentarisTable/>}></Route>
                                        </>
                                    )}
                                {usuari.tipusUsuari === "administrador" &&
                                    (
                                        <>
                                            <Route path={"/usuaristable"} element={<UsuarisTable/>}/>
                                            <Route path="/usuaris/:id" element={<UsuarisCRUD/>}></Route>
                                        </>
                                    )}
                                <Route path="/logout" element={<Logout/>}/>
                                <Route path={"/comentaris/meus"} element={<ComentarisTable/>}></Route>
                                <Route path="/perfil" element={<UsuarisCRUD/>}/>

                            </>
                        ) : (
                            <>
                                <Route path="/registre" element={<Registre />}/>
                                <Route path="/login" element={<Login guardaUsuari={ferGuardaUsuari}/>}/>
                            </>
                        )}
                        <Route path="*" element={<h1>Opció incorrecta</h1>}/>
                    </Route>
                </Routes>
            </BrowserRouter>
        </MenuContext.Provider>
    );
}
