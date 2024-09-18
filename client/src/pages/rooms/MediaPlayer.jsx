import PropTypes from 'prop-types'; // Import prop-types
import ReactPlayer from 'react-player';
import { MdOutlineAddLink } from 'react-icons/md';
import { showToast } from '../../utils/toast';
import { useEffect, useRef } from 'react';
import useSocketStore from '../../store/Socket';

const MediaPlayer = ({ url, roomId, sendVideoUrl }) => {

    const playerRef = useRef(null); // To control the player instance
    const { socket, videoPlaying, videoTimestamp, setVideoTimestamp, setVideoPlaying } = useSocketStore()

    const handleShowModal = () => {
        const modal = document.getElementById('my_modal_6');
        modal.showModal();
    };

    const handleSubmit = async (e) => {
        const link = document.getElementById('url').value.trim();
        if (!link) {
            e.preventDefault();
            showToast('Please enter a video url', 'error');
            return;
        }
        sendVideoUrl(roomId, link);
    }

    const handlePlayPause = (newPlayingState) => {
        setVideoPlaying(newPlayingState);
        socket.emit('video-state-change', { playing: newPlayingState, timestamp: videoTimestamp, roomId });
    };

    // Handle seek event
    const handleSeek = (newTime) => {
        socket.emit('video-seek', { playing: videoPlaying, timestamp: newTime, roomId });
    };

    useEffect(() => {
        if (playerRef.current) {
            playerRef.current.seekTo(videoTimestamp);
        }
    }, [videoTimestamp]);

    return (
        <div className="relative" style={{ paddingTop: '56.25%' }}> {/* 16:9 Aspect Ratio */}
            {url ? (
                <ReactPlayer
                    ref={playerRef}
                    url={url} // Use the URL passed as a prop
                    playing={videoPlaying} // Sync play/pause state
                    controls
                    width="100%"
                    height="100%"
                    className="absolute top-0 left-0"
                    onPlay={() => handlePlayPause(true)}
                    onPause={() => handlePlayPause(false)}
                    onSeek={(newTime) => handleSeek(newTime)}
                    onProgress={(progress) => setVideoTimestamp(progress.playedSeconds)}
                />
            ) : (
                <FallbackComponent handleShowModal={handleShowModal} />
            )}

            {/* Modal for adding the link */}
            <dialog id="my_modal_6" className="modal modal-bottom sm:modal-middle font-poppins">
                <div className="modal-box space-y-3">
                    <h3 className="font-bold text-2xl">Add a link</h3>
                    <input
                        className="border-2 w-full outline-none bg-[#fafafa] border-[#c6c6c6] p-3 px-4 rounded-xl"
                        placeholder="Enter video link (e.g., YouTube, Vimeo)"
                        type="url"
                        name="url"
                        id="url"
                        required
                    />
                    <div className="modal-action">
                        <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                            <button type="submit" onClick={handleSubmit} className="btn btn-neutral mt-1">Submit</button>
                        </form>
                    </div>
                </div>
            </dialog>
        </div>
    );
};

// Add prop-types validation for MediaPlayer
MediaPlayer.propTypes = {
    url: PropTypes.string, // Optional string for the video URL
    roomId: PropTypes.string.isRequired, // Required string for the room ID
    sendVideoUrl: PropTypes.func.isRequired, // Required function prop for sending the video URL
};

const FallbackComponent = ({ handleShowModal }) => {
    return (
        <div className="absolute top-0 left-0 w-full font-poppins flex flex-col justify-center items-center h-full border-2 border-[#272425] rounded-xl">
            <MdOutlineAddLink onClick={handleShowModal} className="text-5xl text-gray-600 cursor-pointer" />
            <p className="text-center text-gray-500 mt-2">Add a video link to start watching</p>
        </div>
    );
};

// Add prop-types validation for FallbackComponent
FallbackComponent.propTypes = {
    handleShowModal: PropTypes.func.isRequired, // Required function prop for showing the modal
};

export default MediaPlayer;
