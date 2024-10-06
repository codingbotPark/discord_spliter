import { HTTPMethod } from "../util/httpMethod"

type Handler = Partial<{
    [method in HTTPMethod]: () => void
}>

export default Handler
