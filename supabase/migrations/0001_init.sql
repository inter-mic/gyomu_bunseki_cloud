-- 業務分析クラウド 初期スキーマ
-- Supabase の SQL Editor で実行してください

create extension if not exists "pgcrypto";

-- ============================================================
-- organizations: 顧客企業
-- ============================================================
create table if not exists organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  employee_count int,
  office_count int,
  industry text,
  created_at timestamptz default now()
);

-- ============================================================
-- projects: 案件 (1顧客につき複数案件もありうる)
-- ============================================================
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id) on delete cascade,
  customer_token text unique not null default encode(gen_random_bytes(18), 'hex'),
  status text not null default 'draft',
  -- draft, in_progress, hearing, analyzing, reviewing, completed
  theme text,
  contact_name text,
  contact_email text,
  contact_phone text,
  notes text,
  internal_memo text,
  ai_status text default 'not_run',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_projects_org on projects(organization_id);
create index if not exists idx_projects_status on projects(status);

-- ============================================================
-- offices: 拠点
-- ============================================================
create table if not exists offices (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  name text not null,
  address text,
  employee_count int,
  created_at timestamptz default now()
);

-- ============================================================
-- departments: 部署
-- ============================================================
create table if not exists departments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  name text not null,
  parent_id uuid references departments(id) on delete set null,
  headcount int,
  description text,
  created_at timestamptz default now()
);

-- ============================================================
-- business_processes: 業務
-- ============================================================
create table if not exists business_processes (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  name text not null,
  category text,
  -- 例: 受発注 / 経理 / 人事 / 製造 / 営業 / 物流 / 情報システム / その他
  summary text,
  department_id uuid references departments(id) on delete set null,
  department_name_cache text,
  headcount int,
  frequency text,
  -- 例: daily, weekly, monthly, quarterly, yearly, irregular
  hours_per_run numeric,
  tools text,
  pains text,
  is_attribute_dependent boolean default false,
  has_mistakes boolean default false,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_processes_project on business_processes(project_id);

-- ============================================================
-- hearing_notes: ヒアリングメモ / AI生成質問
-- ============================================================
create table if not exists hearing_notes (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  question text not null,
  answer text,
  source text default 'manual', -- manual | ai
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- analysis_results: AI分析結果 (種別ごと1レコード、上書き編集可)
-- ============================================================
create table if not exists analysis_results (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  kind text not null, -- structuring | issues | improvements
  content_md text,
  generated_by text default 'ai',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(project_id, kind)
);

-- ============================================================
-- rfp_drafts: RFP叩き台
-- ============================================================
create table if not exists rfp_drafts (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  content_md text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(project_id)
);

-- ============================================================
-- updated_at 自動更新
-- ============================================================
create or replace function set_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end; $$ language plpgsql;

drop trigger if exists trg_projects_updated on projects;
create trigger trg_projects_updated before update on projects
  for each row execute function set_updated_at();

drop trigger if exists trg_processes_updated on business_processes;
create trigger trg_processes_updated before update on business_processes
  for each row execute function set_updated_at();

drop trigger if exists trg_analysis_updated on analysis_results;
create trigger trg_analysis_updated before update on analysis_results
  for each row execute function set_updated_at();

drop trigger if exists trg_rfp_updated on rfp_drafts;
create trigger trg_rfp_updated before update on rfp_drafts
  for each row execute function set_updated_at();
