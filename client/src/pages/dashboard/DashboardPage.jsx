import Profile from "./Profile"
import Rooms from "./Rooms"


const DashboardPage = () => {
    return (
        <div className="dasboard-wrapper flex flex-col md:flex-row items-center justify-center min-h-screen">
            <div className="profile w-full md:w-[30%] md:min-h-screen pt-14 md:pt-20">
                <Profile />
            </div>
            <div className="rooms-wrapper w-full md:w-[70%]">
                <Rooms />
            </div>
        </div>
    )
}

export default DashboardPage
