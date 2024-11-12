import {Form, Button, Alert, Toast, Spinner, FormGroup, FormLabel} from "react-bootstrap";
import {useState} from "react";
import ReactStars from "react-rating-stars-component";
import AlertModal from "../utils/AlertModal";
import InputError from "../utils/InputError";

export default function FormComentari({onSubmit, errors, className}) {
    const [formData, setFormData] = useState({
        comentari: '',
        valoracio: '',
    })

    function handleSubmit(e) {
        e.preventDefault();
        onSubmit(formData)
    }

    return (
        <div className={"container mt-3 mb-5 " + className}>
            <div style={{textAlign: 'center', marginBottom: "20px"}}><h3>Envia els teus comentaris</h3></div>
            <Form onSubmit={handleSubmit}>
                <div style={{display: 'flex', alignItems: 'center', marginBottom: "5px"}}>
                    <h5 style={{marginBottom: "0", marginRight: "15px"}}>Valoració</h5>
                    <ReactStars
                        count={5}
                        onChange={(e) => setFormData({
                            ...formData,
                            valoracio: e
                        })}
                        size={24}
                        isHalf={false}
                        activeColor="#ffd700"
                    />
                </div>
                <InputError message={errors.valoracio}/>
                <Form.Group className="mb-3">
                    <Form.Label><h5 style={{marginBottom: "0"}}>Comentari</h5></Form.Label>
                    <InputError message={errors.comentari}/>
                    <Form.Control as="textarea" rows={4} value={formData.comentari}
                                  onChange={(e) => setFormData({
                                      ...formData,
                                      comentari: e.target.value
                                  })}/>
                </Form.Group>
                <Button type={"submit"}>COMENTAR</Button>
            </Form>
        </div>

    )
}