-- Schema PostgreSQL da Genesis API. Idempotente: pode ser executado várias vezes
-- (ex.: `npm run migrate`) sem duplicar tipos, tabelas ou índices já existentes.

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('ADMIN', 'SUPER_ADMIN');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE project_category AS ENUM ('Landing Page', 'Sistema Web', 'API / Integração', 'Consultoria');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE quote_status AS ENUM ('PENDING', 'CONTACTED', 'ARCHIVED');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'ADMIN',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(100) NOT NULL UNIQUE,
  title VARCHAR(160) NOT NULL,
  category project_category NOT NULL,
  description VARCHAR(2000) NOT NULL,
  thumbnail_url VARCHAR(500) NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  features TEXT[] NOT NULL DEFAULT '{}',
  demo_url VARCHAR(500),
  is_preset BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- `'portuguese'::regconfig` (em vez da sobrecarga por nome de texto) é obrigatório
  -- aqui: colunas geradas só aceitam funções IMMUTABLE, e só essa sobrecarga é.
  -- `tags` fica fora do vetor porque até a conversão array->texto (`array_to_string`/
  -- cast para texto) é marcada STABLE no catálogo, o que o Postgres não aceita aqui.
  search_vector TSVECTOR GENERATED ALWAYS AS (
    setweight(to_tsvector('portuguese'::regconfig, title), 'A') ||
    setweight(to_tsvector('portuguese'::regconfig, description), 'B')
  ) STORED
);

CREATE INDEX IF NOT EXISTS projects_active_category_idx ON projects (is_active, category, created_at DESC);
CREATE INDEX IF NOT EXISTS projects_active_preset_idx ON projects (is_active, is_preset);
CREATE INDEX IF NOT EXISTS projects_search_idx ON projects USING GIN (search_vector);

CREATE TABLE IF NOT EXISTS quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name VARCHAR(120) NOT NULL,
  client_email VARCHAR(160) NOT NULL,
  company_name VARCHAR(160),
  how_did_you_know VARCHAR(200) NOT NULL,
  solution_type VARCHAR(100) NOT NULL,
  project_description VARCHAR(3000) NOT NULL,
  selected_preset_id UUID REFERENCES projects (id) ON DELETE SET NULL,
  status quote_status NOT NULL DEFAULT 'PENDING',
  notes VARCHAR(2000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS quotes_status_created_idx ON quotes (status, created_at DESC);
