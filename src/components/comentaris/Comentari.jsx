import ReactStars from "react-rating-stars-component";

export default function Comentari({data}) {
    console.log(data)
    return data ? (
        <div className={"container shadow p-4 my-3"}>
            <h5>{data.usuari.name}</h5>
            {data.created_at !== null && (
            <p style={{
                color: "gray",
                fontSize: "8pt",
                marginBottom: "3px"
            }}>{data.created_at.replace("T", " ").split(".")[0]}</p>
            )}
            <ReactStars
                value={data.valoracio}
                edit={false}
                count={5}
                size={24}
                isHalf={false}
                activeColor="#ffd700"
            />
            <p className={"mb-0"}>{data.comentari}</p>
        </div>
    ) : null
}