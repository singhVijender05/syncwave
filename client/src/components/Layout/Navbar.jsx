import { MdLiveTv } from "react-icons/md";
import { Link } from "react-router-dom";
import { navTabs } from "../../utils/constants";
import { BsPersonCircle } from "react-icons/bs";
import useAuthStore from "../../store/Auth";
import { FaHamburger } from "react-icons/fa";

const Navbar = () => {
    const { user } = useAuthStore();
    return (
        <>
            <nav className="p-2 backdrop-blur-2xl fixed top-0 w-full z-50 flex items-center justify-between font-poppins shadow-2xl border-b">
                <div className="left w-1/2 md:w-1/4">
                    <h1 className="px-4">
                        <Link to="/">
                            <MdLiveTv size={35} />
                        </Link>
                    </h1>
                </div>
                <div className="center hidden md:block w-1/2">
                    <ul className="p-2 flex items-center justify-center space-x-10 font-bold text-xl border border-black rounded-full">
                        {
                            navTabs.map(tab => (
                                <li key={tab.name}>
                                    <Link to={tab.link}>{tab.name}</Link>
                                </li>
                            ))
                        }
                    </ul>
                </div>
                <div className="right w-1/2 md:w-1/4 flex items-center justify-end px-2">
                    {
                        user ? (
                            <Link to="/dashboard" className="text-gray-600 btn shadow-none hover:bg-transparent bg-transparent border-none ">
                                <BsPersonCircle size={30} />
                            </Link>
                        ) : (
                            <Link to="/sign-in" className="btn btn-neutral mx-3">Sign In</Link>
                        )
                    }
                    <div className="drawer md:hidden w-fit">
                        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
                        <div className="drawer-content">
                            <label htmlFor='my-drawer' className="hamburger md:hidden text-gray-600">
                                <FaHamburger size={30} />
                            </label>
                        </div>
                        <div className="drawer-side">
                            <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                            <ul className="menu bg-base-200 text-base-content min-h-full w-52 p-4">
                                {
                                    navTabs.map(tab => (
                                        <li key={tab.name} className="text-lg">
                                            <Link to={tab.link}>{tab.name}</Link>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Navbar
