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
    PRIMARY KEY(user_id, organization_id, user_role)
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
    CONSTRAINT valid_date CHECK(target_completion_date > start_date)
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
);

CREATE TABLE announcements(
    announcement_id SERIAL PRIMARY KEY,
    announcement TEXT,
    created_at DATE DEFAULT NOW(),
    team_id INT,
    project_id INT,
    FOREIGN KEY(team_id) REFERENCES team(team_id),
    FOREIGN KEY(project_id) REFERENCES project(project_id),
    CONSTRAINT valid_fk_key CHECK(team_id IS NOT NULL OR project_id IS NOT NULL)
);

DROP FUNCTION IF EXISTS get_dashboard_stats();
CREATE OR REPLACE FUNCTION get_dashboard_stats()
RETURNS TABLE (total_organizations BIGINT, total_users BIGINT, total_teams BIGINT, total_projects BIGINT, total_tasks BIGINT, users_this_week BIGINT, users_this_month BIGINT)
LANGUAGE plpgsql
AS $$
BEGIN
	RETURN QUERY
	SELECT 
		(SELECT COUNT(*) FROM organization),
		(SELECT COUNT(*) FROM users),
		(SELECT COUNT(*) FROM team),
		(SELECT COUNT(*) FROM project),
		(SELECT COUNT(*) FROM task),
		(SELECT COUNT(*) FROM (SELECT user_id FROM users WHERE created_at >= CURRENT_DATE - 7)),
		(SELECT COUNT(*) FROM (SELECT user_id FROM users WHERE created_at >= CURRENT_DATE - 30));
END;
$$;

DROP PROCEDURE IF EXISTS create_organization;
CREATE OR REPLACE PROCEDURE create_organization(name TEXT, contact VARCHAR(13), description TEXT, user_id INT)
LANGUAGE plpgsql
AS $$
DECLARE
	oid INT;
BEGIN
	INSERT INTO organization (organization_name, contact, description, admin_id) VALUES (name, contact, description, user_id);
	SELECT organization_id INTO oid FROM organization WHERE admin_id = user_id;
END;
$$;