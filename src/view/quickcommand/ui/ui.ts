(async() => {
    const { ipcRenderer } = require('electron')

    document.addEventListener('DOMContentLoaded', () => {
        ipcRenderer.on('quickcommand.clear', clear)

        setInterval(() => {
            if(document.activeElement != document.querySelector('.qc .input')) {
                (document.querySelector('.qc .input') as HTMLElement)?.focus()
            }
        }, 10)

        document.addEventListener('keyup', (e) => {
            console.log(e.key)
            switch(e.key) {
                case "Enter": {

                }
                case "Escape": {

                }
                case "ArrowUp": {

                }
                case "ArrowDown": {

                }
            }
        })
    })
})()