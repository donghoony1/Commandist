import { Commandist } from "../Commandist";
import { CommandistComponent } from "../model/CommandistComponent";
import * as Electron from "electron";

export class QuickCommand extends CommandistComponent {
    window: Electron.BrowserWindow

    constructor(commandist: Commandist) {
        super(commandist)

        this.window = new commandist.modules.electron.BrowserWindow({
            width: 640,
            height: 54,
            title: 'QuickCommandUI',
            frame: false,
            // show: false,
            trasnparent: true,
            titleBarStyle: 'customButtonsOnHover',
            vibrancy: 'popover',
            skipTaskbar: true,
            minimizable: false,
            maximizable: false,
            closable: false,
            fullscreen: false,
            fullscreenable: false,
            enableLargerThanScreen: false,
            hasShadow: false,
            alwaysOnTop: true,
            kiosk: false,
            movable: true,
            webPreferences: {
                devTools: process.env.dev ? true : false,
                zoomFactor: 1.0,
                nodeIntegration: true,
                webviewTag: true
            }
        })

        this.window.loadFile('./view/quickcommand/ui.html')
    }
}