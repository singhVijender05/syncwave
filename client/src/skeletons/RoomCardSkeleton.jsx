

const RoomCardSkeleton = () => {
    return (
        <div className="card group card-compact bg-base-100 mr-3 mb-3 w-full md:w-96 shadow-2xl shadow-[#72563b] font-poppins overflow-hidden">
            <div className="card-body">
                <h2 className="card-title skeleton h-8 w-full rounded-full"></h2>
                <div className='flex items-center space-x-2'>
                    <span className='font-bold text-nowrap'>Created At: </span>
                    <span className="skeleton w-full h-4"></span>
                </div>
                <div className='flex items-center space-x-2'>
                    <span className='font-bold'>Admins: </span>
                    <div className='flex items-center flex-wrap'>
                        {
                            [...Array(2)].map((_, index) => (
                                <div key={index} className="skeleton w-8 h-8 rounded-full ml-2"></div>
                            ))
                        }
                    </div>
                </div>
                <div className='flex items-center space-x-2'>
                    <span className='font-bold'>Members: </span>
                    <div className='flex items-center flex-wrap'>
                        {
                            [...Array(4)].map((_, index) => (
                                <div key={index} className="skeleton w-8 h-8 rounded-full ml-2"></div>
                            ))
                        }
                    </div>
                </div>
                <div className='flex flex-col space-y-2'>
                    <span className='font-bold'>History: </span>
                    <div className="carousel w-full">
                        {
                            [...Array(3)].map((_, index) => (
                                <div key={index} className="carousel-item relative w-full flex flex-col space-y-2">
                                    <div className="skeleton w-full h-64 rounded-xl"></div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RoomCardSkeleton
