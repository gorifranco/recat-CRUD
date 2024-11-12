export default function Informacio(props){
    return (
        <>
            <h3 className={"text-center"}>Informació</h3>
                <div className="container-md border rounded border-3 my-3 p-3">
                    <p><b>Descripció:</b> {props.informacio.descripcio}</p>
                    <p><b>Valoració global:</b> {props.informacio.valoracio_global}</p>
                    <p><b>Direcció:</b> {props.informacio.direccio}</p>
                    <p><b>Lloc web:</b> <a href={props.informacio.web}>{props.informacio.web} </a></p>
                    <p><b>Localització: </b>{props.informacio.municipi.nom + ", " + props.informacio.municipi.illa.nom}</p>
                    <p><b>Grau d'accessibilitat: </b>{props.informacio.grau_accessibilitat}</p>
                    <p><b>Telèfon de contacte: </b>{props.informacio.telefon}</p>
                    <p><b>Tipus d'espai: </b>{props.informacio.tipus_espai.nom}</p>
                    <p><b>Modalitats: </b>
                        {props.informacio.modalitats.map((m, index) => {
                            return (
                                <span key={m.id}>
                {m.nom}
                                    {index !== props.informacio.modalitats.length - 1 && ", "}
            </span>
                            );
                        })}
                    </p>
                    <p><b>Serveis: </b>
                        {props.informacio.serveis.map((s, index) => {
                            return (
                                <span key={s.id}>
                {s.nom}
                                    {index !== props.informacio.serveis.length - 1 && ", "}
            </span>
                            );
                        })}
                    </p>
                    <p><b>Any de construcció:</b> {props.informacio.any_construccio}</p>
                    <p>
                        <b>{props.informacio.arquitectes.length > 1 ? "Arquitectes" : "Arquitecte"}: </b>
                        {props.informacio.arquitectes.map((a, index) => {
                            return (
                                <span key={a.id}>
                {a.nom}
                                    {index !== props.informacio.arquitectes.length - 1 && ", "}
            </span>
                            );
                        })}
                    </p>                </div>
            </>
    )
}