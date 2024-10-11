

class CommandOption implements ApplicationCommandOption{
    type: number;
    name: string;
    description: string;
    required?: boolean;
    choices?: ChoicesType;
    options?: CommandOption[];
    min_value?:number;
    max_value?:number;
    channel_types?:number[]

    constructor(options:ApplicationCommandOption){
        this.type = options.type
        this.name = options.name
        this.description = options.description
        this.required = options.required
        this.choices = options.choices
        this.options = options.options
        this.min_value = options.min_value
        this.max_value = options.max_value
        this.channel_types = options.channel_types
    }
}

// interface for command's sub options
export interface ApplicationCommandOption {
    type: number;
    name: string;
    description: string;
    required?: boolean;
    choices?: ChoicesType;
    options?: ApplicationCommandOption[];
    min_value?:number;
    max_value?:number;
    channel_types?:number[]
}

export type ChoiceType = { name: string; value: string | number | boolean }
export type ChoicesType = Array<ChoiceType>;


export default CommandOption
