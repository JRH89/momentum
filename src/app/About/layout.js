'use client';

import AboutSidebar from '../../components/page/AboutSidebar';

const Layout = ({ children }) => {

    return (
        <div className="flex min-h-screen bg-white w-full">
            <AboutSidebar />
            <main className="relative flex flex-col w-full bg-white ">
                {children}
            </main>
        </div>
    )
};

export default Layout;
