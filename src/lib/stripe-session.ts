import { StripeSessionData } from '../types/stripe';

/**
 * Fetch session data using the new get-session-data function
 */
export const fetchSessionData = async (sessionId: string) => {
  console.log('🔍 [SESSION DATA] Fetching session data for:', sessionId);
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(`/.netlify/functions/get-session-data?session_id=${sessionId}`, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        success: false,
        message: `HTTP ${response.status}`
      }));
      
      console.error('❌ [SESSION DATA] Fetch failed:', errorData);
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }
    
    const sessionData = await response.json();
    console.log('✅ [SESSION DATA] Session data retrieved:', sessionData);
    
    if (!sessionData.success) {
      throw new Error(sessionData.message || 'Failed to retrieve session data');
    }
    
    return sessionData;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.error('🕐 [SESSION DATA] Request timeout');
      throw new Error('Request timeout - please check your internet connection and try again');
    }
    
    if (error.message?.includes('Failed to fetch')) {
      console.error('🌐 [SESSION DATA] Network error');
      throw new Error('Network error - please check your internet connection and try again');
    }
    
    console.error('💥 [SESSION DATA] Error fetching session:', error);
    throw error;
  }
};

/**
 * Fetch Stripe session data from our Netlify function
 */
export const fetchStripeSession = async (sessionId: string): Promise<StripeSessionData> => {
  console.log('🔍 [STRIPE SESSION] Fetching session data for:', sessionId);
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(`/.netlify/functions/fetch-session?session_id=${sessionId}`, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        error: `HTTP ${response.status}`,
        message: 'Failed to fetch session data'
      }));
      
      console.error('❌ [STRIPE SESSION] Fetch failed:', errorData);
      throw new Error(errorData.error || errorData.message || `HTTP ${response.status}`);
    }
    
    const sessionData = await response.json();
    console.log('✅ [STRIPE SESSION] Session data retrieved:', sessionData);
    
    // Validate required fields
    if (!sessionData.customer_email) {
      throw new Error('No customer email found in session data');
    }
    
    if (sessionData.payment_status !== 'paid') {
      throw new Error(`Payment not completed. Status: ${sessionData.payment_status}`);
    }
    
    return sessionData;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.error('🕐 [STRIPE SESSION] Request timeout');
      throw new Error('Request timeout - please check your internet connection and try again');
    }
    
    if (error.message?.includes('Failed to fetch')) {
      console.error('🌐 [STRIPE SESSION] Network error');
      throw new Error('Network error - please check your internet connection and try again');
    }
    
    console.error('💥 [STRIPE SESSION] Error fetching session:', error);
    throw error;
  }
};

/**
 * Validate session ID format
 */
export const isValidSessionId = (sessionId: string | null): boolean => {
  if (!sessionId) return false;
  
  // Stripe session IDs typically start with 'cs_' and have a specific format
  return sessionId.startsWith('cs_') && sessionId.length > 10;
};

/**
 * Check if session is a test session
 */
export const isTestSession = (sessionId: string): boolean => {
  return sessionId.startsWith('cs_test_') || sessionId.includes('test');
};

/**
 * Format currency amount for display
 */
export const formatCurrency = (amount: number, currency: string = 'usd'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100);
};

/**
 * Format date for display
 */
export const formatDate = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};