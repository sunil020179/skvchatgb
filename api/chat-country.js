// api/chat-country.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed');

  const { user, country } = req.body || {};
  if (!user) return res.status(400).send('`user` message is required');

  const CC = {
    AE: { system: "You are an assistant for SKV Business Services in the UAE. Focus on VAT(5%), Freezone/Mainland setup, corporate tax, visas/PRO." },
    IN: { system: "You are an assistant for SKV Business Services in India. Focus on GST, MCA incorporation, MSME/UDYAM, IEC, FSSAI, compliance." },
    HU: { system: "You are an assistant for SKV Business Services in Hungary. Focus on Kft. setup, EU VAT, corporate tax, permits/residency, banking." },
    GB: { system: "You are an assistant for SKV Business Services in the UK (London). Focus on LTD setup, Companies House, HMRC, VAT, PAYE." }
  };

  const cfg = CC[country] || CC.AE;

  try {
    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        input: [
          { role: "system", content: cfg.system },
          { role: "user", content: user }
        ]
      })
    });

    if (!r.ok) {
      const errText = await r.text();
      return res.status(500).send(errText || "OpenAI request failed");
    }

    const data = await r.json();

    // Flexible parsing (covers output_text or structured content)
    let text = "";
    if (data.output_text) {
      text = data.output_text;
    } else if (Array.isArray(data.output) && data.output[0]?.content?.[0]?.text) {
      text = data.output[0].content[0].text;
    } else {
      text = "Sorry, no response generated.";
    }

    return res.status(200).send(text);
  } catch (e) {
    console.error(e);
    return res.status(500).send("Server error");
  }
}
