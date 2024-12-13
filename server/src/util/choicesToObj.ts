import { ChoicesType, ChoiceType } from "../../command/Command/CommandOption/CommandOption";


/** @TODO make to generic return type */
function optionsToObject<T extends ChoiceType>(options: T[] | undefined): Record<T['name'], T['value']> | null{
    if (!options) return null
    return options.reduce((acc, curr) => {
        acc[curr.name] = curr.value;
        return acc;
    }, {} as Record<string, T['value']>);
}

export default optionsToObject

export type ChoiceRecord<T extends ChoicesType> = {
    [K in T[number]['name']]: Extract<T[number], { name: K }>['value'];
};