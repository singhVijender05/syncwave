import { BsPersonCircle } from "react-icons/bs";
import useRoomStore from "../../store/Room";
import useSocketStore from "../../store/Socket";
import { useEffect } from "react";

const Members = () => {

    const { members } = useRoomStore();
    const { connectedMembers } = useSocketStore();

    useEffect(() => {
        console.log('Connected members:', connectedMembers);
    }, [connectedMembers]);

    return (
        <>
            <div className="members space-x-2">
                {
                    members.map((member, index) => (
                        <div key={index} className="tooltip" data-tip={member.name}>
                            <div className={`avatar ${connectedMembers.includes(member._id) ? 'online' : 'offline'}`}>
                                <div className="rounded-full w-10 h-10">
                                    {
                                        member.profilePicture ?
                                            <img
                                                alt="profile"
                                                src={member.profilePicture}
                                                className="w-10 h-10"
                                            /> :
                                            <BsPersonCircle size={40} className="w-10 h-10" />
                                    }
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </>
    )
}

export default Members
