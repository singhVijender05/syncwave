import Typed from 'typed.js';
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
    const el = useRef(null);

    useEffect(() => {
        if (el.current == null) return;
        const typed = new Typed(el.current, {
            strings: ['Create a room', 'Invite friends', 'Chat live', 'Watch videos like never before!!'],
            typeSpeed: 30,
        });

        return () => {
            // Destroy Typed instance during cleanup to stop animation
            typed.destroy();
        };
    }, []);

    return (
        <div className='py-28 flex items-center md:px-20 lg:px-20 xl:px-28 px-4 relative min-h-screen bg-center bg-cover bg-[url("/hero_bg.webp")] font-poppins text-white'>
            <div className='absolute h-full inset-0 bg-gradient-to-r md:bg-gradient-to-l from-transparent via-opacity-50 to-black'></div>
            <div className="content relative z-20 space-y-4 md:space-y-8">
                <h2 className='text-xl md:text-2xl'>
                    <span>Welcome to</span> <span className='realistic-marker-highlight text-4xl'>SyncWave</span>
                </h2>
                <h1 className={`text-6xl md:text-8xl font-bold `}>Watch Videos Together, Anytime, Anywhere!</h1>
                <p className=' text-xl md:text-2xl'>
                    Create your room, <span className='realistic-marker-highlight'>invite friends</span>, watch your favorite videos together, and chat live—all in one place!
                </p>
                <h3 className='text-lg md:text-2xl'>
                    <span ref={el} className=''></span>
                </h3>
                <Link to='/dashboard' className="btn btn-active">Create Your Room Now</Link>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" className="svg-filters" style={{ display: 'none' }}>
                <defs>
                    <filter id="marker-shape">
                        <feTurbulence type="fractalNoise" baseFrequency="0.02 0.6" numOctaves="2" result="noise" />
                        <feDisplacementMap in="SourceGraphic" in2="noise" scale="20" xChannelSelector="R" yChannelSelector="G" />
                    </filter>
                </defs>
            </svg>
        </div>
    );
};

export default Hero;
