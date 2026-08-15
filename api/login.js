export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Metodo non consentito' });
  }

  const { username, password } = req.body || {};

  const ADMIN_USER = process.env.ADMIN_USER || "admininfonazionale";
  const ADMIN_PASS = process.env.ADMIN_PASSWORD || "5643";

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    return res.status(200).json({
      success: true,
      token: "infonazionale_auth_" + Date.now(),
      message: "Autenticazione riuscita"
    });
  } else {
    return res.status(401).json({
      success: false,
      message: "Username o Password errati"
    });
  }
}
