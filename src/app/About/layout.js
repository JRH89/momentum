'use client';

import AboutSidebar from '../../components/page/AboutSidebar';
import Sidebar from '../../components/SideBar';

const Layout = ({ children }) => {



    return (
        <div className="flex min-h-screen bg-white w-full">
            {/* Sidebar */}
            <AboutSidebar />
            {/* Main Content */}
            <main className="relative flex flex-col w-full bg-white ">
                {children}
            </main>
        </div>
    )
};

export default Layout;
