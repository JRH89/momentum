'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { auth } from '../../../firebase';
import Sidebar from '../../components/customer/SideBar';
import { useAuth } from '../../context/AuthProvider';
import { LoaderPinwheel } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const { userId } = useParams();
    const { user, isAuthLoaded } = useAuth();

    useEffect(() => {
        const checkAuth = async () => {
            if (isAuthLoaded && !user) {
                await router.push('/Customer/login');
            }
            setLoading(false);
        };

        checkAuth();
    }, [router, user, isAuthLoaded]);

    return (
        <div className="flex min-h-screen bg-white w-full">
            <Sidebar uid={userId} customerId={auth.currentUser?.uid} />
            {/* Main Content */}
            <main className="relative flex flex-col w-full bg-white pt-12 lg:pt-0">
                {children}
            </main>
        </div>
    );
};

export default ProtectedRoute;
