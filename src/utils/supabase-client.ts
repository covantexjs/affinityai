/**
 * Client-side utility for making requests to Supabase via Netlify functions
 */

interface SubmitDataRequest {
  name: string;
  answer: string;
}

interface SubmitDataResponse {
  success: boolean;
  data?: any;
  message?: string;
  error?: string;
}

/**
 * Submit data to Supabase via Netlify function
 */
export async function submitData(data: SubmitDataRequest): Promise<SubmitDataResponse> {
  console.log('📤 [SUPABASE CLIENT] Submitting data:', data);
  
  try {
    const response = await fetch('/.netlify/functions/supabase-operation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
    }

    const result = await response.json();
    console.log('✅ [SUPABASE CLIENT] Response received:', result);
    
    return result;
  } catch (error: any) {
    console.error('❌ [SUPABASE CLIENT] Error:', error);
    
    if (error.message?.includes('Failed to fetch')) {
      throw new Error('Network error - please check your internet connection and try again');
    }
    
    throw new Error(error.message || 'Failed to submit data');
  }
}

/**
 * Test the Supabase connection via Netlify function
 */
export async function testSupabaseFunction(): Promise<boolean> {
  try {
    const testData = {
      name: 'Test User',
      answer: 'Test Answer'
    };
    
    const result = await submitData(testData);
    return result.success === true;
  } catch (error) {
    console.error('❌ [SUPABASE CLIENT] Test failed:', error);
    return false;
  }
}