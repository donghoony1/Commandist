import { ipcRenderer } from 'electron';

let MaxWindowSearchResultsHeight = 0;

ipcRenderer.on('MaxWindowSearchResultsHeight', (event, arg): void => {
    MaxWindowSearchResultsHeight = arg;
    (<HTMLUListElement>document.getElementById('Results')).setAttribute('style', `--commandist-max-height: ${arg}px;`);
});

const getSelection = (): number => parseInt(document.querySelector('.QuickCommand_Results')?.getAttribute('data-selection') || `0`);

const setSelection = (number: number): void => document.querySelector('.QuickCommand_Results')?.setAttribute('data-selection', `${number}`);

const RefreshPression = (Key: 0 | 1): void => {
    const selection: number = getSelection();
    const ResultsScrollTop: number = document.getElementById('Results')!.scrollTop | 0;
    let ElementScrollTop: number = 80 * (selection + 1) - 64.125;
    let Min: number = ResultsScrollTop;
    let Max: number = ResultsScrollTop + Math.floor((MaxWindowSearchResultsHeight) / 80) * 80;
    let modify: number = 0;
    if(Key == 0 && ElementScrollTop <= Min) modify -= 80;
    else if(Key == 1 && Max <= ElementScrollTop) modify += 80;
    document.getElementById('Results')!.scrollTop = document.getElementById('Results')!.scrollTop + modify;
    document.querySelectorAll('.QuickCommand_Result').forEach(result => result.classList.remove('pressed'));
    document.querySelectorAll('.QuickCommand_Result')![selection]!.classList.add('pressed');
}

document.addEventListener('DOMContentLoaded', (): void => {
    let SearchBar_Previous: string = (<HTMLInputElement>document.querySelector('#SearchBar')).value;

    setInterval(() => {
        let Window = document.body;
        ipcRenderer.send('resize', [Window.offsetWidth, Window.offsetHeight]);
    }, 10);

    document.addEventListener('keydown', (event): void => {
        if([38, 40].includes(event.keyCode)) {
            event.stopPropagation();
            event.preventDefault();  
            event.returnValue = false;
            event.cancelBubble = true;
            return;
        }
    });

    document.addEventListener('keyup', (event): void => {
        const selection: number = getSelection();
        switch(event.keyCode) {
            case 38: {
                if(selection !== 0) {
                    setSelection(selection - 1);
                    RefreshPression(0);
                }
                break;
            }
            case 40: {
                if(selection !== document.querySelectorAll('.QuickCommand_Result').length - 1) {
                    setSelection(selection + 1);
                    RefreshPression(1);
                }
                break;
            }
            default: {
                const SearchBar: string = (<HTMLInputElement>document.querySelector('#SearchBar')).value;
                if(SearchBar_Previous != SearchBar || SearchBar.length === 0) {
                    ipcRenderer.send('command', SearchBar);
                    SearchBar_Previous = SearchBar;
                }
                break;
            }
        }
    });
});