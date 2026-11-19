let wishes = [];

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method === 'GET' || req.method === 'HEAD') {
    return res.status(200).json({ wishes });
  }

  if (req.method === 'POST') {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        body = {};
      }
    }
    const name = body?.name ? String(body.name).trim() : '';
    const message = body?.message ? String(body.message).trim() : '';

    if (!name || !message) {
      return res.status(400).json({ error: 'Name and message are required.' });
    }

    const wish = { name, message };
    wishes.unshift(wish);
    return res.status(200).json({ wish });
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
};
