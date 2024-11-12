import {useNavigate} from "react-router-dom";

export default function (props) {
    const navigate = useNavigate()

    return (
        <div className="my-5" style={{height: "380px"}}>
            <h2 className="text-center mb-2 fs-2">{props.data.nom}</h2>
            <div className="row gap-5">
                <div className="col text-center mt-5">{props.data.descripcio}
                    <div className="d-flex justify-content-center mt-5">
                        <button className="btn btn-primary" onClick={() => {
                            navigate("/espai/" + props.data.id);
                        }}>
                            VEURE MÉS
                        </button>
                    </div>
                </div>
                {props.data.imatge !== null &&
                    <div className="col"><img src={props.data.imatge.url} className="img-fluid"
                                              alt={"Imatge de l'espai"}/></div>}
            </div>
        </div>
    )
}