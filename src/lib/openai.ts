import OpenAI from 'openai';

let _client: OpenAI | null = null;

export function openai(): OpenAI {
  if (_client) return _client;
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error('OPENAI_API_KEY 未設定');
  _client = new OpenAI({ apiKey: key });
  return _client;
}

export const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

/**
 * 一括ヘルパー: システムプロンプト + ユーザープロンプトで Markdown を生成する
 */
export async function generateMarkdown(system: string, user: string): Promise<string> {
  const res = await openai().chat.completions.create({
    model: MODEL,
    temperature: 0.4,
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
  });
  return res.choices[0]?.message?.content?.trim() || '';
}
