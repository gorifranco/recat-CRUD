import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

export default function CardPunt(props) {
    return (
        <Card>
            <Card.Body>
                <Card.Title className={"text-center"}>{props.info.nom}</Card.Title>
                <Card.Img src={props.info.imatge.url} style={{height: "180px"}} className={"mb-2"}/>
                <Card.Text>
                    {props.info.descripcio}
                </Card.Text>
            </Card.Body>
        </Card>
    );
}
