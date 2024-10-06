import Handler from "../\bHandler"
import { HTTPMethod } from "../../util/httpMethod"


const splitHandler:Handler = {}
splitHandler[HTTPMethod.POST] = () => {}

export default splitHandler 