import PropTypes from 'prop-types'; // Import prop-types
import ReactPlayer from 'react-player';
import { MdOutlineAddLink } from 'react-icons/md';
import { showToast } from '../../utils/toast';
import { useEffect, useRef, useState } from 'react';
import useSocketStore from '../../store/Socket';

const SEEK_THRESHOLD = 3; // Seconds difference to detect a manual seek

const MediaPlayer = ({ url, roomId, sendVideoUrl }) => {
    const [playing, setPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [lastKnownTime, setLastKnownTime] = useState(0);
    const playerRef = useRef(null); // To control the player instance
    const { socket } = useSocketStore();

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
    };

    const handlePlayPause = (newPlayingState) => {
        setPlaying(newPlayingState);
        socket.emit('video-state-change', { playing: newPlayingState, roomId, timestamp: currentTime });
    };

    const handleSeek = (newTime) => {
        setCurrentTime(newTime);
        socket.emit('video-seek', { timestamp: newTime, roomId });
    };

    const detectSeek = (progress) => {
        const { playedSeconds } = progress;

        if (Math.abs(playedSeconds - lastKnownTime) > SEEK_THRESHOLD) {
            handleSeek(playedSeconds);
        }

        setLastKnownTime(playedSeconds); // Update the last known time
        setCurrentTime(playedSeconds); // Update the current time
    };

    useEffect(() => {
        if (socket && roomId) {
            // Listen to video state updates from other members in the room
            socket.on('video-state-update', (data) => {
                console.log('Received video state update:', data);
                if (data.playing != null && data.playing !== playing) {
                    setPlaying(data.playing);
                }
                if (data.timestamp && data.timestamp !== currentTime) {
                    playerRef.current.seekTo(data.timestamp); // Seek to the timestamp received
                }
            });
        }

        return () => {
            if (socket) {
                socket.off('video-state-update'); // Clean up event listener on unmount
            }
        };
    }, [socket, roomId, playing, currentTime]);

    return (
        <div className="relative" style={{ paddingTop: '56.25%' }}> {/* 16:9 Aspect Ratio */}
            {url ? (
                <ReactPlayer
                    ref={playerRef}
                    url={url} // Use the URL passed as a prop
                    playing={playing} // Sync play/pause state
                    muted={true} // Enable audio
                    controls
                    width="100%"
                    height="100%"
                    className="absolute top-0 left-0"
                    onPlay={() => handlePlayPause(true)}
                    onPause={() => handlePlayPause(false)}
                    onProgress={(progress) => detectSeek(progress)} // Detect seek events
                    onEnded={() => {
                        setPlaying(false);
                        setCurrentTime(0);
                        setLastKnownTime(0);
                        handlePlayPause(false);
                        if (socket) {
                            socket.emit('video-ended', { roomId });
                        }
                    }}
                    onReady={() => {
                        if (socket && roomId) {
                            console.log('Requesting video state sync for new member:', roomId);
                            socket.emit('request-sync', { roomId }); // Request video state sync on load

                            // Listen to video state sync response
                            socket.on('sync-video-state', (data) => {
                                console.log('Syncing video state for new member:', data);
                                if (url && data.playing != null) {
                                    setPlaying(data.playing); // Set the playing state
                                }
                                if (url && data.timestamp != null) {
                                    console.log('useSeeking to:', data.timestamp);
                                    console.log('playerRef:', playerRef);
                                    setCurrentTime(data.timestamp); // Set the current time
                                    playerRef.current.seekTo(data.timestamp); // Sync to the correct timestamp
                                }
                            });
                        }
                    }}
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
