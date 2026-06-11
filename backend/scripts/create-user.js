#!/usr/bin/env node
/**
 * Create or update a system user.
 *
 * Usage:
 *   node scripts/create-user.js --username admin --password "YourSecurePass" --name "Office Admin" --role admin
 *   node scripts/create-user.js --username inspector1 --password "YourSecurePass" --name "Field Inspector" --role inspector
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
// comment
function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const key = argv[i];
    if (key.startsWith('--')) {
      args[key.slice(2)] = argv[i + 1];
      i += 1;
    }
  }
  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const username = args.username?.trim();
  const password = args.password;
  const fullName = args.name?.trim();
  const role = args.role?.trim();

  if (!username || !password || !fullName || !role) {
    console.error('Usage: node scripts/create-user.js --username USER --password PASS --name "Full Name" --role admin|inspector');
    process.exit(1);
  }

  if (!['admin', 'inspector'].includes(role)) {
    console.error('Role must be "admin" or "inspector".');
    process.exit(1);
  }

  if (password.length < 8) {
    console.error('Password must be at least 8 characters.');
    process.exit(1);
  }

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ketelelema_audit',
  });

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const [result] = await connection.execute(
      `INSERT INTO users (username, password_hash, full_name, role)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), full_name = VALUES(full_name), role = VALUES(role)`,
      [username, passwordHash, fullName, role]
    );

    if (result.affectedRows === 1) {
      console.log(`Created user "${username}" (${role}).`);
    } else {
      console.log(`Updated user "${username}" (${role}).`);
    }
  } finally {
    await connection.end();
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
