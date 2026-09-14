const http = require('http');

const paths = ['/dashboard', '/spreadsheet', '/competitors', '/content', '/analytics', '/reports'];

async function testOne(path) {
  return new Promise((resolve) => {
    http.get('http://localhost:3005' + path, (res) => {
      resolve(`${path}: ${res.statusCode}`);
    }).on('error', (err) => {
      resolve(`${path}: Error ${err.message}`);
    });
  });
}

async function run() {
  for (const p of paths) {
    const res = await testOne(p);
    console.log(res);
  }
}

run();
