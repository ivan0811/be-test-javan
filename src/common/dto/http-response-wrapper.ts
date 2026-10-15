import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export interface HttpResponseWrapperOptions<T> {
    errorCode?: number | string;
    message: string | null;
    error?: string | null;
    statusCode: number;
    data: T | null;
    validationErrors?: any[] | Object;
}

export class HttpResponseWrapper<T> {
    @ApiProperty({ oneOf: [{ type: 'number' }, { type: 'string' }], example: 0 })
    errorCode: number | string;
    @ApiProperty({ type: String, nullable: true, example: 'Data retrieved successfully' })
    message: string | null;
    @ApiProperty({ type: String, nullable: true, example: null })
    error: string | null;
    @ApiPropertyOptional({
        nullable: true,
        oneOf: [
            { type: 'array', items: { type: 'object', additionalProperties: true } },
            { type: 'object', additionalProperties: true },
        ],
    })
    validationErrors?: any[] | null | Object;
    @ApiProperty({ type: Number, example: 200 })
    statusCode: number;
    @ApiProperty({ type: 'object', additionalProperties: true, nullable: true })
    data: T | null;

    constructor(options: HttpResponseWrapperOptions<T>) {
        this.errorCode = options.errorCode ?? 0;
        this.message = options.message;
        this.error = options.error ?? null;
        this.statusCode = options.statusCode;
        this.data = options.data;
        this.validationErrors = options.validationErrors;
    }
}
