import useRequireAuth from "../../hooks/useRequireAuth";
import useAuthStore from "../../store/Auth";
import Profile from "./Profile";
import Rooms from "./Rooms";

const DashboardPage = () => {

    const { user, loading } = useAuthStore();
    useRequireAuth(user, loading);

    return (
        <div className="dashboard-wrapper flex flex-col md:flex-row min-h-screen">
            {/* Profile section - sticky */}
            <div className="profile w-full md:w-[30%] md:min-h-screen pt-14 md:pt-16 sticky top-0 bg-red-400">
                <Profile />
            </div>

            {/* Rooms section - scrollable */}
            <div className="rooms-wrapper w-full md:w-[70%] md:pt-16 overflow-auto md:h-screen bg-[#FFAD60]">
                <Rooms />
            </div>
        </div>
    );
};

export default DashboardPage;
