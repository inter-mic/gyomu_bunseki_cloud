-- 動作確認用シードデータ
-- 既存データがある場合は注意

with org as (
  insert into organizations (name, employee_count, office_count, industry)
  values ('サンプル製造株式会社', 120, 3, '製造業')
  returning id
), proj as (
  insert into projects (organization_id, status, theme, contact_name, contact_email, contact_phone, notes, customer_token)
  select id, 'in_progress', '受発注業務とExcel管理を整理したい', '山田太郎', 'sample@example.com', '03-0000-0000', '紙とExcelが混在している', 'sample-token-demo'
  from org
  returning id, organization_id
), dept as (
  insert into departments (project_id, name, headcount, description)
  select id, '営業部', 12, '受発注・見積対応' from proj
  returning id, project_id
)
insert into business_processes (project_id, name, category, summary, department_id, headcount, frequency, hours_per_run, tools, pains, is_attribute_dependent, has_mistakes, notes, department_name_cache)
select dept.project_id, '受注処理', '受発注', '電話・FAXで受注を受けてExcelに転記', dept.id, 4, 'daily', 1.5,
  'Excel, FAX, 電話', '転記ミスが多い。属人化している。', true, true, 'ベテラン1名に依存', '営業部'
from dept;

insert into offices (project_id, name, address, employee_count)
select id, '本社', '東京都千代田区...', 80 from projects where customer_token = 'sample-token-demo';
