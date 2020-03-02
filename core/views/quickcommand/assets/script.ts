import { ipcRenderer } from 'electron';

document.addEventListener('DOMContentLoaded', () => {
    let SearchBar_Previous: string = (<HTMLInputElement>document.querySelector('#SearchBar')).value;

    document.addEventListener('keyup', () => {
        const SearchBar: string = (<HTMLInputElement>document.querySelector('#SearchBar')).value;
        if(SearchBar_Previous != SearchBar) {
            ipcRenderer.send('command', SearchBar);
            SearchBar_Previous = SearchBar;
        }
    });
});