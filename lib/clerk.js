import { clerkClient } from '@clerk/nextjs/server';

// No need for initialization - clerkClient is already instantiated
export function getClerkClient() {
  return clerkClient;
}