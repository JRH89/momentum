'use client'
// src/context/AuthProvider.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../../firebase'; // Adjust the path as necessary
import { signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '@firebase/auth';

const AuthContext = createContext();

export function useAuth() {
	return useContext(AuthContext);
}

export function AuthProvider({ children }) {
	const [user, setCurrentUser] = useState(null);
	const [loading, setLoading] = useState(true);

	// src/context/AuthProvider.js
	const login = async (email, password) => {
		try {
			await signInWithEmailAndPassword(auth, email, password); // Correct usage
		} catch (error) {
			console.error('Login error:', error.message);
			throw error;
		}
	};


	const logout = async () => {
		try {
			await signOut(auth);
		} catch (error) {
			console.error('Logout error:', error.message);
			throw error;
		}
	};

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((user) => {
			setCurrentUser(user);
			setLoading(false);
		});

		return unsubscribe;
	}, []);

	const value = {
		user,
		loading,
		login,
		logout,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
