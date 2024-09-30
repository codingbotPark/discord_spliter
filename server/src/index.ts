import App from "./App.ts";
import managers from "./manager/index.ts";
import { Client } from "discord.js";
import { verifiedEnv } from "./util/verifyEnv.ts";

const app = new App(managers)
app.start()

