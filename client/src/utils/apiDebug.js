// API Debug Utilities
export const debugApiCall = async (url, options = {}) => {
  console.log('🔍 API Debug Call:', url);
  console.log('📝 Options:', options);
  
  try {
    const response = await fetch(url, options);
    
    console.log('📊 Response Status:', response.status);
    console.log('📋 Response Headers:', Object.fromEntries(response.headers.entries()));
    
    // Clone response to read text without consuming the stream
    const responseClone = response.clone();
    const responseText = await responseClone.text();
    
    console.log('📄 Raw Response:', responseText);
    
    // Check if response is HTML (common when server returns error pages)
    if (responseText.startsWith('<!DOCTYPE') || responseText.startsWith('<html')) {
      console.error('❌ Received HTML response instead of JSON. This usually means:');
      console.error('   - The API endpoint doesn\'t exist (404)');
      console.error('   - Authentication failed (401/403)');
      console.error('   - Server error occurred (500)');
      
      return {
        ok: false,
        status: response.status,
        error: 'HTML_RESPONSE',
        html: responseText
      };
    }
    
    // Try to parse JSON
    try {
      const data = await response.json();
      console.log('✅ Parsed JSON:', data);
      return {
        ok: response.ok,
        status: response.status,
        data: data
      };
    } catch (jsonError) {
      console.error('❌ JSON Parse Error:', jsonError.message);
      return {
        ok: false,
        status: response.status,
        error: 'JSON_PARSE_ERROR',
        rawText: responseText
      };
    }
    
  } catch (networkError) {
    console.error('❌ Network Error:', networkError.message);
    return {
      ok: false,
      error: 'NETWORK_ERROR',
      message: networkError.message
    };
  }
};

export const testApiConnection = async () => {
  console.log('🧪 Testing API Connection...');
  
  // Test 1: Check if server is responding
  console.log('\n1️⃣ Testing server connection...');
  const serverTest = await debugApiCall('/api/health');
  
  // Test 2: Check profile endpoint (requires auth)
  const token = localStorage.getItem('token');
  if (token) {
    console.log('\n2️⃣ Testing auth with profile endpoint...');
    const authTest = await debugApiCall('/api/auth/profile', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    // Test 3: Check bookings endpoint
    console.log('\n3️⃣ Testing bookings endpoint...');
    const bookingsTest = await debugApiCall('/api/bookings/host/all', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    return { serverTest, authTest, bookingsTest };
  } else {
    console.log('\n2️⃣ No token found in localStorage');
    return { serverTest, authTest: null };
  }
};