import { BsPersonCircle } from "react-icons/bs";
import useRoomStore from "../../store/Room";
import useSocketStore from "../../store/Socket";
import { useState } from "react";

const Members = () => {
    const { members } = useRoomStore();
    const { connectedMembers } = useSocketStore();
    const [tooltip, setTooltip] = useState({ visible: false, name: '', x: 0, y: 0 });

    const handleMouseEnter = (e, name) => {
        const rect = e.target.getBoundingClientRect();
        setTooltip({
            visible: true,
            name: name,
            x: rect.left + window.scrollX,
            y: rect.top + window.scrollY - 40, // Adjust as needed
        });
    };

    const handleMouseLeave = () => {
        setTooltip({ visible: false, name: '', x: 0, y: 0 });
    };

    return (
        <>
            <div className="members flex space-x-2 overflow-x-auto">
                {
                    members.map((member, index) => (
                        <div key={index} className="relative">
                            <div
                                className={`avatar ${connectedMembers.includes(member._id) ? 'online' : 'offline'}`}
                                onMouseEnter={(e) => handleMouseEnter(e, member.name)}
                                onMouseLeave={handleMouseLeave}
                            >
                                <div className="rounded-full w-10 h-10">
                                    {
                                        member.profilePicture ? (
                                            <img
                                                alt="profile"
                                                src={member.profilePicture}
                                                className="w-10 h-10"
                                            />
                                        ) : (
                                            <BsPersonCircle size={40} className="w-10 h-10" />
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>

            {tooltip.visible && (
                <div
                    className="absolute bg-gray-700 text-white py-1 px-3 rounded-md z-[60] text-nowrap"
                    style={{ top: tooltip.y, left: tooltip.x }}
                >
                    {tooltip.name}
                </div>
            )}
        </>
    );
};

export default Members;
