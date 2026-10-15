export enum ErrorCategory {
  VALIDATION = 'VALIDATION',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  INTERNAL = 'INTERNAL',
}

export enum ErrorCode {
  // Bank related errors
  NATIONALIZE_API_FETCH_FAILED = 'NATIONALIZE_API_FETCH_FAILED',

  // General errors
  INTERNAL_SERVER_ERROR = 'ERR_INTERNAL_SERVER',
  VALIDATION_ERROR = 'ERR_VALIDATION',
  NOT_FOUND_ERROR = 'ERR_NOT_FOUND',
  CONFLICT_ERROR = 'ERR_CONFLICT',
  UNAUTHORIZED_ERROR = 'ERR_UNAUTHORIZED',
  FORBIDDEN_ERROR = 'ERR_FORBIDDEN',
}

export interface ErrorMetadata {
  timestamp?: string;
  requestId?: string;
  path?: string;
  method?: string;
  userId?: string;
  additionalInfo?: Record<string, any>;
}

export const getErrorCategory = (errorCode: ErrorCode): ErrorCategory => {
  if (errorCode.includes('NOT_FOUND')) return ErrorCategory.NOT_FOUND;
  if (errorCode.includes('VALIDATION')) return ErrorCategory.VALIDATION;
  if (errorCode.includes('CONFLICT')) return ErrorCategory.CONFLICT;
  if (errorCode.includes('UNAUTHORIZED')) return ErrorCategory.UNAUTHORIZED;
  if (errorCode.includes('FORBIDDEN')) return ErrorCategory.FORBIDDEN;
  return ErrorCategory.INTERNAL;
};
