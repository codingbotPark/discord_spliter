

export default function normalizePath(...paths:string[]){
    paths.unshift("")
    return paths.join('/').replace(/\/+/g, '/');
}