import SignIn from "./SignIn"

const SignInPage = () => {
    return (
        <div className="signInWrapper lg:min-h-screen flex flex-col lg:flex-row items-center justify-center font-poppins">
            <div className="image flex items-center justify-center relative min-h-screen bg-center bg-cover lg:w-1/2 bg-[url('https://blog.zegocloud.com/wp-content/uploads/2023/05/watch-movies-together-online.jpg')]">
                <div className='absolute h-full inset-0 bg-gradient-to-l from-transparent via-opacity-50 to-black' />
                <div className="message relative leading-tight md:leading-normal lg:leading-none font-extrabold px-4 md:px-20 lg:px-20 xl:px-32 lg:pt-20 pb-10 z-10 text-6xl md:text-8xl lg:text-7xl xl:text-8xl text-white">
                    Sign in to watch together with friends.
                    <span className='block lg:hidden'>Sign In Today!</span>
                </div>
            </div>
            <div className="form w-full lg:w-1/2">
                <SignIn />
            </div>
        </div>
    )
}

export default SignInPage