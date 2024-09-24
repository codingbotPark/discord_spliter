

class CommandOption implements ApplicationCommandOption{
    type: number;
    name: string;
    description: string;
    required?: boolean;
    choices?: Array<{ name: string; value: string | number }>;
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
    choices?: Array<{ name: string; value: string | number }>;
    options?: ApplicationCommandOption[];
    min_value?:number;
    max_value?:number;
}

export default CommandOption
