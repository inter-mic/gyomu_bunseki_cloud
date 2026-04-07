import { notFound } from 'next/navigation';
import { db } from './db';

export async function loadProjectByToken(token: string) {
  const supabase = db();
  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('customer_token', token)
    .maybeSingle();
  if (!project) notFound();
  const { data: org } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', project.organization_id)
    .single();
  return { project, organization: org };
}
