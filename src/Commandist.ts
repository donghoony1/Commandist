import { CommandistComponent } from "./model/CommandistComponent"

class Commandist {
    modules: {
        [key: string]: any
    } = {}
    components: {
        [key: string]: CommandistComponent
    } = {}

    constructor() {
        this.moduleLoader('electron')
        this.modules.electron.app.whenReady().then(() => {
            this.componentLoader('QuickCommand', './component/QuickCommand')
        })
    }

    ready() {
        
    }

    moduleLoader(name: string): Commandist {
        this.modules[name] = require(name)
        return this
    }
    componentLoader(name: string, directory: string): Commandist {
        this.components[name] = new (require(directory))[name](this)
        return this
    }
}

export { Commandist }