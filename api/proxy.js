export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Metodo non consentito' });
    }

    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: 'Richiesta non valida' });
    }

    const apiKey = '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';
    const url = 'https://api.groq.com/openai/v1/chat/completions';

    const data = {
        model: 'llama-3.3-70b-versatile',
        messages: messages,
        max_tokens: 3000,
        temperature: 0.2
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(data)
        });

        const responseData = await response.json();
        return res.status(response.status).json(responseData);
    } catch (error) {
        return res.status(500).json({ error: 'Errore interno del server' });
    }
}
