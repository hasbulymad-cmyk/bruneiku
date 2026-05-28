import type { BruneiForm } from '../constants/forms';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const SYSTEM_PROMPT = `You are BruneiForms Helper — a friendly, knowledgeable assistant that helps Bruneians understand and complete government forms and processes.

Your knowledge covers:
- All Brunei government departments: JPIN (Immigration & National Registration), JPD (Land Transport), JPAS (Labour), ROCBN (Business Registry), Ministry of Health, Ministry of Finance
- Common forms: IC applications, passport renewal, visit passes, driving licences, vehicle registration, birth/marriage certificates, business registration, employment permits
- Brunei-specific context: BND currency, the four districts (Brunei-Muara, Tutong, Belait, Temburong), prayer times affecting office hours, local culture

Respond in the same language the user writes in (English or Malay/Bahasa Melayu). If mixed, use English but include Malay terms where relevant.

Keep answers concise, practical, and reassuring. Use numbered steps for processes. If you're unsure about specific fees or recent changes, say so and recommend the user call the department to confirm.

Never give legal advice — for legal matters, recommend a qualified lawyer or the Brunei Law Society.`;

function buildFormContext(form: BruneiForm): string {
  return `
The user is asking about: ${form.name} (${form.nameMalay})
Department: ${form.department}
Fee: ${form.fee}
Processing time: ${form.processingTime}
Office hours: ${form.officeHours}
Location: ${form.location}
Required documents: ${form.documents.join(', ')}
Tips: ${form.tips.join('; ')}
`.trim();
}

export async function askClaude(
  messages: ChatMessage[],
  apiKey: string,
  form?: BruneiForm
): Promise<string> {
  const systemWithContext = form
    ? `${SYSTEM_PROMPT}\n\nCurrent form context:\n${buildFormContext(form)}`
    : SYSTEM_PROMPT;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: systemWithContext,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    const msg = (error as { error?: { message?: string } }).error?.message ?? response.statusText;
    throw new Error(`Claude API error: ${msg}`);
  }

  const data = (await response.json()) as {
    content: { type: string; text: string }[];
  };

  const textBlock = data.content.find((c) => c.type === 'text');
  if (!textBlock) throw new Error('No text response from Claude');
  return textBlock.text;
}
