DROP TYPE IF EXISTS USER_ROLE_IN_ORGANIZATION CASCADE;
DROP TYPE IF EXISTS PROJECT_STATUS CASCADE;
DROP TYPE IF EXISTS TASK_STATUS CASCADE;

DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS organization CASCADE;
DROP TABLE IF EXISTS team CASCADE;
DROP TABLE IF EXISTS project CASCADE;
DROP TABLE IF EXISTS task CASCADE;
DROP TABLE IF EXISTS organization_membership CASCADE;
DROP TABLE IF EXISTS project_enrollment CASCADE;
DROP TABLE IF EXISTS team_membership CASCADE;
DROP TABLE IF EXISTS assigned_tasks CASCADE;

CREATE TYPE USER_ROLE_IN_ORGANIZATION AS ENUM ('MANAGER', 'MEMBER');
CREATE TYPE PROJECT_STATUS AS ENUM ('ACTIVE', 'COMPLETED');
CREATE TYPE TASK_STATUS AS ENUM ('ASSIGNED', 'IN PROGRESS', 'COMPLETED');

CREATE TABLE users(
    user_id SERIAL PRIMARY KEY,
    user_name VARCHAR(50) NOT NULL,
    user_email VARCHAR(100) UNIQUE NOT NULL,
    user_password VARCHAR(100) NOT NULL,
    user_role VARCHAR(10) NOT NULL DEFAULT 'USER',
    created_at DATE DEFAULT NOW(),
    CONSTRAINT verify_role CHECK(user_role IN ('USER', 'OWNER'))
);

CREATE TABLE organization(
    organization_id SERIAL PRIMARY KEY,
    organization_name VARCHAR(100) NOT NULL,
    contact VARCHAR(13) NOT NULL,
    description TEXT,
    admin_id INT NOT NULL,
    FOREIGN KEY(admin_id) REFERENCES users(user_id) ON DELETE CASCADE,
    created_at DATE DEFAULT NOW()
);

CREATE TABLE organization_membership(
    user_id INT,
    organization_id INT,
    user_role USER_ROLE_IN_ORGANIZATION NOT NULL DEFAULT 'MEMBER',
    FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE, 
    FOREIGN KEY(organization_id) REFERENCES organization(organization_id) ON DELETE CASCADE,
    PRIMARY KEY(user_id, organization_id)
);

CREATE TABLE team(
    team_id SERIAL PRIMARY KEY,
    team_name TEXT NOT NULL,
    no_of_members INT NOT NULL DEFAULT 5,
    organization_id INT NOT NULL,
    manager_id INT NOT NULL,
    FOREIGN KEY(organization_id) REFERENCES organization(organization_id) ON DELETE CASCADE,
    FOREIGN KEY(manager_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT max_members_in_team CHECK(no_of_members <= 10)
);

CREATE TABLE team_membership(
    team_id INT,
    team_member_id INT
    FOREIGN KEY(team_id) REFERENCES team(team_id),
    FOREIGN KEY(team_member_id) REFERENCES users(user_id),
    PRIMARY KEY(team_id, team_member_id)
);

CREATE TABLE project(
    project_id SERIAL PRIMARY KEY,
    project_name TEXT NOT NULL,
    description TEXT,
    status PROJECT_STATUS NOT NULL DEFAULT 'ACTIVE',
    start_date DATE DEFAULT NOW(),
    target_completion_date DATE NOT NULL,
    team_id INT NOT NULL,
    FOREIGN KEY(team_id) REFERENCES team(team_id) ON DELETE CASCADE
    CONSTRAINT valid_date CHECK(target_completion_date >= start_date)
);

CREATE TABLE project_enrollment(
    project_id INT,
    member_id INT,
    FOREIGN KEY(project_id) REFERENCES project(project_id) ON DELETE CASCADE,
    FOREIGN KEY(member_id) REFERENCES users(user_id) ON DELETE CASCADE,
    PRIMARY KEY(project_id, member_id)
);

CREATE TABLE task(
    task_id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    project_id INT NOT NULL,
    FOREIGN KEY(project_id) REFERENCES project(project_id) ON DELETE CASCADE
);

CREATE TABLE assigned_tasks(
    task_id INT,
    member_id INT,
    assigned_date DATE DEFAULT NOW(),
    due_date DATE NOT NULL,
    status TASK_STATUS DEFAULT 'ASSIGNED',
    FOREIGN KEY(task_id) REFERENCES task(task_id) ON DELETE CASCADE,
    FOREIGN KEY(member_id) REFERENCES users(user_id) ON DELETE CASCADE,
    PRIMARY KEY(task_id, member_id, assigned_date, assigned_date, due_date)
    CONSTRAINT due_greater_than_assigned CHECK(due_date >= assigned_date)
);

CREATE TABLE announcements(
    announcement_id SERIAL PRIMARY KEY,
    announcement TEXT,
    created_at DATE DEFAULT NOW(),
    team_id INT,
    project_id INT,
    FOREIGN KEY(team_id) REFERENCES team(team_id) ON DELETE CASCADE,
    FOREIGN KEY(project_id) REFERENCES project(project_id) ON DELETE CASCADE,
    CONSTRAINT valid_fk_key CHECK(team_id IS NOT NULL OR project_id IS NOT NULL),
    UNIQUE(announcement, team_id, project_id, created_at)
);

DROP FUNCTION IF EXISTS delete_tasks_on_project; 
CREATE OR REPLACE FUNCTION delete_tasks_on_project()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
	DELETE FROM assigned_tasks WHERE member_id = OLD.member_id AND
	task_id IN (SELECT task_id FROM task WHERE project_id = OLD.project_id);
	RETURN OLD;
END;
$$;

CREATE TRIGGER delete_assigned_tasks
BEFORE DELETE 
ON project_enrollment
FOR EACH ROW
EXECUTE FUNCTION delete_tasks_on_project();

DROP FUNCTION IF EXISTS delete_projects_on_team; 
CREATE OR REPLACE FUNCTION delete_projects_on_team()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
	DELETE FROM project_enrollment WHERE member_id = OLD.team_member_id AND
	project_id IN (SELECT project_id FROM project WHERE team_id = OLD.team_id);
	RETURN OLD;
END;
$$;

CREATE TRIGGER delete_project_enrollments
BEFORE DELETE 
ON team_membership
FOR EACH ROW
EXECUTE FUNCTION delete_projects_on_team();

DROP FUNCTION IF EXISTS delete_teams_on_organization; 
CREATE OR REPLACE FUNCTION delete_teams_on_organization()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
	DELETE FROM team_membership WHERE team_member_id = OLD.user_id AND
	team_id IN (SELECT team_id FROM team WHERE organization_id = OLD.organization_id);
	RETURN OLD;
END;
$$;

CREATE TRIGGER delete_team_membership
BEFORE DELETE 
ON organization_membership
FOR EACH ROW
EXECUTE FUNCTION delete_teams_on_organization();