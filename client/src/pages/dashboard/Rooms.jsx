import { useEffect } from "react";
import useRoomStore from "../../store/Room"
import RoomCard from "./RoomCard";
import { FaCircleExclamation } from "react-icons/fa6";
import PropTypes from 'prop-types';
import RoomCardSkeleton from "../../skeletons/RoomCardSkeleton";

const Rooms = () => {
    const { rooms, getAllRooms } = useRoomStore();

    useEffect(() => {
        if (!rooms.createdRooms)
            getAllRooms();
    }, [])

    // Event delegation for room card deletion
    const handleDelete = (e) => {
        const deleteBtn = e.target.closest('.delete-room-btn');
        const modal = document.getElementById('my_modal_6');
        if (deleteBtn) {
            const roomId = deleteBtn.getAttribute('data-room-id');
            const roomName = deleteBtn.getAttribute('data-room-name');
            if (roomId) {
                //set the room name in strong inside the p tag in the modal
                modal.querySelector('p').innerHTML = `Are you sure you want to delete <strong>${roomName}</strong>?`;
                modal.showModal();
                modal.setAttribute('data-room-id', roomId);
            }
        }
    };


    return (
        <div className="flex flex-col justify-center">
            <div className="created font-poppins px-2 md:px-5 py-10">
                <h1 className="text-[2.75rem] md:text-5xl font-bold mb-6">Created Rooms</h1>
                <div id="room-cards" onClick={handleDelete} className="room-cards flex flex-wrap flex-col md:flex-row mb-10">
                    {
                        rooms.createdRooms ?
                            (rooms.createdRooms.length ? rooms.createdRooms.map(room => (
                                <RoomCard key={room._id} room={room} deletable={true} />
                            )) :
                                <p className="flex items-center justify-center space-x-2">
                                    <FaCircleExclamation className="text-3xl text-red-500" />
                                    <span className="w-full text-left">
                                        No rooms created
                                    </span>
                                </p>) :
                            <RoomCardSkeleton />
                    }
                </div>
                <h1 className="text-5xl font-bold mb-6">Joined Rooms</h1>
                <div className="room-cards flex flex-wrap flex-col md:flex-row">
                    {
                        rooms.joinedRooms ?
                            (rooms.joinedRooms.length ? rooms.joinedRooms.map(room => (
                                <RoomCard key={room._id} room={room} deletable={false} />
                            )) :
                                <p className="flex items-center justify-center space-x-2">
                                    <FaCircleExclamation className="text-3xl text-red-500" />
                                    <span className="w-full text-left">
                                        No rooms joined
                                    </span>
                                </p>) :
                            <RoomCardSkeleton />
                    }
                </div>
            </div>
            <ConfirmationModal />
        </div>
    )
}

const ConfirmationModal = () => {
    const { deleteRoomById } = useRoomStore();

    const handleSubmit = (e) => {
        e.preventDefault();
        const roomId = document.getElementById('my_modal_6').getAttribute('data-room-id');
        deleteRoomById(roomId);
        document.getElementById('my_modal_6').close();
    }

    return (
        <dialog id="my_modal_6" className="modal modal-bottom sm:modal-middle font-poppins">
            <div className="modal-box space-y-3">
                <h3 className="font-bold text-2xl">Delete Room</h3>
                <p className="">Are you sure you want to delete this room?</p>
                <div className="modal-action">
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                        <button type="submit" onClick={handleSubmit} className="btn btn-neutral mt-1">Delete</button>
                    </form>
                </div>
            </div>
        </dialog>
    )
}

ConfirmationModal.propTypes = {
    roomId: PropTypes.string
}

export default Rooms
