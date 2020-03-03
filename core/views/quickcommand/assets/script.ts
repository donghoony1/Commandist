import { ipcRenderer } from 'electron';

let MaxWindowSearchResultsHeight = 0;

ipcRenderer.on('MaxWindowSearchResultsHeight', (event, arg) => {
    MaxWindowSearchResultsHeight = arg;
    (<HTMLUListElement>document.getElementById('Results')).setAttribute('style', `--commandist-max-height: ${arg}px;`);
});

document.addEventListener('DOMContentLoaded', () => {
    let SearchBar_Previous: string = (<HTMLInputElement>document.querySelector('#SearchBar')).value;

    setInterval(() => {
        let Window = document.body;
        ipcRenderer.send('resize', [Window.offsetWidth, Window.offsetHeight]);
    }, 10);

    document.addEventListener('keyup', () => {
        const SearchBar: string = (<HTMLInputElement>document.querySelector('#SearchBar')).value;
        if(SearchBar_Previous != SearchBar) {
            ipcRenderer.send('command', SearchBar);
            SearchBar_Previous = SearchBar;
        }
    });
});