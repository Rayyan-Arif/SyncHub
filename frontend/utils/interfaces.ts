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
    admin_of_organizations: [{
        "organization_id": number,
        "organization_name": string,
        "contact": string,
        "description": string | null,
        "admin_id": number,
        "created_at": string
    }],
    member_of_organizations: [{
        "organization_id": number,
        "organization_name": string,
        "contact": string,
        "description": string | null,
        "created_at": string,
        "role_in_organization": string
    }]
}

export interface Organization {
    organization_name: string, 
    contact: string, 
    description: string
}