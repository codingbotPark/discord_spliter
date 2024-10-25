import App from "./App.ts";
import managers from "./manager/index.ts";

const app = new App(managers)
app.start()
