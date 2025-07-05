function iniciarLoginGoogle() {
  // Reemplaza con TU ID DE CLIENTE de Google Cloud
  const clientId = '25506034810-7flkcr1s7rlrsl34o5t8u8mbus8m3k67.apps.googleusercontent.com';
  
  // URL exacta que configuraste en Google Cloud
  const redirectUri = 'https://lusho170803.github.io/auth/google/callback';
  
  // Solo solicitar email (permiso mínimo)
  const scope = 'email';
  
  // Construir URL de autenticación
  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.append('client_id', clientId);
  authUrl.searchParams.append('redirect_uri', redirectUri);
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('scope', scope);
  authUrl.searchParams.append('access_type', 'offline');
  
  // Redirigir a Google
  window.location.href = authUrl.toString();
}
