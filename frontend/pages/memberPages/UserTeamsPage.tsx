import { useParams } from "react-router-dom"
import ManagerTeam from '../../components/managerComponents/ManagerTeam';
import MemberTeam from '../../components/memberComponents/MemberTeam';

const UserTeamsPage = () => {
    const {userRole} = useParams();

    return (
        userRole === 'manager' ? <ManagerTeam /> : <MemberTeam />
    )
}

export default UserTeamsPage