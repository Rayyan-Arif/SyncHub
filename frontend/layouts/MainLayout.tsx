import { Outlet, useRouteLoaderData } from "react-router-dom";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useState } from "react";
import type { User } from "../utils/interfaces";

const MainLayout = () => {
    const res = useRouteLoaderData("root");

    const [user, setUser] = useState<User | null>(res?.status === 'success' ? res.data?.user : null);

    return (
        <>
            <Navbar user={user} setUser={setUser} isLanding={false}/>
            <Outlet context={{ user, setUser }} />
            <Footer />
        </>
    );
};

export default MainLayout;