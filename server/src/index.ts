import App from "./App.ts";
import managers from "./manager/index.ts";
import client from "./util/discordUtil/client.ts";

const app = new App(managers)
app.start()
