import { PlatformId } from '@/types';

// Simple command channel between Home and the Create tab.
// Because tab screens stay mounted and URL params persist,
// we pass the initial platform through a module-level signal
// that is consumed and cleared by the Create screen.
let pendingPlatform: PlatformId | null = null;

export function setPendingPlatform(platform: PlatformId | null) {
  pendingPlatform = platform;
}

export function consumePendingPlatform(): PlatformId | null {
  const value = pendingPlatform;
  pendingPlatform = null;
  return value;
}
