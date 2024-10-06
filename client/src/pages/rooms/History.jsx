import PropTypes from 'prop-types';
import { MdLiveTv } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { formatDate, getYouTubeThumbnail } from '../../utils/functions';
import { FaExchangeAlt } from "react-icons/fa";
import useRoomStore from '../../store/Room';

const History = ({ history, roomId }) => {

    const { sendVideoUrl } = useRoomStore();

    const handleHistoryClick = (e) => {
        const target = e.target.closest('.change-video-btn');
        if (target) {
            const videoUrl = target.getAttribute('data-videourl');
            sendVideoUrl(roomId, videoUrl);
        }
    }

    return (
        <div onClick={handleHistoryClick} className='flex flex-col space-y-2 overflow-y-scroll h-full px-4 py-4'>
            {
                history == null || history.length === 0 ? (
                    <p className="text-gray-500 text-center">No history yet</p>
                ) :
                    history.toReversed().map((video, index) => {
                        const thumbnailUrl = getYouTubeThumbnail(video.videoUrl);
                        return (
                            <div key={index} className='flex flex-col space-y-1'>
                                <Link to={video.videoUrl} className='w-full h-full flex items-center justify-center' target='_blank'>
                                    {thumbnailUrl ?
                                        <img
                                            src={thumbnailUrl}
                                            alt="Video thumbnail"
                                            className="w-full h-56 md:h-64 rounded-xl object-cover"
                                        /> :
                                        <div className='w-full h-56 md:h-64 flex items-center justify-center bg-[#F05A7E] rounded-xl'>
                                            <MdLiveTv size={100} />
                                        </div>
                                    }
                                </Link>
                                <div className='flex items-center space-x-2 text-sm ml-2'>
                                    <div
                                        title="Change video URL"
                                        className='btn btn-neutral min-h-8 h-10 shadow-black shadow-2xl transition-all duration-300 change-video-btn'
                                        data-room-id={roomId}
                                        data-videourl={video.videoUrl} // Using data-videourl for proper HTML5 attribute
                                    >
                                        <FaExchangeAlt size={25} />
                                    </div>
                                    <span>
                                        Video watched at: <strong>{formatDate(video.watchedAt)}</strong>
                                    </span>
                                </div>
                                <div className="divider px-5 divider-neutral"></div>
                            </div>
                        )
                    })
            }
        </div>
    )
}

History.propTypes = {
    history: PropTypes.array.isRequired,
    roomId: PropTypes.string.isRequired
}

export default History;
