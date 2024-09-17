import Router from "./Router";

class InteractionRouter extends Router{
    constructor(){
        super('/interactions')
    }
    
    initializeRoutes(): void {
        this.registRoute('post', '', [],)
    }
}