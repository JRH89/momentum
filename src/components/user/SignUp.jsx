'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { setDoc, doc } from 'firebase/firestore'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { db, auth } from '../../../firebase'

const SignUpForm = () => {
    const router = useRouter()
    const [user, setUser] = useState({
        email: '',
        password: '', // Add password to the user state
    })
    const [error, setError] = useState(null)

    const handleSignUp = async (e) => {
        e.preventDefault(); // Prevent default form submission

        try {
            const { email, password } = user;

            // Create user with email and password
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const userId = userCredential.user.uid;

            // Save user info to Firestore
            const userDocRef = doc(db, 'users', userId);
            await setDoc(userDocRef, {
                userId,
                email,
                isPremium: false,
                isSubscribed: true,
                isAdmin: false,
            }, { merge: true });

            // Send welcome email
            const response = await fetch('/api/sendWelcomeEmail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email
                }),
            });

            const data = await response.json();
            if (!data.success) {
                throw new Error(data.error);
            }

            // Redirect to the dashboard after successful sign-up
            router.push('/Dashboard');

        } catch (error) {
            setError(error.message); // Set error message

        }
    }

    return (
        <>
            <div className="space-y-4 max-w-xs justify-center h-full my-auto items-center min-h-screen font-semibold flex flex-col mx-auto w-screen px-10">
                <p className='pb-6 text-black text-2xl text-center'>
                    Sign Up
                </p>
                {error && <p className="text-destructive">{error.message}</p>}
                <input
                    type="email"
                    autoFocus
                    placeholder="Email"
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                    className="border p-2 rounded w-full mx-auto flex text-neutral-950 bg-white"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={user.password}
                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                    className="border p-2 rounded w-full mx-auto text-neutral-950 bg-white autofill:bg-white"
                    required
                />
                <br />
                <button onClick={handleSignUp} type="submit" className="bg-confirm hover:bgopacoty-60 shadow-black shadow-md hover:shadow-black hover:shadow-lg duration-300 text-white py-2 px-4 rounded w-full mx-auto">
                    Submit
                </button>
                <div className="flex flex-col gap-1 w-full justify-center mx-auto items-center">
                    <p className='text-black w-full  text-center'>
                        Already have an account?
                    </p>
                    <a href="/Signin" className="text-destructive hover:opacity-60 duration-300 ">
                        Sign In
                    </a>
                </div>
            </div>
        </>
    )
}

export default SignUpForm
