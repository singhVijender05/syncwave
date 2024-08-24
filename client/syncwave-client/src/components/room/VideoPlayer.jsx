import React from 'react';
import ReactPlayer from 'react-player';

const VideoPlayer = () => {
  return (
    <div style={{ position: 'relative', paddingTop: '56.25%' }}>
      <ReactPlayer
        url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" // Replace with dynamic URL as needed
        className='react-player'
        width='100%'
        height='100%'
        controls
      />
    </div>
  );
};

export default VideoPlayer;
