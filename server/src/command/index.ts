import Collector from "../employee/Collector.ts";
import Command from "./Command/Command.ts";
import CommandBuilder from "./Command/CommandBuilder.ts";
import SplitCommandCollector from "./SplitCommandCollector.ts";

export type CommandCollector = Collector<Command, CommandBuilder>



/** @THINK  */
const commandCollectors:CommandCollector[] = [
    new SplitCommandCollector(new CommandBuilder()),
]

export default commandCollectors