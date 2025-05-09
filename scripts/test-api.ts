import axios from 'axios';

// Use the correct API URL - this should be your Vercel deployment URL
const baseUrl = 'https://cme-client.vercel.app';

async function testServicesAPI() {
  console.log('🔍 Testing /api/services endpoint...');
  console.log(`🌐 Using API URL: ${baseUrl}/api/services`);
  
  try {
    // Test the main services endpoint
    console.log('\n1️⃣ Testing GET /api/services (all services)');
    const response = await axios.get(`${baseUrl}/api/services`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      validateStatus: (status) => true // Don't throw on any status code
    });
    
    console.log(`✅ Status: ${response.status}`);
    console.log(`📊 Response headers:`, response.headers);
    
    // Check if we got HTML response by mistake
    if (typeof response.data === 'string' && response.data.includes('<!doctype html>')) {
      console.error('❌ Got HTML response instead of JSON. This means we are hitting the frontend, not the API.');
      console.error('Please check your Vercel deployment configuration and ensure the API routes are properly set up.');
      return;
    }
    
    console.log(`📊 Response Type: ${typeof response.data}`);
    console.log(`📊 Full Response:`, JSON.stringify(response.data, null, 2));
    
    // If we got a successful response, try testing with a category
    if (response.status === 200) {
      const testCategory = 'listings';
      console.log(`\n2️⃣ Testing GET /api/services?category=${testCategory}`);
      
      try {
        const categoryResponse = await axios.get(`${baseUrl}/api/services?category=${testCategory}`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          validateStatus: (status) => true
        });
        
        console.log(`✅ Status: ${categoryResponse.status}`);
        console.log(`📊 Category Response:`, JSON.stringify(categoryResponse.data, null, 2));
      } catch (catError) {
        console.error(`❌ Category request error:`, catError.message);
        if (catError.response) {
          console.error(`   Status: ${catError.response.status}`);
          console.error(`   Response:`, catError.response.data);
        }
      }
    }
    
  } catch (error) {
    console.error('❌ API Test Error:', error.message);
    
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Response:`, error.response.data);
    }
  }
}

testServicesAPI().catch(console.error); 