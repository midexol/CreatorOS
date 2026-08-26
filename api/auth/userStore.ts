import fs from 'fs';
import path from 'path';

export interface StoredUser {
  id: string;
  email: string;
  name: string;
  passwordHash?: string;
  googleSub?: string;
  avatarUrl?: string;
  createdAt: string;
}

// Durable local user registry stored in temp/runtime directory
const DB_PATH = path.join(process.cwd(), 'tmp_user_registry.json');

function readDb(): Record<string, StoredUser> {
  try {
    if (fs.existsSync(DB_PATH)) {
      const content = fs.readFileSync(DB_PATH, 'utf8');
      return JSON.parse(content);
    }
  } catch {
    // fallback
  }
  return {};
}

function writeDb(db: Record<string, StoredUser>) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
  } catch {
    // fallback
  }
}

export function findUserByEmail(email: string): StoredUser | null {
  const db = readDb();
  const lowerEmail = email.toLowerCase().trim();
  const user = Object.values(db).find((u) => u.email.toLowerCase() === lowerEmail);
  return user || null;
}

export function findUserByGoogleSub(googleSub: string): StoredUser | null {
  const db = readDb();
  const user = Object.values(db).find((u) => u.googleSub === googleSub);
  return user || null;
}

export function createUser(userData: Omit<StoredUser, 'createdAt'>): StoredUser {
  const db = readDb();
  const newUser: StoredUser = {
    ...userData,
    email: userData.email.toLowerCase().trim(),
    createdAt: new Date().toISOString(),
  };

  db[newUser.id] = newUser;
  writeDb(db);
  return newUser;
}

export function sanitizeUser(user: StoredUser) {
  const { passwordHash, ...safe } = user;
  return safe;
}
