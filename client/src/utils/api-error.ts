interface APIError {
  response?: {
    data?: {
      validationErrors?: string[];
      message?: string;
    };
  };
  message?: string;
}

/**
 * Handles API errors consistently across the application
 * @param error - The error object from the API response
 * @param defaultMessage - Default message to show if no specific error is found
 * @returns The most appropriate error message based on priority:
 * 1. Validation errors
 * 2. API response message
 * 3. Error object message
 * 4. Default message
 */
export const handleApiError = (
  error: APIError,
  defaultMessage: string
): string => {
  // Check for validation errors first (most specific)
  if (error?.response?.data?.validationErrors?.length > 0) {
    return error.response.data.validationErrors[0];
  }

  // Then check for API error message
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  // Then check for general error message
  if (error?.message) {
    return error.message;
  }

  // Finally, return default message
  return defaultMessage;
};
