export function isHTTPMethod(method: any): method is HTTPMethod {
    return ["all", "get", "post", "put", "delete", "patch", "options", "head"].includes(method);
}

export type HTTPMethod = "all" | "get" | "post" | "put" | "delete" | "patch" | "options" | "head"
