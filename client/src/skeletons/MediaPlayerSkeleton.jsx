

const MediaPlayerSkeleton = () => {
    return (
        <div className="player w-full md:w-[65%] p-3 md:p-5 space-y-4">
            <h1 className="skeleton h-8 md:h-12 w-3/4 rounded-full"></h1>
            <div className="skeleton w-full h-60 md:h-3/4"></div>
            <div className="members-wrapper flex space-x-2 items-end">
                <div className="icons flex items-center space-x-2">
                    <div className="skeleton w-11 h-11 rounded-full ml-2"></div>
                    <div className="skeleton w-11 h-11 rounded-full ml-2"></div>
                    <div className="skeleton w-11 h-11 rounded-full ml-2"></div>
                    <div className="skeleton w-11 h-11 rounded-full ml-2"></div>
                </div>
            </div>
        </div>
    )
}

export default MediaPlayerSkeleton
