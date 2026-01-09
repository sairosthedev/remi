// Using native fetch in Node 22

// Configuration
const BASE_URL = 'http://localhost';
const SERVICES = [
  { name: 'Auth Service', port: 3001, path: '/api/auth/health' }, // assuming health endpoint exists, or we just check root
  { name: 'Catalog Service', port: 3002, path: '/api/health' },
  { name: 'Cart Service', port: 3003, path: '/api/cart/health' },
  { name: 'Checkout Service', port: 3004, path: '/api/orders/health' },
];

async function testService(service) {
  const url = `${BASE_URL}:${service.port}${service.path}`;
  try {
    const start = Date.now();
    // try fetching root if health doesn't exist, just to check TCP connection
    const response = await fetch(url).catch(async (e) => {
       // fallback to root to check connectivity
       return await fetch(`${BASE_URL}:${service.port}/`);
    });
    
    const duration = Date.now() - start;
    console.log(`✅ ${service.name} is UP (${duration}ms) - ${response.status}`);
    return true;
  } catch (error) {
    console.log(`❌ ${service.name} is DOWN: ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log('Testing Backend Services...');
  const results = await Promise.all(SERVICES.map(testService));
  const allPassing = results.every(r => r);
  
  if (allPassing) {
    console.log('\n✨ All services are reachable from host!');
    process.exit(0);
  } else {
    console.log('\n⚠️ Some services are not reachable.');
    process.exit(1);
  }
}

runTests();
