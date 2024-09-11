import { useParams } from "react-router-dom";

const RoomPage = () => {
    const { roomId } = useParams();
    return (
        <div className="mt-40">
            {roomId}
        </div>
    )
}

export default RoomPage
