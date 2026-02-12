import prisma from '../database/connection';
import { hashPassword, verifyPassword } from './password.service';
import { generateTokenPair, verifyRefreshToken } from './jwt.service';
import type { User, UserRole } from '@prisma/client';

export interface RegisterData {
  username: string;
  email?: string;
  password: string;
  displayName: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface AuthResponse {
  user: Omit<User, 'passwordHash'>;
  accessToken: string;
  refreshToken: string;
}

export async function register(data: RegisterData): Promise<AuthResponse> {
  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { username: data.username },
  });

  if (existingUser) {
    throw new Error('Username already exists');
  }

  if (data.email) {
    const existingEmail = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingEmail) {
      throw new Error('Email already exists');
    }
  }

  // Hash password
  const passwordHash = await hashPassword(data.password);

  // Create user
  const user = await prisma.user.create({
    data: {
      username: data.username,
      email: data.email,
      passwordHash,
      displayName: data.displayName,
      role: 'MEMBER' as UserRole,
    },
  });

  // Generate tokens
  const { accessToken, refreshToken } = generateTokenPair({
    userId: user.id,
    username: user.username,
    role: user.role,
  });

  // Return user without password hash
  const { passwordHash: _, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    accessToken,
    refreshToken,
  };
}

export async function login(data: LoginData): Promise<AuthResponse> {
  // Find user
  const user = await prisma.user.findUnique({
    where: { username: data.username },
  });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Verify password
  const isValid = await verifyPassword(data.password, user.passwordHash);

  if (!isValid) {
    throw new Error('Invalid credentials');
  }

  // Generate tokens
  const { accessToken, refreshToken } = generateTokenPair({
    userId: user.id,
    username: user.username,
    role: user.role,
  });

  // Return user without password hash
  const { passwordHash: _, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    accessToken,
    refreshToken,
  };
}

export async function refreshAccessToken(refreshToken: string) {
  try {
    const { userId } = verifyRefreshToken(refreshToken);

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('Invalid refresh token');
    }

    const { accessToken } = generateTokenPair({
      userId: user.id,
      username: user.username,
      role: user.role,
    });

    return { accessToken, user };
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
}
