let turnstileToken = "";
let turnstileWidget = null;
function escapeHtml(s){return String(s||"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
async function setupTurnstile(){
 const container=document.getElementById("turnstile"); if(!container)return;
 const cfg=await fetch("/.netlify/functions/public-config").then(r=>r.json()).catch(()=>({}));
 if(!cfg.siteKey){container.textContent="Turnstile aún no está configurado.";return;}
 const load=()=>{if(!window.turnstile)return;turnstileWidget=window.turnstile.render(container,{sitekey:cfg.siteKey,callback:t=>{turnstileToken=t;document.getElementById("discord-login").disabled=false;}, "expired-callback":()=>{turnstileToken="";document.getElementById("discord-login").disabled=true;}, "error-callback":()=>{turnstileToken="";document.getElementById("discord-login").disabled=true;}});};
 if(window.turnstile){load();return;}
 const script=document.createElement("script");script.src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";script.async=true;script.defer=true;script.onload=load;document.head.appendChild(script);
}
async function loadAccount(){const el=document.getElementById("account");if(!el)return;try{const r=await fetch("/.netlify/functions/me");if(!r.ok)return;const u=await r.json();el.innerHTML=`<span class="muted">${escapeHtml(u.username)}</span> <button class="button secondary" id="logout">Salir</button>`;document.getElementById("logout").onclick=async()=>{await fetch("/.netlify/functions/logout",{method:"POST"});location.reload()}}catch(e){}}
document.addEventListener("DOMContentLoaded",async()=>{
 await setupTurnstile(); await loadAccount();
 const b=document.getElementById("discord-login");
 if(b)b.onclick=async()=>{if(!turnstileToken)return;const m=document.getElementById("login-message");m.textContent="Verificando…";try{const r=await fetch("/.netlify/functions/auth-start",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({turnstileToken})});const d=await r.json();if(d.url)location.href=d.url;else m.textContent=d.error||"No se pudo iniciar sesión.";}catch(e){m.textContent="Error de conexión. Inténtalo de nuevo."}};
 const list=document.getElementById("commands-list");
 if(list){try{const r=await fetch("/.netlify/functions/commands");const d=await r.json();list.innerHTML=d.commands?.length?d.commands.map(c=>`<article class="command"><strong>/${escapeHtml(c.name)}</strong><p>${escapeHtml(c.description||"Comando de OVERTOOLS")}</p></article>`).join(""):'<div class="panel">No hay comandos públicos disponibles en este momento.</div>';}catch(e){list.innerHTML='<div class="panel">No se pudieron cargar los comandos.</div>'}}
});
