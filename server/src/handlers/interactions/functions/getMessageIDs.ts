/** @example split_requestSplit1_method to {split, requestSplit1_method} */
function getMessageIDs(customID:string){
    const [messageID, ...componentIDParts] = customID.split("_");
    if (!messageID || !componentIDParts.length) throw Error("Invalid customID");

    const componentID = componentIDParts.join("_");

    return {messageID, componentID}
}

export default getMessageIDs