import React, { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAppAuth } from '../../context/AuthContext';

export default function AuthCallback() {
  const auth = useAppAuth();
  const router = useRouter();

  useEffect(() => {
    if (auth.isAuthenticated) {
      router.push('/dashboard');
    } else if (auth.error) {
      console.error("Keycloak authentication error:", auth.error);
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    }
  }, [auth.isAuthenticated, auth.error, router]);

  return (
    <>
      <Head>
        <title>Completing Sign In...</title>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600&display=swap" rel="stylesheet" />
      </Head>

      <div style={styles.container}>
        <div style={styles.glow}></div>

        <div style={styles.card}>
          {auth.error ? (
            <>
              <div style={styles.errorIcon}>⚠️</div>
              <h2 style={styles.errorTitle}>Authentication Failed</h2>
              <p style={styles.errorMessage}>{auth.error.message || "An unexpected error occurred during SSO login."}</p>
              <p style={styles.redirectText}>Redirecting you back to login page...</p>
            </>
          ) : (
            <>
              <div style={styles.spinnerContainer}>
                <div style={styles.spinner}></div>
                <div style={styles.innerGlow}></div>
              </div>
              <h2 style={styles.loadingTitle}>Completing Authentication</h2>
              <p style={styles.loadingMessage}>Exchanging secure SSO tokens with Keycloak. Please do not close this window...</p>
            </>
          )}
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
  glow: {
    position: 'absolute',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(0,0,0,0) 70%)',
    pointerEvents: 'none',
  },
  card: {
    background: 'rgba(23, 25, 35, 0.65)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '24px',
    padding: '40px',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
    textAlign: 'center',
    zIndex: 10,
  },
  spinnerContainer: {
    position: 'relative',
    width: '60px',
    height: '60px',
    margin: '0 auto 24px auto',
  },
  spinner: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    border: '4px solid rgba(99, 102, 241, 0.1)',
    borderTopColor: '#6366f1',
    animation: 'spin 1s linear infinite',
  },
  innerGlow: {
    position: 'absolute',
    top: '10px',
    left: '10px',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, rgba(0,0,0,0) 75%)',
  },
  loadingTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#ffffff',
    margin: '0 0 8px 0',
  },
  loadingMessage: {
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#9ca3af',
    margin: '0',
  },
  errorIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  errorTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#ef4444',
    margin: '0 0 8px 0',
  },
  errorMessage: {
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#f87171',
    margin: '0 0 16px 0',
  },
  redirectText: {
    fontSize: '12px',
    color: '#6b7280',
    margin: '0',
  },
};

// Add standard css animation injection dynamically (fallback for pure inline css spinners)
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(styleSheet);
}
