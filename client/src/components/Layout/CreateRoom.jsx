import { useNavigate } from 'react-router-dom'
import useRoomStore from "../../store/Room";
import { showToast } from "../../utils/toast";

const CreateRoom = () => {

    const navigate = useNavigate();
    const { createRoom } = useRoomStore();

    const handleSubmit = async (e) => {
        const name = document.getElementById('name').value.trim();
        if (!name) {
            e.preventDefault();
            showToast('Please enter a room name', 'error');
            return;
        }
        createRoom(name, navigate);
        document.getElementById('name').value = '';
    }

    return (
        <>
            <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle font-poppins">
                <div className="modal-box space-y-3">
                    <h3 className="font-bold text-2xl">Create Room</h3>
                    <input
                        className='border-2 w-full outline-none bg-[#fafafa] border-[#c6c6c6] p-3 px-4 rounded-xl'
                        placeholder='Enter the room name'
                        type='text' name='name'
                        id='name'
                        required
                    />
                    <div className="modal-action">
                        <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                            <button type="submit" onClick={handleSubmit} className="btn btn-neutral mt-1">Submit</button>
                        </form>
                    </div>
                </div>
            </dialog>
        </>
    )
}

export default CreateRoom
