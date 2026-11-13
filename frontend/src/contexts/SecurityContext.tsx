import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import Cookies from 'js-cookie';

interface SecurityContextType {
  isLoading: boolean;
  setLoading: (state: boolean) => void;
  errorMsg: string | null;
  showError: (msg: string) => void;
  clearError: () => void;
  cookieConsent: boolean | null;
  acceptCookies: () => void;
  rejectCookies: () => void;
  isPrivacyOpen: boolean;
  setPrivacyOpen: (state: boolean) => void;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

const CONSENT_COOKIE = 'genesis_cookie_consent';

const saveConsent = (value: boolean): void => {
  Cookies.set(CONSENT_COOKIE, String(value), { expires: 365, secure: window.location.protocol === 'https:', sameSite: 'strict' });
};

export function SecurityProvider({ children }: { children: ReactNode }) {
  const [isLoading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [cookieConsent, setCookieConsent] = useState<boolean | null>(null);
  const [isPrivacyOpen, setPrivacyOpen] = useState(false);

  useEffect(() => {
    const consent = Cookies.get(CONSENT_COOKIE);
    if (consent) setCookieConsent(consent === 'true');
  }, []);

  const acceptCookies = useCallback(() => {
    saveConsent(true);
    setCookieConsent(true);
  }, []);

  const rejectCookies = useCallback(() => {
    saveConsent(false);
    setCookieConsent(false);
  }, []);

  const showError = useCallback((msg: string) => setErrorMsg(msg), []);
  const clearError = useCallback(() => setErrorMsg(null), []);

  const value = useMemo<SecurityContextType>(
    () => ({ isLoading, setLoading, errorMsg, showError, clearError, cookieConsent, acceptCookies, rejectCookies, isPrivacyOpen, setPrivacyOpen }),
    [isLoading, errorMsg, showError, clearError, cookieConsent, acceptCookies, rejectCookies, isPrivacyOpen],
  );

  return <SecurityContext.Provider value={value}>{children}</SecurityContext.Provider>;
}

export const useSecurity = (): SecurityContextType => {
  const context = useContext(SecurityContext);
  if (!context) throw new Error('useSecurity must be used within a SecurityProvider');
  return context;
};
