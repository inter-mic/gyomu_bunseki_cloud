'use server';

import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { sendSignupEmails } from '@/lib/email';

export async function signupAction(formData: FormData) {
  const supabase = db();
  const company = String(formData.get('company') || '').trim();
  if (!company) throw new Error('会社名は必須です');

  const { data: org, error: e1 } = await supabase
    .from('organizations')
    .insert({
      name: company,
      industry: String(formData.get('industry') || '') || null,
      employee_count: Number(formData.get('employee_count')) || null,
      office_count: Number(formData.get('office_count')) || null,
    })
    .select()
    .single();
  if (e1) throw e1;

  const { data: project, error: e2 } = await supabase
    .from('projects')
    .insert({
      organization_id: org.id,
      status: 'in_progress',
      theme: String(formData.get('theme') || ''),
      contact_name: String(formData.get('contact_name') || ''),
      contact_email: String(formData.get('contact_email') || ''),
      contact_phone: String(formData.get('phone') || ''),
      notes: String(formData.get('notes') || ''),
    })
    .select()
    .single();
  if (e2) throw e2;

  await sendSignupEmails({
    company,
    contactName: String(formData.get('contact_name') || ''),
    contactEmail: String(formData.get('contact_email') || ''),
    theme: String(formData.get('theme') || ''),
    token: project.customer_token,
  });

  redirect(`/c/${project.customer_token}?welcome=1`);
}
