import { loadEnvFile } from 'node:process';

// Vercel provides environment variables directly to the Function runtime.
if (!process.env.VERCEL) {
  try {
    loadEnvFile(new URL('../../.env', import.meta.url));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw error;
    }
  }
}
