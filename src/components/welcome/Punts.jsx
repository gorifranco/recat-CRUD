import CardPunt from "./varis/CardPunt";

export default function Punts({punts}){
    return (
        <>
            <h3 className={"text-center"}>Punts d'interès</h3>
            <div className="container-md border rounded border-3 my-3 p-3">
                <div className="row">
                    {punts.map((value, key) => {
                        return(
                            <div className="col-md-3 py-2" key={key}>
                                <CardPunt info={value}/>
                            </div>
                        )
                    })}
                </div>
            </div>
        </>
    )
}