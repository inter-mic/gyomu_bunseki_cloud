import { db } from './db';

/**
 * AI へ渡す前提情報を 1 まとめにする。
 * できるだけ JSON 構造で渡し、AI が業務構造を読み取りやすくする。
 */
export async function buildProjectContext(projectId: string) {
  const supabase = db();
  const [{ data: project }, { data: org }, { data: offices }, { data: departments }, { data: processes }, { data: hearings }] =
    await Promise.all([
      supabase.from('projects').select('*').eq('id', projectId).single(),
      supabase.from('projects').select('organization_id').eq('id', projectId).single().then(async (r) => {
        if (!r.data) return { data: null };
        return supabase.from('organizations').select('*').eq('id', r.data.organization_id).single();
      }),
      supabase.from('offices').select('*').eq('project_id', projectId),
      supabase.from('departments').select('*').eq('project_id', projectId),
      supabase.from('business_processes').select('*').eq('project_id', projectId),
      supabase.from('hearing_notes').select('*').eq('project_id', projectId),
    ]);

  return { project, organization: org, offices, departments, processes, hearings };
}

export function contextToPromptJson(ctx: Awaited<ReturnType<typeof buildProjectContext>>) {
  return JSON.stringify(
    {
      organization: ctx.organization,
      project: {
        theme: ctx.project?.theme,
        notes: ctx.project?.notes,
        contact: {
          name: ctx.project?.contact_name,
          email: ctx.project?.contact_email,
        },
      },
      offices: ctx.offices,
      departments: ctx.departments,
      processes: ctx.processes,
      hearings: ctx.hearings,
    },
    null,
    2
  );
}
