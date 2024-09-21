
// command class role = have execution with name
class Command implements ChatInputApplicationCommandData {
    private name:string
    private description:string
    private options:ApplicationCommandOption[] | undefined;
    private defaultPermission: boolean | undefined
    private type

    constructor({ name, description, execution }: ChatInputApplicationCommandData & {execution:Function}) {
        this.name = name
        this.description = description
        this.execution = execution
    }
}

// interface for command (similar with discordjs ChatInputApplicationCommandData)
export interface ChatInputApplicationCommandData {
    name: string;
    description: string;
    options?: ApplicationCommandOption[];
    defaultPermission?: boolean;
    type?: number;
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


export default Command