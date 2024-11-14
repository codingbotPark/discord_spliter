/** @example split_requestSplit1_method to {split, requestSplit1_method} */
export function parseCustomID(customID:string, selectedIdx:number=0){
    const splitedCustomID = customID.split("-")

    const selectedPart = splitedCustomID.splice(selectedIdx,1)[0];
    const otherParts = splitedCustomID
    
    // also protect index clamping
    if (!selectedPart || !otherParts.length) throw Error("Invalid customID");

    const otherPart = otherParts.join("_");

    return [selectedPart, otherPart]
}

export function generateCustomID<T extends string>(...customID:StringWithoutDash<T>[]){
    return customID.join("-")
}

export type StringWithoutDash<T extends string> = T extends `${infer _}${"-"}${infer _}` ? never : T;
