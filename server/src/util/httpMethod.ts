export enum HTTPMethod {
    ALL = "all",
    GET = "get",
    POST = "post",
    PUT = "put",
    DELETE = "delete",
    PATCH = "patch",
    OPTIONS = "options",
    HEAD = "head"
}
const httpMethod = Object.values(HTTPMethod)

// const httpMethod = ["all", "get", "post", "put", "delete", "patch", "options", "head"] as const
// export type HTTPMethod = typeof httpMethod[number] // make methods to union 

export function isHTTPMethod(method: any): method is HTTPMethod {
    return httpMethod.includes(method);
}

