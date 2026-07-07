export interface User {
    user_id: number;
    user_name: string;
    user_email: string;
    user_role: string;
}

export interface AuthContext {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export interface UserSignupStat {
    users_joined: number;
    created_at: string;
}

export interface OwnerStats {
    organizations_created: number;
    users_joined: number;
    teams_created: number;
    projects_started: number;
    assigned_tasks: number;
    users_this_week: UserSignupStat[];
    users_this_month: UserSignupStat[];
}

export interface UserOrganizations {
    admin_of_organizations: AdminOrganization[];
    member_of_organizations: MemberOrganization[];
}

export interface AdminOrganization {
    organization_id: number;
    organization_name: string;
    contact: string;
    description: string | null;
    admin_id: number;
    created_at: string;
}

export interface MemberOrganization {
    organization_id: number;
    organization_name: string;
    contact: string;
    description: string | null;
    created_at: string;
    role_in_organization: string;
}

export interface Members {
    "user_id": number,
    "user_role": string,
    "user_name": string,
    "user_email": string
}

export interface Projects {
    "team_id": number,
    "project_id": number,
    "project_name": string,
    "description": string,
    "status": string,
    "start_date": string,
    "target_completion_date": string
}

export interface Teams {
    "team_id": number,
    "team_name": string,
    "no_of_members": number,
    "projects": Projects[]
}

export interface OrganizationDetailForAdmin {
    organization_id: number;
    organization_name: string;
    contact: string;
    description: string | null;
    created_at: string;
    members: Members[];
    teams: Teams[];
}

export interface OrganizationPerformanceMember {
    user_id: number;
    user_name: string;
    user_email: string;
    teams_joined: number;
    projects_joined: number;
    tasks_assigned: number;
    tasks_completed: number;
}

export interface OrganizationPerformanceManager {
    user_id: number;
    user_name: string;
    user_email: string;
    teams_created: number;
    projects_created: number;
    projects_completed: number;
}

export interface OrganizationPerformance {
    members?: OrganizationPerformanceMember[];
    managers?: OrganizationPerformanceManager[];
}