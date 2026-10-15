// src/common/exceptions/custom-exceptions.ts
import { BadRequestException, NotFoundException, ConflictException, UnauthorizedException, ForbiddenException, InternalServerErrorException } from '@nestjs/common';
import { ErrorCode, ErrorCategory, ErrorMetadata, getErrorCategory } from '../constants/error-codes.js';

export class AppBadRequestException extends BadRequestException {
    constructor(message: string | string[], errorCode: ErrorCode = ErrorCode.VALIDATION_ERROR, metadata?: ErrorMetadata) {
        super({
            errorCode,
            message,
            category: ErrorCategory.VALIDATION,
            metadata: {                
                ...metadata
            }
        });
    }
}

export class AppNotFoundException extends NotFoundException {
    constructor(message: string = 'Resource not found', errorCode: ErrorCode = ErrorCode.NOT_FOUND_ERROR, metadata?: ErrorMetadata) {
        super({
            errorCode,
            message,
            category: ErrorCategory.NOT_FOUND,
            metadata: {                
                ...metadata
            }
        });
    }
}

export class AppConflictException extends ConflictException {
    constructor(message: string = 'Conflict occurred', errorCode: ErrorCode = ErrorCode.CONFLICT_ERROR, metadata?: ErrorMetadata) {
        super({
            errorCode,
            message,
            category: ErrorCategory.CONFLICT,
            metadata: {                
                ...metadata
            }
        });
    }
}

export class AppUnauthorizedException extends UnauthorizedException {
    constructor(message: string = 'Unauthorized access', errorCode: ErrorCode = ErrorCode.UNAUTHORIZED_ERROR, metadata?: ErrorMetadata) {
        super({
            errorCode,
            message,
            category: ErrorCategory.UNAUTHORIZED,
            metadata: {                
                ...metadata
            }
        });
    }
}

export class AppForbiddenException extends ForbiddenException {
    constructor(message: string = 'Access forbidden', errorCode: ErrorCode = ErrorCode.FORBIDDEN_ERROR, metadata?: ErrorMetadata) {
        super({
            errorCode,
            message,
            category: ErrorCategory.FORBIDDEN,
            metadata: {                
                ...metadata
            }
        });
    }
}

export class AppInternalServerErrorException extends InternalServerErrorException {
    constructor(message: string = 'Internal server error', errorCode: ErrorCode = ErrorCode.INTERNAL_SERVER_ERROR, metadata?: ErrorMetadata) {
        super({
            errorCode,
            message,
            category: getErrorCategory(errorCode),
            metadata: {                
                ...metadata
            }
        });
    }
}
