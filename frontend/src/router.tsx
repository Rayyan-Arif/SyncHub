import { Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import LandingPage from '../pages/LandingPage';
import NotFoundPage from '../pages/NotFoundPage';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import OwnerStatsPage from '../pages/OwnerStatsPage';
import UserDashboardPage from '../pages/memberPages/UserDashboardPage';
import AdminOrganizationPage from '../pages/adminPages/AdminOrganizationPage';
import MainLayout from '../layouts/MainLayout';
import { getUserLoader } from "../utils/helper";

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route path="/" element={<LandingPage />}/>

            <Route element={<MainLayout />} loader={getUserLoader} id="root">
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/owner" element={<OwnerStatsPage />} />
                <Route path="/dashboard" element={<UserDashboardPage />} />
                <Route path="/organization/admin/:organization_id" element={<AdminOrganizationPage />} />
                <Route path="*" element={<NotFoundPage />}/>
            </Route>

        </>
    )
);

export default router;