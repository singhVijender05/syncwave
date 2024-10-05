import { Link } from 'react-router-dom'
import footer from '/footer.svg'

const Footer = () => {
    return (
        <>
            <div className={`flex flex-col transition-all duration-300 footer font-poppins`}>
                <div className="image w-full pt-4 -mb-12">
                    <img className='w-full' src={footer} alt="footer" />
                </div>

                <div className="details pb-20 px-4 lg:px-0 lg:pl-24 w-full text-white bg-[#C62467]">
                    <div className="wrapper space-y-6 lg:space-y-0 flex-col lg:flex-row w-fit lg:space-x-20 lg:mx-auto flex">

                        <div className="vishal lg:px-24 space-y-5 lg:w-1/2">
                            <h3 className='font-DancingScript text-7xl'>SyncWave</h3>
                            <p className='text-xl'>
                                SyncWave lets you create virtual rooms to watch videos in sync with friends, chat live, and track your shared viewing history.
                            </p>
                        </div>

                        <div className="projects space-y-6 lg:pl-12 lg:w-1/2">
                            <h3 className='text-5xl font-DancingScript'>Contact info:</h3>
                            <p className='text-xl flex flex-col'>
                                <span>
                                    Have questions? Reach out at:
                                </span>
                                <Link to='mailto:support@example.com' className='text-white'>
                                    <strong>support@example.com</strong>
                                </Link>
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default Footer