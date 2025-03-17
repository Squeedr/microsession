/*
  # Initial Schema Setup

  1. Tables
    - users
      - id (uuid, primary key)
      - email (text, unique)
      - created_at (timestamp)
    
    - workspaces
      - id (uuid, primary key)
      - name (text)
      - type (text)
      - owner_id (uuid, references users)
      - created_at (timestamp)
    
    - workspace_members
      - workspace_id (uuid, references workspaces)
      - user_id (uuid, references users)
      - role (text)
      - created_at (timestamp)
    
    - resources
      - id (uuid, primary key)
      - name (text)
      - description (text)
      - price (numeric)
      - unit (text)
      - available (integer)
      - total (integer)
      - image (text)
      - status (text)
      - workspace_id (uuid, references workspaces)
      - created_at (timestamp)
    
    - spaces, experts, sessions (unchanged)

  2. Security
    - Enable RLS on all tables
    - Add policies for workspace owners and members
*/

-- Create tables
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE workspaces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('personal', 'team', 'company')),
  owner_id uuid REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE workspace_members (
  workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('member', 'admin')),
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (workspace_id, user_id)
);

CREATE TABLE resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric NOT NULL CHECK (price >= 0),
  unit text NOT NULL,
  available integer NOT NULL DEFAULT 0,
  total integer NOT NULL DEFAULT 0,
  image text,
  status text NOT NULL CHECK (status IN ('active', 'inactive')),
  workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  CHECK (available <= total)
);

CREATE TABLE spaces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  location text,
  price numeric NOT NULL CHECK (price >= 0),
  capacity integer NOT NULL CHECK (capacity > 0),
  amenities text[],
  images text[],
  status text NOT NULL CHECK (status IN ('published', 'unpublished')),
  workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE experts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  title text NOT NULL,
  rating numeric CHECK (rating >= 0 AND rating <= 5),
  reviews integer DEFAULT 0,
  hourly_rate numeric NOT NULL CHECK (hourly_rate >= 0),
  specializations text[],
  languages text[],
  status text NOT NULL CHECK (status IN ('online', 'offline')),
  workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  time timestamptz NOT NULL,
  type text NOT NULL,
  host text NOT NULL,
  status text NOT NULL CHECK (status IN ('confirmed', 'pending', 'cancelled')),
  workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE experts ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can read workspaces they own or are members of"
  ON workspaces
  FOR SELECT
  TO authenticated
  USING (
    owner_id = auth.uid() OR
    id IN (
      SELECT workspace_id
      FROM workspace_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Workspace owner can manage workspace"
  ON workspaces
  FOR ALL
  TO authenticated
  USING (owner_id = auth.uid());

CREATE POLICY "Workspace members can read their membership"
  ON workspace_members
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Workspace owner can manage members"
  ON workspace_members
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM workspaces
      WHERE id = workspace_id
      AND owner_id = auth.uid()
    )
  );

CREATE POLICY "Workspace members can read resources"
  ON resources
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM workspaces
      WHERE id = workspace_id
      AND (
        owner_id = auth.uid() OR
        EXISTS (
          SELECT 1
          FROM workspace_members
          WHERE workspace_id = workspaces.id
          AND user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Workspace owner can manage resources"
  ON resources
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM workspaces
      WHERE id = workspace_id
      AND owner_id = auth.uid()
    )
  );

CREATE POLICY "Workspace members can read spaces"
  ON spaces
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM workspaces
      WHERE id = workspace_id
      AND (
        owner_id = auth.uid() OR
        EXISTS (
          SELECT 1
          FROM workspace_members
          WHERE workspace_id = workspaces.id
          AND user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Workspace owner can manage spaces"
  ON spaces
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM workspaces
      WHERE id = workspace_id
      AND owner_id = auth.uid()
    )
  );

CREATE POLICY "Workspace members can read experts"
  ON experts
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM workspaces
      WHERE id = workspace_id
      AND (
        owner_id = auth.uid() OR
        EXISTS (
          SELECT 1
          FROM workspace_members
          WHERE workspace_id = workspaces.id
          AND user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Workspace owner can manage experts"
  ON experts
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM workspaces
      WHERE id = workspace_id
      AND owner_id = auth.uid()
    )
  );

CREATE POLICY "Workspace members can read sessions"
  ON sessions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM workspaces
      WHERE id = workspace_id
      AND (
        owner_id = auth.uid() OR
        EXISTS (
          SELECT 1
          FROM workspace_members
          WHERE workspace_id = workspaces.id
          AND user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Workspace owner can manage sessions"
  ON sessions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM workspaces
      WHERE id = workspace_id
      AND owner_id = auth.uid()
    )
  );

-- Create indexes for better query performance
CREATE INDEX idx_workspace_members_workspace_id ON workspace_members(workspace_id);
CREATE INDEX idx_workspace_members_user_id ON workspace_members(user_id);
CREATE INDEX idx_resources_workspace_id ON resources(workspace_id);
CREATE INDEX idx_spaces_workspace_id ON spaces(workspace_id);
CREATE INDEX idx_experts_workspace_id ON experts(workspace_id);
CREATE INDEX idx_sessions_workspace_id ON sessions(workspace_id);