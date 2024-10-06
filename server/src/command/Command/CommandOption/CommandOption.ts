

class CommandOption implements ApplicationCommandOption{
    type: number;
    name: string;
    description: string;
    required?: boolean;
    choices?: ChoicesType;
    options?: CommandOption[];
    min_value?:number;
    max_value?:number;

    constructor(options:ApplicationCommandOption){
        this.type = options.type
        this.name = options.name
        this.description = options.description
        this.required = options.required
        this.choices = options.choices
        this.options = options.options
        this.min_value = options.min_value
        this.max_value = options.max_value
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
}

export type ChoiceType = { name: string; value: string | number }
export type ChoicesType = Array<ChoiceType>;

export default CommandOption
