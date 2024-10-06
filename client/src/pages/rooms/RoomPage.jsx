import MediaPlayer from "./MediaPlayer";
import Chat from "./Chat";
import useSocketStore from "../../store/Socket";
import { useEffect, useState } from "react";
import useRoomStore from "../../store/Room";
import { useParams } from "react-router-dom";
import Members from "./Members";
import useAuthStore from "../../store/Auth";
import { MdEdit } from "react-icons/md";
import { TbExchange } from "react-icons/tb";
import PropTypes from 'prop-types';
import History from "./History";
import { LuCopy, LuCopyCheck } from "react-icons/lu";
import { showToast } from "../../utils/toast";
import useRequireAuth from "../../hooks/useRequireAuth";
import MediaPlayerSkeleton from "../../skeletons/MediaPlayerSkeleton";

const RoomPage = () => {
    const [title, setTitle] = useState('');
    const [placeholder, setPlaceholder] = useState('')
    const [isCopied, setIsCopied] = useState(false);
    const [tab, setTab] = useState('chats');
    const { socket, createSocket, videoUrl } = useSocketStore();
    const { room, sendVideoUrl, joinRoom } = useRoomStore();
    const { user, loading } = useAuthStore();
    const { roomId } = useParams();

    useEffect(() => {
        createSocket();
    }, []);

    useEffect(() => {
        if (socket && user) {
            joinRoom(roomId, user._id);
        }
    }, [socket, user]);

    useRequireAuth(user, loading);

    const showNameChangeBox = () => {
        setTitle('Change Room Name');
        setPlaceholder('Enter the new name');
        document.getElementById('my_modal_7').showModal();
        document.getElementById('edit').value = room.name;
    }

    const showUrlChangeBox = () => {
        setTitle('Change Video URL');
        setPlaceholder('Enter the new video URL');
        document.getElementById('my_modal_7').showModal();
        document.getElementById('edit').value = '';
    }

    const handleCopy = () => {
        const currentUrl = window.location.href; // Get the current page URL
        navigator.clipboard.writeText(currentUrl)
            .then(() => {
                setIsCopied(true); // Show the check icon
                setTimeout(() => setIsCopied(false), 2000); // Revert after 2 seconds
            })
            .catch((err) => {
                showToast('error', 'Failed to copy link');
                console.error('Failed to copy link', err);
            });
    };

    return (
        <div className="w-full relative h-screen flex flex-col md:flex-row md:justify-center pt-20 md:pt-16 font-poppins md:px-10">
            {room ?
                <div className="player w-full md:w-[65%] p-3 md:p-5 space-y-4">
                    <h1 className="text-5xl"><strong>{room.name}</strong></h1>
                    <MediaPlayer url={videoUrl} roomId={roomId} sendVideoUrl={sendVideoUrl} />
                    <div className="members-wrapper flex space-x-2 items-end">
                        {
                            user && room.admins.includes(user._id) &&
                            <div className="icons flex items-center space-x-2">
                                <div title='Change room name' onClick={showNameChangeBox} className='btn btn-neutral transition-all duration-300'>
                                    <MdEdit size={25} />
                                </div>
                                <div title="Change video url" onClick={showUrlChangeBox} className='btn btn-neutral transition-all duration-300'>
                                    <TbExchange size={25} />
                                </div>
                            </div>}
                        <div title="Copy room link" onClick={handleCopy} className='btn btn-neutral transition-all duration-300'>
                            {isCopied ? <LuCopyCheck size={25} /> : <LuCopy size={25} />}
                        </div>
                        <Members />
                    </div>
                </div> :
                <MediaPlayerSkeleton />
            }

            <div className="chatwrapper sticky top-16 h-[46%] md:h-full right-4 w-full md:w-[35%] flex p-2 md:p-0">
                <div className="chats w-full flex flex-col space-y-1 border-2 border-gray-500 rounded-xl md:m-4 p-1 relative shadow-black shadow-2xl">
                    {/* Tabs */}
                    <div role="tablist" className="tabs tabs-boxed border border-gray-500">
                        <a onClick={() => setTab('chats')} role="tab" className={`tab ${tab === 'chats' ? 'tab-active' : ''}`}>Chats</a>
                        <a onClick={() => setTab('history')} role="tab" className={`tab ${tab === 'history' ? 'tab-active' : ''}`}>History</a>
                    </div>

                    {/* Chat box should flex to fill available space */}
                    <div className="flex-1 overflow-hidden">
                        {
                            tab === 'chats' ?
                                <Chat roomId={roomId} /> :
                                <History history={room?.videoHistory} roomId={roomId} />
                        }
                    </div>
                </div>
            </div>
            <DialogBox title={title} placeholder={placeholder} roomId={roomId} />
        </div>
    );
};

const DialogBox = ({ title, placeholder, roomId }) => {

    const { changeRoomName, sendVideoUrl } = useRoomStore();

    const handleEdit = (e) => {
        e.preventDefault();
        const newValue = document.getElementById('edit').value;
        if (title === 'Change Room Name') {
            changeRoomName(roomId, newValue);
        } else {
            sendVideoUrl(roomId, newValue);
        }
        document.getElementById('edit').value = '';
        document.getElementById('my_modal_7').close();
    }

    return (
        <dialog id="my_modal_7" className="modal modal-bottom sm:modal-middle font-poppins">
            <div className="modal-box space-y-3">
                <h3 className="font-bold text-2xl">{title}</h3>
                <input
                    className='border-2 w-full outline-none bg-[#fafafa] border-[#c6c6c6] p-3 px-4 rounded-xl'
                    placeholder={placeholder}
                    type='text' name='edit'
                    id='edit'
                    required
                />
                <div className="modal-action">
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                        <button type="submit" onClick={handleEdit} className="btn btn-neutral mt-1">Change</button>
                    </form>
                </div>
            </div>
        </dialog>
    )
}

DialogBox.propTypes = {
    title: PropTypes.string,
    placeholder: PropTypes.string,
    roomId: PropTypes.string
}

export default RoomPage;
