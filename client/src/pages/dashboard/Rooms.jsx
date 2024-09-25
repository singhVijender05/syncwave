import { useEffect } from "react";
import useRoomStore from "../../store/Room"
import RoomCard from "./RoomCard";

const Rooms = () => {
    const { rooms, getAllRooms } = useRoomStore();

    useEffect(() => {
        if (!rooms.length)
            getAllRooms();
    }, [])

    useEffect(() => {
        console.log(rooms)
    }, [rooms])

    return (
        <div>
            <div className="created">
                <h1>Created Rooms</h1>
                <div className="room-cards flex space-x-2">
                    {
                        rooms.createdRooms &&
                            rooms.createdRooms.length ? rooms.createdRooms.map(room => (
                                <RoomCard key={room._id} room={room} />
                            )) : <p>No rooms created</p>
                    }
                </div>
            </div>
        </div>
    )
}

export default Rooms
