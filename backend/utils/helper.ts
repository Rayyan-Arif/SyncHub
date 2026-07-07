import type {Server} from 'http';
import pool from '../db.js';
import type { TeamsData } from './interfaces.js';

export const gracefulShutdown = (server: Server): () => void => {
    return async () => {
        try{
            server.close(async () => {
                console.log("Shutting down server...");

                await pool.end();
                process.exit(0);
            });
        } catch(err){
            process.exit(1);
        }
    }
}

export const formatOrganizationDetails = (organizationDetails: Object, members: Object[], teamsAndProjects: TeamsData[]) => {
    let organization: {} = {...organizationDetails, members: [...members], teams: []}; 

    let teams: any[] = []; 
    teamsAndProjects.forEach(team => {
        if(!teams?.find(t => t?.team_id === team.team_id)){
            teams.push({
                team_id: team.team_id,
                team_name: team.team_name,
                no_of_members: team.no_of_members,
                projects: teamsAndProjects.map(project => {
                    return {
                        team_id: project.team_id,
                        project_id: project.project_id,
                        project_name: project.project_name,
                        description: project.description,
                        status: project.status,
                        start_date: project.start_date,
                        target_completion_date: project.target_completion_date
                    }
                }).filter(project => project.team_id === team.team_id)
            })
        }
    });

    organization = {...organization, teams: teams ?? []};

    return organization;
}

export const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}