'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../../../firebase'

const LoginForm = ({ route }) => {
    const router = useRouter()
    const [credentials, setCredentials] = useState({
        email: '',
        password: '',
    })
    const [error, setError] = useState(null)
    const [isResetMode, setIsResetMode] = useState(false) // New state to toggle forms

    const handleLogin = async (e) => {
        e.preventDefault()

        try {
            const { email, password } = credentials

            // Sign in user with email and password
            await signInWithEmailAndPassword(auth, email, password)

            // Redirect to the dashboard after successful login
            router.push(route ? `${route}` : '/Dashboard')
        } catch (error) {
            setError(error.message) // Set error message
        }
    }

    const handlePasswordReset = async (e) => {
        e.preventDefault()

        try {
            const { email } = credentials

            // Send password reset email
            await sendPasswordResetEmail(auth, email)
            setError('Password reset email sent. Check your inbox/spam folder.')
            setIsResetMode(false) // Switch back to login form
        } catch (error) {
            setError(error.message) // Set error message
        }
    }

    return (
        <>
            <div className="space-y-4 max-w-xs justify-center h-full my-auto items-center min-h-screen font-semibold flex flex-col mx-auto w-screen  px-10">
                <p className='pb-6 text-black text-2xl text-center'>
                    {isResetMode ? 'Reset Password' : 'Sign In'}
                </p>
                {error && <p className="text-red-500">{error}</p>}
                {isResetMode ? (
                    <>
                        <input
                            type="email"
                            placeholder="Email"
                            value={credentials.email}
                            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                            className="border p-2 bg-white rounded w-full mx-auto flex text-neutral-950"
                            required
                        />
                        <button onClick={handlePasswordReset} type="submit" className="bg-confirm shadow-black shadow-md hover:bg-opacity-60 hover:shadow-black hover:shadow-lg duration-300 text-white py-2 px-4 rounded w-full mx-auto">
                            Submit
                        </button>
                        <div className="flex flex-col gap-1 w-full justify-center mx-auto items-center">
                            <p className='text-black w-full text-center'>Remember your password? </p>
                            <button onClick={() => setIsResetMode(false)} className="text-destructive hover:opacity-60 duration-300">
                                Back to Sign In
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <input
                            type="email"
                            placeholder="Email"
                            value={credentials.email}
                            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                            className="border p-2 rounded w-full mx-auto flex text-neutral-950"
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={credentials.password}
                            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                            className="border bg-white p-2 rounded w-full mx-auto text-neutral-950"
                            required
                        />
                        <br />
                        <button onClick={handleLogin} type="submit" className="bg-confirm hover:bg-opacity-60 shadow-md shadow-black hover:shadow-lg hover:shadow-black duration-300 text-white py-2 px-4 rounded w-full mx-auto">
                            Submit
                        </button>
                        <div className="flex flex-col gap-1 w-full justify-center mx-auto items-center">
                            <a href="/Signup" className="text-destructive hover:opacity-60 duration-300 ">
                                Need An Account?
                            </a>
                            <button onClick={() => setIsResetMode(true)} className="text-destructive hover:opacity-60 duration-300">
                                Forgot Password?
                            </button>
                        </div>
                    </>
                )}
            </div>
        </>
    )
}

export default LoginForm
