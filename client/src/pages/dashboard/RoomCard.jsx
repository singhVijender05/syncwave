import PropTypes from 'prop-types';
import { BsPersonCircle } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { MdLiveTv, MdDelete } from "react-icons/md";
import { TbExternalLink } from "react-icons/tb";
import { formatDate, getYouTubeThumbnail } from '../../utils/functions';

const RoomCard = ({ room, deletable }) => {

    return (
        <div key={room._id} className="card group card-compact bg-base-100 mr-3 mb-3 w-full md:w-96 shadow-2xl shadow-[#72563b] font-poppins overflow-hidden">
            <div className="card-body">
                <h2 className="card-title font-bold underline text-2xl capitalize">{room.name}</h2>
                <div className='flex items-center space-x-2'>
                    <span className='font-bold'>Created At: </span>
                    <span>{formatDate(room?.createdAt)}</span>
                </div>
                <div className='flex items-center space-x-2'>
                    <span className='font-bold'>Admins: </span>
                    <div className='flex items-center flex-wrap'>
                        {
                            room.admins.map(admin => (
                                <UserIcon key={admin?._id} user={admin} />
                            ))
                        }
                    </div>
                </div>
                <div className='flex items-center space-x-2'>
                    <span className='font-bold'>Members: </span>
                    <div className='flex items-center flex-wrap'>
                        {
                            room.members.map(member => (
                                <UserIcon key={member?._id} user={member} />
                            ))
                        }
                    </div>
                </div>
                <div className='flex flex-col space-y-2'>
                    <span className='font-bold'>History: </span>
                    <div className="carousel w-full">
                        {
                            room.videoHistory.map((video, index) => {
                                const thumbnailUrl = getYouTubeThumbnail(video.videoUrl);
                                const previousSlide = (index === 0) ? room.videoHistory.length - 1 : index - 1;
                                const nextSlide = (index === room.videoHistory.length - 1) ? 0 : index + 1;

                                return (
                                    <>
                                        <div key={video._id} id={`slide${index}${room._id}`} className="carousel-item relative w-full flex flex-col space-y-2">
                                            <Link to={video.videoUrl} className='w-full h-full flex items-center justify-center' target='_blank'>
                                                {thumbnailUrl ?
                                                    <img
                                                        src={thumbnailUrl} // Use the YouTube thumbnail or the placeholder
                                                        alt="Video thumbnail"
                                                        className="w-full h-64 rounded-xl"
                                                    /> :
                                                    <div className='w-full h-64 flex items-center justify-center bg-[#F05A7E] rounded-xl'>
                                                        <MdLiveTv size={100} />
                                                    </div>
                                                }
                                            </Link>
                                            <div className="absolute left-5 right-5 top-[45%] flex -translate-y-1/2 transform justify-between">
                                                <a href={`#slide${previousSlide}${room._id}`} className="btn btn-neutral btn-circle">❮</a>
                                                <a href={`#slide${nextSlide}${room._id}`} className="btn btn-neutral btn-circle">❯</a>
                                            </div>
                                            <div>
                                                Video watched at: <strong>{formatDate(video.watchedAt)}</strong>
                                            </div>
                                        </div>
                                    </>
                                );
                            })
                        }
                    </div>
                </div>
            </div>
            {
                deletable &&
                <div className='absolute btn btn-neutral -right-20 top-16 group-hover:right-2 transition-all duration-300 delete-room-btn' data-room-id={room._id} data-room-name={room.name}>
                    <MdDelete size={30} />
                </div>
            }
            <Link to={`/rooms/${room._id}`} className='absolute btn btn-neutral -right-20 top-2 group-hover:right-2 transition-all duration-300'>
                <TbExternalLink size={30} />
            </Link>
        </div>
    );
};

RoomCard.propTypes = {
    room: PropTypes.object.isRequired,
    deletable: PropTypes.bool.isRequired
};


const UserIcon = ({ user }) => {
    return (
        <div key={user._id} className='tooltip tooltip-bottom mr-2 mb-1' data-tip={user?.name}>
            {
                user?.profilePicture ?
                    <img src={user?.profilePicture} alt="profile" className="rounded-full w-8 h-8 object-cover ring-base ring-offset-base-100 ring-1 ring-offset-2" />
                    :
                    <BsPersonCircle size={30} />
            }
        </div>
    );
};

UserIcon.propTypes = {
    user: PropTypes.object.isRequired
};

export default RoomCard;
