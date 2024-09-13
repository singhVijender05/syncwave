import ReactPlayer from 'react-player';

const MediaPlayer = () => {
    return (
        <div className="relative" style={{ paddingTop: '56.25%' }}> {/* 16:9 Aspect Ratio */}
            <ReactPlayer
                url="https://www.youtube.com/watch?v=pLPHQaumq4g"
                controls
                width="100%"
                height="100%"
                className="absolute top-0 left-0"
            />
        </div>
    );
};

export default MediaPlayer;