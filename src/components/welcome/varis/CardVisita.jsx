import {Button, Card} from "react-bootstrap";

export default function CardVisita(props){
    console.log(props.info)
    return(
        <Card style={{ width: '18rem', height: '100%' }}>
            <Card.Body style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Card.Title className={"text-center"}>{props.info.nom}</Card.Title>
                <hr />
                <Card.Text style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ flex: 1 }}>
                        <p>{props.info.descripcio}</p>
                        <p>{props.info.dataInici + " - " + props.info.dataFi}</p>
                        <p>Inscripció: {props.info.reqInscripcio ? "SI" : "NO"}</p>
                        <p>Preu: {props.info.preu + "€"}</p>
                    </div>
                    <div style={{ flex: 1 }}>
                        <Card.Subtitle className={"text-center mt-2 mb-1"}>Punts visitats</Card.Subtitle>
                        {props.info.punts_interes.map((value, index) => {
                            return (
                                <p key={index+1}>{index} - {value.nom}</p>
                            )
                        })}
                    </div>
                </Card.Text>
                <div className={"text-center"}>
                    <Button className={"mx-auto"} variant="primary" style={{ marginTop: 'auto' }}>Més informació</Button>
                </div>
            </Card.Body>
        </Card>

    )
}