import React, { createContext, useContext } from 'react';
import { AuthProvider, useAuth, AuthContextProps } from 'react-oidc-context';

const oidcConfig = {
  authority: "http://localhost:8080/realms/apartment-management",
  client_id: "web-client",
  redirect_uri: "http://localhost:3000/auth/callback",
  response_type: "code",
  scope: "openid profile email",
  post_logout_redirect_uri: "http://localhost:3000/login",
};

const CustomAuthContext = createContext<AuthContextProps | null>(null);

export const CustomAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthProvider {...oidcConfig}>
      {children}
    </AuthProvider>
  );
};

export const useAppAuth = () => {
  const context = useAuth();
  if (!context) {
    throw new Error("useAppAuth must be used within a CustomAuthProvider");
  }
  return context;
};
