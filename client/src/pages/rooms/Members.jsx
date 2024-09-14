import { BsPersonCircle } from "react-icons/bs";
import useRoomStore from "../../store/Room";

const Members = () => {

    const { members } = useRoomStore();

    return (
        <>
            <div className="members space-x-2">
                {
                    members.map((member, index) => (
                        <div key={index} className="tooltip" data-tip={member.name}>
                            <div className="avatar online">
                                <div className="rounded-full">
                                    <BsPersonCircle size={40} />
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
