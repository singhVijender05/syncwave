import { BsClockFill, BsPersonCircle } from "react-icons/bs"
import useAuthStore from "../../store/Auth"
import { FaEnvelope } from "react-icons/fa"
import ProfileSkeleton from "../../skeletons/ProfileSkeleton"

const Profile = () => {
    const { user, uploadProfilePicture } = useAuthStore()
    const handleUpload = () => {
        const file = document.getElementById('file');
        file.click();
        file.addEventListener('change', async (e) => {
            console.log(e.target.files[0]);
            const formData = new FormData();
            formData.append('profilePicture', e.target.files[0]);
            uploadProfilePicture(formData);
        })
    }
    return (
        !user ?
            <ProfileSkeleton />
            :
            <div className="h-full flex flex-col items-center justify-center py-10 space-y-4 font-poppins">
                <div className="image">
                    <div className="tooltip tooltip-bottom" data-tip="Change your avatar">
                        {
                            user?.profilePicture ?
                                <img src={user?.profilePicture} alt="profile" className="rounded-full w-[16rem] h-[16rem] object-cover ring-neutral ring-offset-base-100 ring-2 ring-offset-4" />
                                :
                                <BsPersonCircle className="text-[16rem] cursor-pointer pb-1" />
                        }
                    </div>
                </div>
                <div className="rooms">
                    <p>No of Rooms: {user?.rooms}</p>
                </div>
                <div className="flex flex-col justify-center details md:px-10 space-y-2 md:space-y-1">
                    <h2 className="capitalize font-bold text-4xl">{user?.name}</h2>
                    <p className="flex items-center space-x-2">
                        <FaEnvelope />
                        <span>
                            {user?.email}
                        </span>
                    </p>
                    <p className="flex items-center space-x-2">
                        <BsClockFill />
                        <span>
                            joined since: {new Date(user?.createdAt).toDateString()}
                        </span>
                    </p>
                </div>
                <input type="file" id="file" name='profilePicture' className="hidden" />
                <button onClick={handleUpload} className="btn btn-neutral w-1/2">Edit Avatar</button>
            </div>
    )
}

export default Profile
