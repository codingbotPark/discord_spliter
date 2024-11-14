export function extractNames(text: string): string[] {
    const matches = text.matchAll(/<@(\d+)>/g);
    return Array.from(matches, match => match[1]);
}

export function taggingNames(...nameArr:string[]): string{
    return nameArr.map(id => `<@${id}>`).join(" ")
}