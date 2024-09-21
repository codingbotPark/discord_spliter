import { splitOption } from "./options/splitOptions.ts"

const commandObjects = [
    {
        name: 'test',
        description: 'Just your average command',
        type: 1,
    },
    {
        name:'split',
        description: 'split voice channel',
        type: 1,
        // option:splitOption,
        options:splitOption
    }
]

export default commandObjects

