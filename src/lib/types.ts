export type ProjectStatus =
  | 'draft'
  | 'in_progress'
  | 'hearing'
  | 'analyzing'
  | 'reviewing'
  | 'completed';

export const PROJECT_STATUS_LABEL: Record<ProjectStatus, string> = {
  draft: '下書き',
  in_progress: '入力中',
  hearing: 'ヒアリング中',
  analyzing: 'AI分析中',
  reviewing: 'レビュー中',
  completed: '完了',
};

export const BUSINESS_CATEGORIES = [
  '受発注',
  '営業',
  '見積',
  '購買',
  '在庫管理',
  '製造',
  '物流',
  '経理',
  '人事',
  '総務',
  '情報システム',
  'カスタマーサポート',
  'その他',
] as const;

export const FREQUENCIES = [
  { value: 'daily', label: '毎日' },
  { value: 'weekly', label: '週次' },
  { value: 'monthly', label: '月次' },
  { value: 'quarterly', label: '四半期' },
  { value: 'yearly', label: '年次' },
  { value: 'irregular', label: '不定期' },
] as const;

export type Project = {
  id: string;
  organization_id: string;
  customer_token: string;
  status: ProjectStatus;
  theme: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  notes: string | null;
  internal_memo: string | null;
  ai_status: string | null;
  created_at: string;
  updated_at: string;
};

export type Organization = {
  id: string;
  name: string;
  employee_count: number | null;
  office_count: number | null;
  industry: string | null;
};

export type Department = {
  id: string;
  project_id: string;
  name: string;
  parent_id: string | null;
  headcount: number | null;
  description: string | null;
};

export type Office = {
  id: string;
  project_id: string;
  name: string;
  address: string | null;
  employee_count: number | null;
};

export type BusinessProcess = {
  id: string;
  project_id: string;
  name: string;
  category: string | null;
  summary: string | null;
  department_id: string | null;
  department_name_cache: string | null;
  headcount: number | null;
  frequency: string | null;
  hours_per_run: number | null;
  tools: string | null;
  pains: string | null;
  is_attribute_dependent: boolean;
  has_mistakes: boolean;
  notes: string | null;
};

export type HearingNote = {
  id: string;
  project_id: string;
  question: string;
  answer: string | null;
  source: 'manual' | 'ai';
  created_at: string;
};

export type AnalysisResult = {
  id: string;
  project_id: string;
  kind: 'structuring' | 'issues' | 'improvements';
  content_md: string | null;
  updated_at: string;
};

export type RfpDraft = {
  id: string;
  project_id: string;
  content_md: string | null;
  updated_at: string;
};
