import Collector from "../employee/Collector.ts";
import Command from "./Command/Command.ts";
import CommandBuilder from "./Command/CommandBuilder.ts";
import gameCommandCollector from "./gameCommandCollector.ts";
import SplitCommandCollector from "./SplitCommandCollector.ts";
import TestCommandCollector from "./TestCommandCollector.ts";

export type CommandCollector = Collector<Command, CommandBuilder>

const commandCollectors:CommandCollector[] = [
    new SplitCommandCollector(new CommandBuilder()),
    new TestCommandCollector(new CommandBuilder()),
    new gameCommandCollector(new CommandBuilder()),
]

export default commandCollectors


