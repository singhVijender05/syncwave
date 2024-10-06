import { MdLiveTv } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { navTabs } from "../../utils/constants";
import { BsPersonCircle, BsPlusCircleFill } from "react-icons/bs";
import useAuthStore from "../../store/Auth";
import { FaHamburger } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { IoIosLogOut } from "react-icons/io";
import { useEffect, useState } from "react";

const Navbar = () => {
    const { user, logout } = useAuthStore();
    const location = useLocation();
    const navigate = useNavigate();
    const [scrollToFeatures, setScrollToFeatures] = useState(false);

    const handleShowModal = () => {
        const modal = document.getElementById('my_modal_5');
        modal.showModal();
    }

    const handleShowLogout = () => {
        const modal = document.getElementById('my_modal_10');
        modal.showModal();
    }

    const handleLogout = (e) => {
        e.preventDefault();
        logout(navigate);
        document.getElementById('my_modal_10').close();
    }

    // Smooth scroll to features section
    const scrollToSection = (sectionId) => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // This effect will check the location and scroll if necessary
    useEffect(() => {
        if (location.pathname === '/' && scrollToFeatures) {
            scrollToSection('features');
            setScrollToFeatures(false); // Reset after scrolling
        }
    }, [location.pathname, scrollToFeatures]);

    return (
        <>
            <nav className="p-2 backdrop-blur-2xl fixed top-0 w-full z-50 flex items-center justify-between font-poppins shadow-2xl shadow-[#1e1e1c] border-b bg-[#eae3cd]">
                <div className="left flex space-x-6 w-1/2 md:w-3/4">
                    <h1 className="px-4">
                        <Link to="/">
                            <MdLiveTv size={35} />
                        </Link>
                    </h1>
                    <div className='hidden md:block'>
                        <ul className="p-2 flex items-center justify-center space-x-10 font-light text-xl ">
                            {
                                navTabs.map(tab => (
                                    <li key={tab.name}>
                                        {tab.link.startsWith('#') ? (
                                            <span
                                                onClick={() => {
                                                    if (location.pathname !== '/') {
                                                        setScrollToFeatures(true); // Set flag to scroll after navigation
                                                        navigate('/');
                                                    } else {
                                                        scrollToSection(tab.link.substring(1)); // If already on '/', scroll immediately
                                                    }
                                                }}
                                                className={`${location.pathname === tab.link ? 'before:bg-neutral text-white' : 'text-neutral'} before:block before:absolute before:-inset-1 before:-skew-y-3 relative inline-block cursor-pointer`}
                                            >
                                                <span className="relative">{tab.name}</span>
                                            </span>
                                        ) : (
                                            <Link to={tab.link}>
                                                <span className={`${location.pathname === tab.link ? 'before:bg-neutral text-white' : 'text-neutral'} before:block before:absolute before:-inset-1 before:-skew-y-3 relative inline-block`}>
                                                    <span className="relative">{tab.name}</span>
                                                </span>
                                            </Link>
                                        )}
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                </div>
                <div className="right w-1/2 md:w-1/4 flex items-center justify-end px-2">
                    {
                        user && (
                            <IoIosLogOut onClick={handleShowLogout} title="Logout" size={35} className="text-neutral cursor-pointer mx-2" />
                        )
                    }
                    {user && (
                        <BsPlusCircleFill title="Create new Room" onClick={handleShowModal} size={35} className="text-neutral cursor-pointer" />
                    )}
                    {user ? (
                        <Link to="/dashboard" className="text-gray-600 btn shadow-none hover:bg-transparent bg-transparent border-none ">
                            {user?.profilePicture ? (
                                <img src={user?.profilePicture} alt="profile" className="rounded-full w-8 h-8 object-cover ring-base ring-offset-base-100 ring-2 ring-offset-2" />
                            ) : (
                                <BsPersonCircle size={30} />
                            )}
                        </Link>
                    ) : (
                        <Link to="/sign-in" className="btn btn-neutral mx-3">Sign In</Link>
                    )}
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
                                            {tab.link.startsWith('#') ? (
                                                <span
                                                    onClick={() => {
                                                        if (location.pathname !== '/') {
                                                            setScrollToFeatures(true); // Set flag to scroll after navigation
                                                            navigate('/');
                                                        } else {
                                                            scrollToSection(tab.link.substring(1)); // If already on '/', scroll immediately
                                                        }
                                                    }}

                                                    className="cursor-pointer"
                                                >
                                                    {tab.name}
                                                </span>
                                            ) : (
                                                <Link to={tab.link}>
                                                    {tab.name}
                                                </Link>
                                            )}
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
            <dialog id="my_modal_10" className="modal modal-bottom sm:modal-middle font-poppins">
                <div className="modal-box space-y-3">
                    <h3 className="font-bold text-2xl">Logout</h3>
                    <p className="">Are you sure you want to logout?</p>
                    <div className="modal-action">
                        <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                            <button type="submit" onClick={handleLogout} className="btn btn-neutral mt-1">Logout</button>
                        </form>
                    </div>
                </div>
            </dialog>
        </>
    );
}

export default Navbar;
