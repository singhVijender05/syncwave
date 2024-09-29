import MediaPlayer from "./MediaPlayer";
import Chat from "./Chat";
import useSocketStore from "../../store/Socket";
import { useEffect } from "react";
import useRoomStore from "../../store/Room";
import { useParams } from "react-router-dom";
import Members from "./Members";
import useAuthStore from "../../store/Auth";

const RoomPage = () => {
    const { socket, createSocket, videoUrl } = useSocketStore();
    const { room, sendVideoUrl, joinRoom } = useRoomStore();
    const { user } = useAuthStore();
    const { roomId } = useParams();

    useEffect(() => {
        createSocket();
    }, []);

    useEffect(() => {
        if (socket && user) {
            joinRoom(roomId, user._id);
        }
    }, [socket, user]);


    return (
        <div className="w-full relative h-screen flex flex-col md:flex-row md:justify-center pt-20 md:pt-16 font-poppins md:px-10">
            {room && <div className="player w-full md:w-[65%] p-3 md:p-5 space-y-4">
                <h1 className="text-5xl"><strong>{room.name}</strong></h1>
                <MediaPlayer url={videoUrl} roomId={roomId} sendVideoUrl={sendVideoUrl} />
                <div className="members-wrapper">
                    <Members />
                </div>
            </div>}

            <div className="chatwrapper sticky top-16 h-[46%] md:h-full right-4 w-full md:w-[35%] flex p-2 md:p-0">
                <div className="chats w-full flex flex-col space-y-1 border-2 border-gray-500 rounded-xl md:m-4 p-1 relative shadow-black shadow-2xl">
                    {/* Tabs */}
                    <div role="tablist" className="tabs tabs-boxed border border-gray-500">
                        <a role="tab" className="tab tab-active">Chats</a>
                        <a role="tab" className="tab">History</a>
                    </div>

                    {/* Chat box should flex to fill available space */}
                    <div className="flex-1 overflow-hidden">
                        <Chat roomId={roomId} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoomPage;
