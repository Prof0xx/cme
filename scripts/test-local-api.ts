import { execSync } from 'child_process';

const baseUrl = 'http://localhost:5000';

async function testEndpoints() {
  console.log('🧪 Testing local API endpoints...\n');

  try {
    // Test /api/services
    console.log('\nTesting /api/services...');
    const servicesOutput = execSync(`powershell -Command "Invoke-WebRequest ${baseUrl}/api/services | Select-Object -ExpandProperty Content"`, { encoding: 'utf8' });
    const servicesData = JSON.parse(servicesOutput);
    console.log('✅ /api/services response:', 200);
    console.log('Categories:', servicesData.categories);

    // Test /api/leads
    console.log('\nTesting /api/leads...');
    const leadsOutput = execSync(`powershell -Command "Invoke-WebRequest ${baseUrl}/api/leads | Select-Object -ExpandProperty Content"`, { encoding: 'utf8' });
    const leadsData = JSON.parse(leadsOutput);
    console.log('✅ /api/leads response:', 200);
    console.log('Number of leads:', leadsData.length);

    // Test /api/service-requests
    console.log('\nTesting /api/service-requests...');
    const serviceRequestData = {
      telegramHandle: '@testuser',
      description: 'Test service request',
      referralCode: 'TEST123'
    };
    const serviceRequestOutput = execSync(
      `powershell -Command "$body = ConvertTo-Json @{ telegramHandle='@testuser'; description='Test service request'; referralCode='TEST123' }; Invoke-WebRequest -Uri '${baseUrl}/api/service-requests' -Method Post -Body $body -ContentType 'application/json' | Select-Object -ExpandProperty Content"`,
      { encoding: 'utf8' }
    );
    const serviceRequestResult = JSON.parse(serviceRequestOutput);
    console.log('✅ /api/service-requests response:', 200);
    console.log('Response:', serviceRequestResult);

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    if (error.message.includes('ECONNREFUSED')) {
      console.error('❌ Connection refused. Is the server running on port 5000?');
      console.error('Try running: curl http://localhost:5000/api/services');
    }
  }
}

testEndpoints(); 