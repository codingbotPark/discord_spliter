import Collector from "../employee/Collector.ts";
import ChannelCommandCollector from "./ChannelCommandCollector.ts";
import Command from "./Command/Command.ts";
import CommandBuilder from "./Command/CommandBuilder.ts";
import GameCommandCollector from "./GameCommandCollector.ts";
import SplitCommandCollector from "./SplitCommandCollector.ts";
import TestCommandCollector from "./TestCommandCollector.ts";

export type CommandCollector = Collector<Command, CommandBuilder>

const commandCollectors:CommandCollector[] = [
    new SplitCommandCollector(new CommandBuilder()),
    new TestCommandCollector(new CommandBuilder()),
    new GameCommandCollector(new CommandBuilder()),
    new ChannelCommandCollector(new CommandBuilder())
]

export default commandCollectors


