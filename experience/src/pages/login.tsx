import React from 'react';
import Head from 'next/head';
import { useAppAuth } from '../context/AuthContext';

export default function Login() {
  const auth = useAppAuth();

  const handleLogin = () => {
    auth.signinRedirect();
  };

  return (
    <>
      <Head>
        <title>Sign In - Apartment Management Portal</title>
        <meta name="description" content="Secure single sign-on login page for the Property Management SaaS portal." />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap" rel="stylesheet" />
      </Head>

      <div style={styles.container}>
        {/* Ambient background glow */}
        <div style={styles.glowTop}></div>
        <div style={styles.glowBottom}></div>

        <div style={styles.card}>
          <div style={styles.header}>
            <div style={styles.logoBadge}>A</div>
            <h1 style={styles.title}>Apartment Management</h1>
            <p style={styles.subtitle}>SaaS Resident & Staff Portal</p>
          </div>

          <div style={styles.divider}></div>

          <div style={styles.body}>
            <p style={styles.description}>
              Access your rent invoices, submit maintenance tickets, and coordinate leases through our secure SSO identity provider.
            </p>

            <button 
              onClick={handleLogin}
              style={styles.loginButton}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(99, 102, 241, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(99, 102, 241, 0.2)';
              }}
            >
              Sign In with Keycloak SSO
            </button>
          </div>

          <div style={styles.footer}>
            <span style={styles.securedText}>🔒 Secured OIDC/JWT Connection</span>
          </div>
        </div>
      </div>
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    fontFamily: "'Outfit', sans-serif",
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: '#0b0c10',
    color: '#e5e7eb',
    position: 'relative',
    overflow: 'hidden',
  },
  glowTop: {
    position: 'absolute',
    top: '-20%',
    left: '20%',
    width: '600px',
    height: '600px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(0,0,0,0) 70%)',
    pointerEvents: 'none',
  },
  glowBottom: {
    position: 'absolute',
    bottom: '-25%',
    right: '15%',
    width: '600px',
    height: '600px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, rgba(0,0,0,0) 70%)',
    pointerEvents: 'none',
  },
  card: {
    background: 'rgba(23, 25, 35, 0.65)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '24px',
    padding: '40px',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
    textAlign: 'center',
    zIndex: 10,
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '28px',
  },
  logoBadge: {
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    width: '60px',
    height: '60px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '28px',
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: '16px',
    boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    letterSpacing: '-0.5px',
    margin: '0 0 6px 0',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: '14px',
    fontWeight: '400',
    color: '#9ca3af',
    margin: '0',
  },
  divider: {
    height: '1px',
    background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0) 100%)',
    margin: '24px 0',
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  description: {
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#9ca3af',
    margin: '0',
  },
  loginButton: {
    fontFamily: "'Outfit', sans-serif",
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '14px',
    padding: '16px 24px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 4px 20px rgba(99, 102, 241, 0.2)',
  },
  footer: {
    marginTop: '32px',
  },
  securedText: {
    fontSize: '12px',
    fontWeight: '500',
    color: '#4b5563',
    letterSpacing: '0.5px',
  },
};
