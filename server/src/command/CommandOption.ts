

class CommandOption implements ApplicationCommandOption{

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
