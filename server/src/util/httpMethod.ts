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

export type HTTPMethodType = keyof typeof HTTPMethod; // make methods to union 

// const httpMethod = ["all", "get", "post", "put", "delete", "patch", "options", "head"] as const
// export type HTTPMethodType = typeof httpMethod[number] 

export function isHTTPMethod(method: any): method is HTTPMethod {
    return httpMethod.includes(method);
}

