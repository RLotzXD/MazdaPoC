export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userInput } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error('GEMINI_API_KEY not set in environment variables');
    return res.status(500).json({ error: 'API key not configured' });
  }

  if (!userInput) {
    return res.status(400).json({ error: 'userInput required' });
  }

  const systemPrompt = `You are a Mazda vehicle recommendation assistant. Based on what the customer wants, recommend the BEST 1-2 Mazda models.

Available vehicles: Mazda3 Hatchback, Mazda3 Sedan, MX-5 Miata, CX-30, CX-5, CX-50 Hybrid, CX-70, CX-90 PHEV

IMPORTANT FORMAT - End every response with:
VEHICLES: [exact vehicle name], [exact vehicle name]

Example: "Perfect! The CX-5 is spacious and practical. VEHICLES: CX-5"

Be brief and friendly (1-2 sentences before VEHICLES line).`;

  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + apiKey, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${systemPrompt}\n\nCustomer: "${userInput}"`
          }]
        }]
      })
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      const errorMsg = data.error?.message || `API error: ${response.status}`;
      console.error('Gemini API Error:', errorMsg);
      return res.status(response.status).json({ error: errorMsg });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    if (!text) {
      return res.status(500).json({ error: 'No response from API' });
    }

    return res.status(200).json({ text });
  } catch (error) {
    console.error('Gemini API error:', error.message);
    return res.status(500).json({ error: error.message });
  }
}
