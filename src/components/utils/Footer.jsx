import {Link} from "react-router-dom";

export default function () {

    return (
        <footer className={"overflow-hidden"} style={{width: "100%", backgroundColor: "#222222"}}>
            <div className="container text-white mx-auto">
                <div className="pt-4 pb-2">
                    <ul className="nav justify-content-center border-bottom pb-4 mb-3">
                        <Link className="nav-link px-2 text-white" to={"/"}>HOME</Link>
                        <li className="nav-item"><a href="#" className="nav-link px-2 text-white">PROTECCIÓ DE DADES</a></li>
                        <li className="nav-item"><a href="#" className="nav-link px-2 text-white">FAQs</a></li>
                        <Link className="nav-link px-2 text-white" to={"/contacte"}>CONTACTE</Link>
                    </ul>
                    <p className="text-center text-white">© 2024 TEAMROCKET, Inc</p>
                </div>
            </div>
        </footer>
    )
}
