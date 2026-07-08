import { Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import LandingPage from '../pages/LandingPage';
import NotFoundPage from '../pages/NotFoundPage';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import OwnerStatsPage from '../pages/OwnerStatsPage';
import UserDashboardPage from '../pages/memberPages/UserDashboardPage';
import AdminOrganizationPage from '../pages/adminPages/AdminOrganizationPage';
import UserOrganizationPage from '../pages/memberPages/UserOrganizationPage';
import MainLayout from '../layouts/MainLayout';
import UserDashboardLayout from "../layouts/UserDashboardLayout";
import UserTeamsPage from "../pages/memberPages/UserTeamsPage";
import UserProjectsPage from "../pages/memberPages/UserProjectsPage";
import { getUserLoader } from "../utils/helper";

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route path="/" element={<LandingPage />}/>

            <Route element={<MainLayout />} loader={getUserLoader} id="root">
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/owner" element={<OwnerStatsPage />} />

                <Route path="/dashboard" element={<UserDashboardLayout />}> 
                    <Route index element={<UserDashboardPage />} />
                    <Route path="organization/admin/:organization_id" element={<AdminOrganizationPage />} />
                    <Route path="organization/:userRole/:organization_id" element={<UserOrganizationPage />}/>
                    <Route path="organization/:userRole/:organization_id/teams/:teamID" element={<UserTeamsPage />}/>
                    <Route path="organization/:userRole/:organization_id/teams/:teamID/projects/:projectID" element={<UserProjectsPage />}/>
                </Route>

                <Route path="*" element={<NotFoundPage />}/>
            </Route>

        </>
    )
);

export default router;