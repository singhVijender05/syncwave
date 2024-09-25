import PropTypes from 'prop-types';

// Placeholder image for non-YouTube videos or cases where a thumbnail isn't available
const placeholderThumbnail = '/path-to-placeholder-image.jpg'; // Replace with the actual path to the placeholder image

const RoomCard = ({ room }) => {
    // Function to extract video ID from YouTube URL and generate the thumbnail URL
    const getYouTubeThumbnail = (url) => {
        const videoIdMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
        return videoIdMatch ? `https://img.youtube.com/vi/${videoIdMatch[1]}/hqdefault.jpg` : null;
    };

    return (
        <div key={room._id} className="card card-compact bg-base-100 w-96 shadow-xl">
            <div className="card-body">
                <h2 className="card-title capitalize">{room.name}</h2>
                <p>
                    <span>Admins: </span>
                    {
                        room.admins.map(admin => (
                            <span key={admin._id} className="text-primary">{admin.name}</span>
                        ))
                    }
                </p>
                <p>
                    <span>Members: </span>
                    {
                        room.members.map(member => (
                            <span key={member._id} className="text-primary">{member.name}</span>
                        ))
                    }
                </p>
                <p>
                    <span>Created At: </span>
                    <span>{new Date(room.createdAt).toLocaleString()}</span>
                </p>
                <p>
                    <span>History of videos: </span>
                    <div className="flex gap-4">
                        {
                            room.videoHistory.map(video => {
                                const thumbnailUrl = getYouTubeThumbnail(video.videoUrl);
                                return (
                                    <img
                                        key={video._id}
                                        src={thumbnailUrl || placeholderThumbnail} // Use the YouTube thumbnail or the placeholder
                                        alt="Video thumbnail"
                                        className="w-32 h-24 object-cover"
                                    />
                                );
                            })
                        }
                    </div>
                </p>
            </div>
        </div>
    );
};

RoomCard.propTypes = {
    room: PropTypes.object.isRequired
};

export default RoomCard;
