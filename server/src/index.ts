import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true }
}, { timestamps: true });
const User = mongoose.model('User', UserSchema);

const secret = process.env.JWT_SECRET;
if (!secret) console.warn('WARNING: JWT_SECRET is missing; set it in server/.env');

app.get('/api/health', (_req, res) => res.json({ ok: true, message: 'API is running' }));

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body ?? {};
    if (!name?.trim() || !email?.trim() || typeof password !== 'string') {
      return res.status(400).json({ message: 'Name, email and password are required.' });
    }
    if (password.length < 8) return res.status(400).json({ message: 'Password must be at least 8 characters.' });
    const normalizedEmail = email.trim().toLowerCase();
    if (await User.findOne({ email: normalizedEmail })) return res.status(409).json({ message: 'An account with this email already exists.' });
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name: name.trim(), email: normalizedEmail, passwordHash });
    const token = jwt.sign({ userId: user._id.toString() }, secret as string, { expiresIn: '7d' });
    return res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Unable to create account.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body ?? {};
    if (!email?.trim() || typeof password !== 'string') return res.status(400).json({ message: 'Email and password are required.' });
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) return res.status(401).json({ message: 'Invalid email or password.' });
    const token = jwt.sign({ userId: user._id.toString() }, secret as string, { expiresIn: '7d' });
    return res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Unable to sign in.' });
  }
});

app.get('/api/auth/me', async (req, res) => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) return res.status(401).json({ message: 'Missing authentication token.' });
    const payload = jwt.verify(header.slice(7), secret as string) as { userId: string };
    const user = await User.findById(payload.userId).select('name email');
    if (!user) return res.status(401).json({ message: 'User not found.' });
    return res.json({ user: { id: user._id, name: user.name, email: user.email } });
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
});

const port = Number(process.env.PORT || 4000);
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/awt_auth')
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => console.log(`API listening on http://localhost:${port}`));
  })
  .catch(err => { console.error('MongoDB connection failed:', err); process.exit(1); });
