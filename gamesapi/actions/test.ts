import { Request, Response } from 'express'
import { log_debug, errorResponse } from '../libs/utils'
import '../libs/type-extensions'
import { HTTPSTATUS } from '../types/httpstatus'

// Helper functions:

// Actions:

export async function TODO(req: Request, res: Response) {
    log_debug("TODO")
    errorResponse(res, HTTPSTATUS.NOT_IMPLEMENTED, "This function has not been implemented yet!")
}
