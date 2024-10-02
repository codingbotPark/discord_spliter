import { SelectMenuComponentOptionData } from "discord.js"

type SelectMenuWithOptionalValue = Omit<SelectMenuComponentOptionData, 'value'> & { value?: string };
export function generateOptions(options:SelectMenuWithOptionalValue[] & {value?:string}, defaultValue?:string):SelectMenuComponentOptionData[]{
    return options.map((optionObj) => {
        if (!optionObj.value) optionObj.value = optionObj.label
        if (defaultValue === optionObj.value) optionObj.default = true
        return optionObj as SelectMenuComponentOptionData
    })
}