import { useEffect, useState } from 'react';
import { OWNER_USER_ID, supabase } from '../services/supabase';

export default function AuthGate({ children }) {
  const [session, setSession] = useState(null);
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (event) => {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (authError) throw authError;
      setPassword('');
    } catch (failure) {
      setError(failure.message || 'Could not sign in. Please try again.');
    } finally { setBusy(false); }
  };

  const signOut = async () => {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      const { error: authError } = await supabase.auth.signOut({ scope: 'local' });
      if (authError) throw authError;
      setPassword('');
    } catch (failure) {
      setError(failure.message || 'Could not sign out. Please try again.');
    } finally { setBusy(false); }
  };

  if (!ready) return <main className="login-screen"><p role="status">Checking your session…</p></main>;

  if (session?.user.id === OWNER_USER_ID) {
    return <>
      <div className="account-bar">
        <span>{session.user.email}</span>
        <button className="button secondary" disabled={busy} onClick={signOut}>Sign out</button>
        {error && <span role="alert">{error}</span>}
      </div>
      {children}
    </>;
  }

  if (session) {
    return <main className="login-screen"><section className="card login-card">
      <h1>Account not authorised</h1>
      <p>This workspace is restricted to Sílvia’s account.</p>
      {error && <p role="alert">{error}</p>}
      <button className="button" disabled={busy} onClick={signOut}>Sign out</button>
    </section></main>;
  }

  return <main className="login-screen"><section className="card login-card">
    <p className="eyebrow">Sílvia’s research workspace</p>
    <h1>Sign in</h1>
    <p className="muted">Use the email and password you created in Supabase.</p>
    <form onSubmit={signIn}>
      <fieldset disabled={busy}>
        <label htmlFor="login-email">Email</label>
        <input id="login-email" type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} />
        <label htmlFor="login-password">Password</label>
        <input id="login-password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} />
        {error && <p className="connection-error" role="alert">{error}</p>}
        <button className="button" type="submit">{busy ? 'Signing in…' : 'Sign in'}</button>
      </fieldset>
    </form>
  </section></main>;
}
