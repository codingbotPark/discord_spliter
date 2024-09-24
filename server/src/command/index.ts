import Collector from "../employee/Collector.ts";
import Command from "./class/Command.ts";
import CommandBuilder from "./CommandBuilder.ts";
import SplitCommandCollector from "./SplitCommandCollector";

export type CommandCollector = Collector<Command, CommandBuilder>

const commandCollectors:CommandCollector[] = [
    new SplitCommandCollector(new CommandBuilder()),
]

export default commandCollectors