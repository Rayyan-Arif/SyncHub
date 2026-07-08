import { useParams } from 'react-router-dom';
import ManagerProjects from '../../components/managerComponents/ManagerProjects';
import MemberProjects from '../../components/memberComponents/MemberProjects';

const UserProjectsPage = () => {
    const { userRole } = useParams();

    return userRole === 'manager' ? <ManagerProjects /> : <MemberProjects />;
};

export default UserProjectsPage;
