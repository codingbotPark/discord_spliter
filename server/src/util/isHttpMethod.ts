/** http method 라는 변수르 만들고, 이 배열을 | 로 타입으로 만들기 */
export function isHTTPMethod(method: any): method is HTTPMethod {
    return ["all", "get", "post", "put", "delete", "patch", "options", "head"].includes(method);
}

export type HTTPMethod = "all" | "get" | "post" | "put" | "delete" | "patch" | "options" | "head"
