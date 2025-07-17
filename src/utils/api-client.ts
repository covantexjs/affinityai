/**
 * API client utility for making requests to backend functions
 */

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

/**
 * Submit data to Supabase via Netlify function
 */
export async function submitToFunction<T = any>(
  functionName: string, 
  data: any
): Promise<ApiResponse<T>> {
  console.log(`📤 [API CLIENT] Submitting to ${functionName}:`, data);
  
  try {
    const response = await fetch(`/.netlify/functions/${functionName}`, {
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
    console.log(`✅ [API CLIENT] Response from ${functionName}:`, result);
    
    return result;
  } catch (error: any) {
    console.error(`❌ [API CLIENT] Error calling ${functionName}:`, error);
    
    if (error.message?.includes('Failed to fetch')) {
      throw new Error('Network error - please check your internet connection and try again');
    }
    
    throw new Error(error.message || `Failed to call ${functionName}`);
  }
}

/**
 * Submit data using the supabase-operation function
 */
export async function submitData(data: { name: string; answer: string }): Promise<ApiResponse> {
  return submitToFunction('supabase-operation', data);
}