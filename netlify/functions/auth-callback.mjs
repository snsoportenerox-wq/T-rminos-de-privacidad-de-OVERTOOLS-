export default async (request) => {
  const siteUrl = process.env.URL || process.env.SITE_URL;
  const fail = (reason = "error") => Response.redirect(`${siteUrl}/?error=${reason}`, 302);
  if (!siteUrl || !process.env.DISCORD_CLIENT_ID || !process.env.DISCORD_CLIENT_SECRET ||
      !process.env.DISCORD_BOT_TOKEN || !process.env.DISCORD_GUILD_ID) {
    return new Response("Faltan variables privadas de Discord en Netlify.", { status: 500 });
  }
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const returnedState = url.searchParams.get("state");
  const cookies = request.headers.get("cookie") || "";
  const savedState = cookies.match(/(?:^|;\s*)ot_oauth_state=([^;]+)/)?.[1];
  if (!code || !returnedState || !savedState || returnedState !== savedState) return fail("state");

  const redirectUri = `${siteUrl}/.netlify/functions/auth-callback`;
  const tokenResponse = await fetch("https://discord.com/api/v10/oauth2/token", {
    method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID,
      client_secret: process.env.DISCORD_CLIENT_SECRET,
      grant_type: "authorization_code", code, redirect_uri: redirectUri
    })
  });
  const tokenData = await tokenResponse.json();
  if (!tokenResponse.ok || !tokenData.access_token) return fail("token");

  const userResponse = await fetch("https://discord.com/api/v10/users/@me", {
    headers: { Authorization: `Bearer ${tokenData.access_token}` }
  });
  const user = await userResponse.json();
  if (!userResponse.ok || !user.id) return fail("user");

  const joinResponse = await fetch(
    `https://discord.com/api/v10/guilds/${process.env.DISCORD_GUILD_ID}/members/${user.id}`,
    { method: "PUT", headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        "Content-Type": "application/json"
      }, body: JSON.stringify({ access_token: tokenData.access_token }) }
  );
  if (!joinResponse.ok && joinResponse.status !== 204) {
    console.error("Discord guild join failed:", joinResponse.status, await joinResponse.text());
    return fail("join");
  }

  const avatarUrl = user.avatar
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=96`
    : `https://cdn.discordapp.com/embed/avatars/${Number((BigInt(user.id) >> 22n) % 6n)}.png`;
  const profile = Buffer.from(JSON.stringify({
    id: user.id, username: user.username, global_name: user.global_name, avatar_url: avatarUrl
  })).toString("base64url");

  const headers = new Headers({ Location: `${siteUrl}/?login=success` });
  headers.append("Set-Cookie", "ot_oauth_state=; HttpOnly; Secure; SameSite=Lax; Path=/.netlify/functions; Max-Age=0");
  headers.append("Set-Cookie", `ot_profile=${profile}; Secure; SameSite=Lax; Path=/; Max-Age=604800`);
  return new Response(null, { status: 302, headers });
};
