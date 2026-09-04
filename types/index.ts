export type PlatformId = 'instagram' | 'tiktok' | 'facebook' | 'whatsapp' | 'youtube' | 'x' | 'linkedin' | 'telegram';

export type ActionType =
  | 'post'
  | 'reel'
  | 'story'
  | 'video'
  | 'message';

export type ScheduleStatus =
  | 'DRAFT'
  | 'SCHEDULED'
  | 'READY'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED'
  | 'REMINDER_REQUIRED';

export type ExecutionMode = 'AUTOMATIC' | 'MANUAL_REMINDER';

export interface PlatformCapability {
  actionType: ActionType;
  label: string;
  description: string;
  requiresMedia: boolean;
  supportsCaption: boolean;
  supportsHashtags: boolean;
  supportsMediaAttach: boolean;
  executionMode: ExecutionMode;
}

export interface SocialPlatform {
  id: PlatformId;
  name: string;
  color: string;
  connected: boolean;
  capabilities: PlatformCapability[];
  icon: string;
}

export interface ScheduledEvent {
  id: string;
  platform: PlatformId;
  actionType: ActionType;
  mediaUri?: string;
  caption?: string;
  hashtags?: string;
  recipient?: string;
  message?: string;
  scheduledAt: string;
  timezone: string;
  status: ScheduleStatus;
  executionMode: ExecutionMode;
  createdAt: string;
  updatedAt: string;
  errorMessage?: string;
}

export interface UserProfile {
  name?: string;
  createdAt: string;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  timezone: string;
  defaultReminderMinutes: number;
  lockEnabled: boolean;
  lockType: 'pin' | 'password' | null;
}
