// src/utils/handleError.js
import { toast } from 'sonner';

/**
 * A centralized function for handling errors.
 * It logs the error to the console and displays a user-friendly toast notification.
 * @param {any} error - The error object or message to handle.
 * @param {string} [genericMessage] - A generic message to display if the error has no message.
 */
export const handleError = (
  error: Error,
  genericMessage = 'An unexpected error occurred.'
) => {
  // 1. Log the full error for developers
  console.error(error);

  // 2. Show a toast notification to the user
  // We check if the error object has a message property to show more specific info
  const message = error instanceof Error ? error.message : genericMessage;
  toast(message);
};
