

class CommandOption implements ApplicationCommandOption{
    type: number;
    name: string;
    description: string;
    required?: boolean;
    choices?: Array<{ name: string; value: string | number }>;
    options?: CommandOption[];

    constructor({type, name, description, required, choices, options}:ApplicationCommandOption){
        this.type = type
        this.name = name
        this.description = description
        this.required = required
        this.choices = choices
        this.options = options
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
}

export default CommandOption
