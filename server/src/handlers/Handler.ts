import { HTTPMethod } from "../util/httpMethod"
import { RequestHandler } from "express"

type Handler = Partial<{
    [method in HTTPMethod]: RequestHandler
}>

export default Handler

export function confirmHandler(handler?:RequestHandler):RequestHandler{
    if (handler) return handler
    throw Error("handler is not ReuqestHandler type")
}
