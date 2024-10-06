import { useEffect, useState } from 'react'
import { FcGoogle } from 'react-icons/fc'
import { useLocation, useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/Auth'

const SignIn = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' })
    const navigate = useNavigate()
    const location = useLocation();
    const { login, googleAuth } = useAuthStore()
    const queryParams = new URLSearchParams(location.search);
    const redirectPath = queryParams.get('redirect') || '/dashboard';

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }

    const handleSignin = async () => {
        await login(credentials, navigate, redirectPath)
    }

    const signupWithRedirectUrl = () => {
        navigate(`/sign-up?redirect=${redirectPath}`)
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth'
            });
        }, 1000);

        // Clean up the timeout if the component unmounts
        return () => clearTimeout(timer);
    }, []);


    return (
        <>
            <div className='flex pb-28 lg:pb-0 px-8 md:px-40 lg:px-0 py-10 md:py-16 lg:pt-12 lg:py-0 flex-col items-center justify-center space-y-4 lg:space-y-3 xl:space-y-4'>
                <h1 className='text-4xl md:text-5xl font-bold md:pb-4 lg:pb-0 xl:pb-4 lg:py-2'>Welcome Back</h1>
                <button onClick={googleAuth} className='btn btn-outline w-full lg:w-1/2 border-2 rounded-xl'>
                    <span className='text-2xl pb-1'>
                        <FcGoogle />
                    </span>
                    <span className='font-medium'>Continue with Google</span>
                </button>
                <Divider />
                <div className="inputs w-full lg:w-1/2 pb-6 lg:pb-0 xl:pb-6 flex flex-col items-center space-y-2">
                    <input
                        onChange={handleChange}
                        value={credentials.email}
                        className='border-2 w-full outline-none bg-[#fafafa] border-[#c6c6c6] p-3 px-4 mx-4 rounded-xl'
                        placeholder='Enter the email'
                        type='email' name='email'
                        id='email'
                        required
                    />
                    <input
                        onChange={handleChange}
                        value={credentials.password}
                        className='border-2 w-full outline-none bg-[#fafafa] border-[#c6c6c6] p-3 px-4 mx-4 rounded-xl'
                        placeholder='Enter the password'
                        type='password' name='password'
                        id='password'
                        required
                    />
                </div>
                <button onClick={handleSignin} className='btn btn-active btn-neutral bg-black text-white w-full lg:w-1/2 rounded-xl'>
                    <span>Log in</span>
                </button>
                <div className="alreadyText flex space-x-1">
                    <span>No account?</span>
                    <span className='font-bold cursor-pointer hover:underline' onClick={signupWithRedirectUrl}>
                        Create an account
                    </span>
                </div>
            </div>
        </>
    )
}

const Divider = () => {
    return (
        <div className="or w-full lg:w-1/2 py-4 lg:py-0 xl:py-4 flex items-center space-x-4">
            <div className='w-full h-[0.075rem] bg-gray-300' />
            <div className='text-xl pb-1'>or</div>
            <div className='w-full h-[0.075rem] bg-gray-300' />
        </div>
    )
}

export default SignIn