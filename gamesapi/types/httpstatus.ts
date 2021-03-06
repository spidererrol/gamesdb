export enum HTTPSTATUS {
    CONTINUE=100,
    PROCESSING=102,
    
    OK=200,
    CREATED=201,
    ACCEPTED=202,
    NON_AUTHORITATIVE=203,
    NO_CONTENT=204,
    
    BAD_REQUEST=400,
    UNAUTHORIZED=401,
    FORBIDDEN=403,
    NOT_FOUND=404,
    METHOD_NOT_ALLOWED=405,
    NOT_ACCEPTABLE=406,
    TIMEOUT=408,
    CONFLICT=409,
    GONE=410,
    PRECONDITION_FAILED=412,
    TEAPOT=418,

    INTERNAL_ERROR=500,
    NOT_IMPLEMENTED=501,
}