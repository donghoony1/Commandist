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

ipcRenderer.on('SetIndexingState', (event: any, args: Boolean): void => {
    document.querySelector('.QuickCommand_Status')!.innerHTML = args === true ? '<i class="fad fa-spinner-third fa-spin"></i> Indexing...' : '';
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

const Execute = (EventData: Interfaces.ApplicationStdReturnInstance, IsClick: Boolean, ShiftKey: Boolean): void => {
    if(EventData === undefined || Object.keys(EventData.Event).length === 0) return;

    ipcRenderer.send('Windows.QuickCommand.execute', {
        Return: EventData,
        IsClick,
        ShiftKey
    });

    Clear();
    Hide();
}

document.addEventListener('DOMContentLoaded', (): void => {
    SearchBar_Previous = (<HTMLInputElement>document.querySelector('#SearchBar')).value;
    (document.querySelector('.QuickCommand_Results') as HTMLDivElement).style.display = 'none';

    setInterval((): void => {
        let Window = document.body;
        ipcRenderer.send('Windows.QuickCommand.resize', [Window.offsetWidth, Window.offsetHeight]);

        if(document.getElementById('SearchBar') !== document.activeElement) document.getElementById('SearchBar')!.focus();

        const Results: HTMLDivElement = (document.querySelector('.QuickCommand_Results') as HTMLDivElement);
        const ResultsClasses: Array<string> = Object.values(Results.classList);
        const IsResult: Boolean = Object.values(document.querySelectorAll('.QuickCommand_Result')).length !== 0;
        if(IsResult === false && !ResultsClasses.includes('QuickCommand_Results_hide')) Results.classList.add('QuickCommand_Results_hide');
        else if(IsResult === true && ResultsClasses.includes('QuickCommand_Results_hide')) Results.classList.remove('QuickCommand_Results_hide');
    }, 10);

    document.addEventListener('click', (event): void => {
        let Selection: Array<Interfaces.ApplicationStdReturnInstance> = [];

        const SearchResultHeader = (<any>event).path.some((Element: any) => {
            if(Element.classList !== undefined
                && 0 < Element.classList.length
                && Element.classList[0] === 'QuickCommand_Result'
                && Element.getAttribute('data-origin') !== undefined) {
                event.stopPropagation();
                event.preventDefault();
                event.returnValue = false;
                event.cancelBubble = true;

                Selection.push(JSON.parse(Element.getAttribute('data-origin')));

                return true;
            }
        });

        if(SearchResultHeader === true) Execute(Selection[0], true, event.shiftKey);
    });

    document.addEventListener('keydown', (event): void => {
        switch(event.keyCode) {
            case 13: {
                event.stopPropagation();
                event.preventDefault();  
                event.returnValue = false;
                event.cancelBubble = true;

                const EventData: Interfaces.ApplicationStdReturnInstance = JSON.parse(document.querySelectorAll('.QuickCommand_Result')[getSelection()].getAttribute('data-origin')!);

                Execute(EventData, false, event.shiftKey);

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