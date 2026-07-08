import { Outlet, useOutletContext } from "react-router-dom"
import type { AuthContext } from "../utils/interfaces"

const UserDashboardLayout = () => {
    const {user, setUser} = useOutletContext<AuthContext>();

    return (
        <>
            <Outlet context={{user, setUser}}/>
        </>
    )
}

export default UserDashboardLayout