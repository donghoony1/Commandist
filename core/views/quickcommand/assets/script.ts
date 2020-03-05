import { ipcRenderer } from 'electron';
import { Interfaces } from '../../../control/interfaces';

let MaxWindowSearchResultsHeight = 0;

let SearchBar_Previous: string = '';

ipcRenderer.on('MaxWindowSearchResultsHeight', (event, arg): void => {
    MaxWindowSearchResultsHeight = arg;
    (<HTMLUListElement>document.getElementById('Results')).setAttribute('style', `--commandist-max-height: ${arg}px;`);
});

ipcRenderer.on('show', (): void => {
    if(document.body.classList.contains('QuickCommand_hide')) document.body.classList.remove('QuickCommand_hide');
    
});

ipcRenderer.on('hide', (): void => {
    if(!document.body.classList.contains('QuickCommand_hide')) document.body.classList.add('QuickCommand_hide');
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
    document.querySelectorAll('.QuickCommand_Result').forEach((result) => result.classList.remove('pressed'));
    document.querySelectorAll('.QuickCommand_Result')![selection]!.classList.add('pressed');
}

const Search = (): void => {
    const SearchBar: string = (<HTMLInputElement>document.querySelector('#SearchBar')).value;
    if(SearchBar_Previous != SearchBar || SearchBar.length === 0) {
        ipcRenderer.send('Windows.QuickCommand.command', SearchBar);
        SearchBar_Previous = SearchBar;
    }
}

const Clear = (): void => {
    (<HTMLInputElement>document.querySelector('#SearchBar')).value = '';
    Search();
}

const Hide = (): void => {
    ipcRenderer.send('Windows.QuickCommand.hide');
    if(!document.body.classList.contains('QuickCommand_hide')) document.body.classList.add('QuickCommand_hide');
}

document.addEventListener('DOMContentLoaded', (): void => {
    SearchBar_Previous = (<HTMLInputElement>document.querySelector('#SearchBar')).value;

    setInterval((): void => {
        let Window = document.body;
        ipcRenderer.send('Windows.QuickCommand.resize', [Window.offsetWidth, Window.offsetHeight]);

        if(document.getElementById('SearchBar') !== document.activeElement) {
            document.getElementById('SearchBar')!.focus();
        }
    }, 10);

    document.addEventListener('click', (event): void => {
        const EventData: Array<Interfaces.ApplicationAction> = JSON.parse(event.path.filter((element: any) => element.classList !== undefined && element.classList[0] === 'QuickCommand_Result' && element!.getAttribute('data-origin')! !== undefined)[0]!.getAttribute('data-origin')!).Event[`${ event.shiftKey === true ? 'Shift' : '' }Click`];
        
        if(EventData) {
            ipcRenderer.send('Windows.QuickCommand.execute', EventData);
    
            Clear();
            Hide();
        }
    });

    document.addEventListener('keydown', (event): void => {
        switch(event.keyCode) {
            case 13: {
                event.stopPropagation();
                event.preventDefault();  
                event.returnValue = false;
                event.cancelBubble = true;

                const EventData: Array<Interfaces.ApplicationAction> = JSON.parse(document.querySelectorAll('.QuickCommand_Result')[getSelection()].getAttribute('data-origin')!).Event[`${ event.shiftKey === true ? 'Shift' : '' }Return`];
                if(EventData === undefined) break;

                ipcRenderer.send('Windows.QuickCommand.execute', EventData);

                Clear();
                Hide();
                break;
            }
            case 27: {
                Clear();
                Hide();
                break;
            }
            case 38:
            case 40: {
                event.stopPropagation();
                event.preventDefault();  
                event.returnValue = false;
                event.cancelBubble = true;
                break;
            }
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
                Search();
                break;
            }
        }
    });
});