const crypto = require('crypto');
const fs = require('fs');

const secretString = crypto.randomBytes(64).toString('hex');

fs.writeFileSync('.env', `SECRET_STRING=${secretString}\n`, { flag: 'a' });

console.log('SECRET_STRING has been set in the .env file');