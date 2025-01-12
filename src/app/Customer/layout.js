'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { auth } from '../../../firebase';
import Breadcrumb from '../../components/BreadcrumbMenu';
import Sidebar from '../../components/customer/SideBar';
import { useAuth } from '../../context/AuthProvider';

const ProtectedRoute = ({ children }) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const { userId } = useParams();
    const { user } = useAuth();

    useEffect(() => {
        const checkAuth = async () => {
            if (!user) {
                await router.push('/Customer/login');
            }
            setLoading(false);
        };

        checkAuth();
    }, [router, user]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex min-h-screen bg-white w-full">
            <Sidebar uid={userId} customerId={auth.currentUser?.uid} />

            {/* Main Content */}
            <main className="relative flex flex-col w-full bg-white pt-16">
                <div className="absolute hidden sm:flex top-3 justify-center w-full">
                    <Breadcrumb
                        homeElement={"Home"}
                        separator={<span> / </span>}
                        activeClasses="bg-gradient-to-r from-confirm to-destructive text-transparent bg-clip-text"
                        containerClasses="flex w-full flex-wrap justify-center items-center shadow-md shadow-black text-black mx-auto rounded-lg border-2 p-1 border-black"
                        listClasses="hover:underline items-center mx-2 font-bold flex flex-row text-xs sm:text-sm"
                        capitalizeLinks
                    />
                </div>

                {children}
            </main>
        </div>
    );
};

export default ProtectedRoute;
