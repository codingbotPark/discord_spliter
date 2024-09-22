import CommandHub from "./CommandHub/CommandHub.ts";
import splitCommandHub from "./CommandHub/SplitCommandHub";

const commandHubs:CommandHub[] = [
    new splitCommandHub(),
]

export default commandHubs