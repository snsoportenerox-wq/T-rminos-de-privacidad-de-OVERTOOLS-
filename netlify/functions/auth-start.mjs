import crypto from "node:crypto";

export default async () => {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const siteUrl = process.env.URL || process.env.SITE_URL;
  const redirectUri = `${siteUrl}/.netlify/functions/auth-callback`;
  if (!clientId || !siteUrl?.startsWith("https://")) {
    return new Response("Falta configurar DISCORD_CLIENT_ID o la URL del sitio.", { status: 500 });
  }
  const state = crypto.randomBytes(24).toString("hex");
  const params = new URLSearchParams({
    client_id: clientId, response_type: "code", redirect_uri: redirectUri,
    scope: "identify guilds.join", state
  });
  return new Response(null, { status: 302, headers: {
    Location: `https://discord.com/oauth2/authorize?${params}`,
    "Set-Cookie": `ot_oauth_state=${state}; HttpOnly; Secure; SameSite=Lax; Path=/.netlify/functions; Max-Age=600`
  }});
};
