import gameChoices from "./choices/gmaeChoices.ts";
import userChoices from "./choices/userChoices.ts";

export const splitOption = [
    {
        type: 3,
        name: 'game',
        description: 'split reference game',
        required: false,
        choices:gameChoices
    },{
        type: 3,
        name: 'random',
        description: 'split with random',
        required: false,
        choices:userChoices
    },
]
