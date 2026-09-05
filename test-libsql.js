const { createClient } = require('@libsql/client');
const client = createClient({ url: 'file:./dev.db' });
console.log("Success");
