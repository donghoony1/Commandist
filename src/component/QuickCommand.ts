import { Commandist } from "../Commandist";
import { CommandistComponent } from "../model/CommandistComponent";
import * as Electron from "electron";
import * as path from "path";

export class QuickCommand extends CommandistComponent {
    window: Electron.BrowserWindow

    constructor(commandist: Commandist) {
        super(commandist)

        this.window = new commandist.modules.electron.BrowserWindow({
            width: 640,
            height: 54 + 192,
            title: 'QuickCommandUI',
            frame: false,
            show: false,
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

        this.window.loadFile(path.join(__dirname, '..', 'view', 'quickcommand', 'ui.html'))

        this.window.on('blur', () => {
            // this.hide()
        })

        commandist.modules.electron.globalShortcut.register('Shift+Space', () => this.toggle())
    }

    toggle() {
        if(this.window) {
            if(this.window.isVisible()) {
                this.hide()
            } else {
                this.show()
            }
        }
    }

    show() {
        if(this.window) {
            this.reposition()
            this.window.show()
        }
    }

    hide() {
        if(this.window) {
            this.window.hide()
        }
    }

    reposition() {
        if(this.window) {
            const screen = this.commandist.modules.electron.screen;
            const focusedDisplay = screen.getDisplayNearestPoint(screen.getCursorScreenPoint())
            const { x, y } = focusedDisplay.bounds
            this.window.setPosition(
                x + Math.ceil((focusedDisplay.size.width / 2) - 640 / 2), 
                y + Math.ceil(focusedDisplay.size.height / 10 * 2)
            )
        }
    }
}