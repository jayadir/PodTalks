const crypto = require('crypto');
const fs = require('fs');

// const secretString = crypto.randomBytes(64).toString('hex');
const jwta = crypto.randomBytes(64).toString('hex');
const jwtr = crypto.randomBytes(64).toString('hex');

// fs.writeFileSync('.env', `SECRET_STRING=${secretString}\n`, { flag: 'a' });
fs.writeFileSync('.env', `JWT_ACCESS_SECRET_STRING=${jwta}\n`, { flag: 'a' });
fs.writeFileSync('.env', `JWT_REFRESH_SECRET_STRING=${jwtr}\n`, { flag: 'a' });

console.log('SECRET_STRING has been set in the .env file');