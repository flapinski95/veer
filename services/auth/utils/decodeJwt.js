exports.parseJwt = function(token) {
  if (!token) return null;
  
  try {
    const base64Payload = token.split('.')[1];
    const payload = Buffer.from(base64Payload, 'base64').toString('utf-8');
    return JSON.parse(payload);
  } catch (err) {
    console.error('[parseJwt] Failed to parse token:', err);
    return null;
  }
};

