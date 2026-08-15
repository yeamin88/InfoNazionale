export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo non consentito' });
  }

  const { prompt } = req.body || {};

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt mancante' });
  }

  const GROQ_API_KEY = process.env.GROQ_API_KEY || "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";

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'Sei Infonazionale, un assistente virtuale scolastico preciso, chiaro e autorevole. Rispondi alle domande degli studenti con spiegazioni semplici ma dettagliate, strutturate con elenchi puntati o sezioni chiare.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.5,
        max_tokens: 1500
      })
    });

    if (!response.ok) {
      const errData = await response.json();
      return res.status(response.status).json({ error: 'Errore API Groq', details: errData });
    }

    const data = await response.json();
    const reply = data.choices && data.choices[0] ? data.choices[0].message.content : 'Nessuna risposta generata.';

    return res.status(200).json({ result: reply });
  } catch (error) {
    return res.status(500).json({ error: 'Errore interno del server proxy', message: error.message });
  }
}
