import CardVisita from "./varis/CardVisita";

export default function Visites(props){
    return (
        <>
            <h3 className={"text-center"}>Visites</h3>
            <div className="container-md border rounded border-3 my-3 p-3">
                <div className="row">
                    {props.visites.map((value, index) => {
                            return (
                                <div className="col-md-3 py-2" key={index}>
                                    <CardVisita info={value} />
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        </>
    )
}