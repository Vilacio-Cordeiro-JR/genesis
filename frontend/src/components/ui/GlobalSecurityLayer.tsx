import { useEffect } from 'react';
import { setGlobalErrorCallback } from '../../services/api';
import { useSecurity } from '../../contexts/SecurityContext';
import CookieBanner from './CookieBanner';
import PrivacyModal from './PrivacyModal';
import ErrorModal from './ErrorModal';
import GlobalLoading from './GlobalLoading';

export default function GlobalSecurityLayer() {
  const { showError } = useSecurity();
  useEffect(() => {
    setGlobalErrorCallback(showError);
  }, [showError]);
  return (
    <>
      <GlobalLoading />
      <ErrorModal />
      <PrivacyModal />
      <CookieBanner />
    </>
  );
}
