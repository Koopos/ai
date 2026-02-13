// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
}

// User Types
export interface User {
  id: string;
  username: string;
  email?: string;
  displayName: string;
  avatar?: string;
  role: UserRole;
  familyId?: string;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = "ADMIN" | "MEMBER" | "GUEST";

export const UserRole = {
  ADMIN: "ADMIN" as const,
  MEMBER: "MEMBER" as const,
  GUEST: "GUEST" as const,
};

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email?: string;
  password: string;
  displayName: string;
}

// Task Types
export interface DailyTask {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  dueDate?: string;
  assignedToId?: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export type TaskStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

export const TaskStatus = {
  PENDING: "PENDING" as const,
  IN_PROGRESS: "IN_PROGRESS" as const,
  COMPLETED: "COMPLETED" as const,
  CANCELLED: "CANCELLED" as const,
};

export type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export const Priority = {
  LOW: "LOW" as const,
  MEDIUM: "MEDIUM" as const,
  HIGH: "HIGH" as const,
  URGENT: "URGENT" as const,
};

// Note Types
export interface Note {
  id: string;
  title: string;
  content: string;
  color?: string;
  isPinned: boolean;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

// Event Types
export interface Event {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime?: string;
  location?: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

// Book Types
export interface Book {
  id: string;
  title: string;
  author: string;
  isbn?: string;
  cover?: string;
  description?: string;
  publisher?: string;
  publishYear?: number;
  genre?: string;
  language?: string;
  pageCount?: number;
  filePath?: string;
  addedById: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReadingProgress {
  id: string;
  bookId: string;
  currentPage: number;
  totalPages?: number;
  status: ReadingStatus;
  startDate?: string;
  finishDate?: string;
  lastReadAt: string;
}

export type ReadingStatus = "NOT_STARTED" | "READING" | "COMPLETED" | "ABANDONED";

export const ReadingStatus = {
  NOT_STARTED: "NOT_STARTED" as const,
  READING: "READING" as const,
  COMPLETED: "COMPLETED" as const,
  ABANDONED: "ABANDONED" as const,
};

// Movie Types
export interface Movie {
  id: string;
  title: string;
  originalTitle?: string;
  year?: number;
  rating?: number;
  runtime?: number;
  genre: string[];
  director?: string;
  cast: string[];
  plot?: string;
  poster?: string;
  backdrop?: string;
  tmdbId?: string;
  filePath: string;
  addedById: string;
  watchedCount: number;
  createdAt: string;
  updatedAt: string;
}

// Music Types
export interface Track {
  id: string;
  title: string;
  artistId: string;
  artist?: Artist;
  albumId?: string;
  album?: Album;
  trackNumber?: number;
  duration?: number;
  genre?: string;
  filePath: string;
  createdAt: string;
}

export interface Artist {
  id: string;
  name: string;
  bio?: string;
  image?: string;
  createdAt: string;
}

export interface Album {
  id: string;
  title: string;
  artistId: string;
  artist?: Artist;
  year?: number;
  genre?: string;
  cover?: string;
  createdAt: string;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  isPublic: boolean;
  cover?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

// File Types
export interface File {
  id: string;
  name: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  folderId?: string;
  uploadedById: string;
  sharedById?: string;
  accessLevel: AccessLevel;
  downloadCount: number;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type AccessLevel = "PRIVATE" | "FAMILY" | "SHARED" | "PUBLIC";

export const AccessLevel = {
  PRIVATE: "PRIVATE" as const,
  FAMILY: "FAMILY" as const,
  SHARED: "SHARED" as const,
  PUBLIC: "PUBLIC" as const,
};

export interface Folder {
  id: string;
  name: string;
  parentId?: string;
  createdAt: string;
}
