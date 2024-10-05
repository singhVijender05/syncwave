

const ProfileSkeleton = () => {
    return (
        <div className="h-full flex flex-col items-center justify-center py-10 space-y-6 font-poppins">
            <div className="image">
                <div className="tooltip tooltip-bottom" data-tip="Change your avatar">
                    <img className="rounded-full w-[16rem] h-[16rem] skeleton bg-red-300 shadow-2xl shadow-black" />
                </div>
            </div>
            <div className="rooms">
                <p className="skeleton bg-red-300 w-40 h-7 rounded-full"></p>
            </div>
            <div className="flex flex-col justify-center details md:px-10 space-y-2 md:space-y-3">
                <h2 className="skeleton bg-red-300 h-10 w-80 rounded-full  shadow-2xl shadow-red-950 "></h2>
                <h3 className="skeleton bg-red-300 h-8 w-80 rounded-full  shadow-2xl shadow-red-950">

                </h3>
                <h3 className="skeleton bg-red-300 h-8 w-80 rounded-full  shadow-2xl shadow-red-950">

                </h3>
            </div>
            <input type="file" id="file" name='profilePicture' className="hidden" />
            <button className="btn btn-neutral w-1/2 invisible">Edit Avatar</button>
        </div>
    )
}

export default ProfileSkeleton
