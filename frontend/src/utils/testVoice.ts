// Test voice connection
export async function testVoiceConnection() {
  try {
    console.log('🧪 Testing voice connection...');

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    console.log('API URL:', API_URL);

    const response = await fetch(`${API_URL}/api/voice/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        channelName: 'test-room',
        uid: 'test-user',
      }),
    });

    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', data);

    return data;
  } catch (err) {
    console.error('Test failed:', err);
    throw err;
  }
}

// Run test on window for debugging
if (typeof window !== 'undefined') {
  (window as any).testVoiceConnection = testVoiceConnection;
}
