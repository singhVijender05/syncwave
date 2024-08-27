import React from 'react';
import ReactPlayer from 'react-player';

const VideoPlayer = () => {
  return (
      <ReactPlayer
        url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" // Replace with dynamic URL as needed
        className='react-player'
        aspectRatio='16:9'
        controls
      />
  );
};

export default VideoPlayer;
