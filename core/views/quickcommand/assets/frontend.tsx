import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';

import { ipcRenderer, WebviewTag } from 'electron';

import { Interfaces } from '../../../control/interfaces';

const HexToRGBA = (hex: string): string => {
    let color: any;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        color = hex.substring(1).split('');
        if(color.length== 3) {
            color = [ color[0], color[0], color[1], color[1], color[2], color[2] ];
        }
        color = `0x${color.join('')}`;
        return `rgba(${[ (color >> 16)&255, (color >> 8)&255, color&255 ].join(',')}, 0.7)`;
    }
    throw new Error('Invalid HEX.');
}

const SearchBar: JSX.Element = (
    <div className="QuickCommand_SearchBar">
        <div className="QuickCommand_Logo">Commandist</div>
        <input className="QuickCommand_SearchBar_Input" id="SearchBar" type="text" placeholder="QuickCommand" tabIndex={0} />
    </div>
);

class Results extends React.Component {
    state = {
        Results: <Fragment></Fragment>
    }

    constructor(props: any) {
        super(props);
    }

    componentDidMount() {
        const DefaultResultElement = (data: Interfaces.ApplicationStdReturnInstance | any): JSX.Element => {
            data = data.data;
            return (
                <li className="QuickCommand_Result" data-origin={ JSON.stringify(data) }>
                    <div className="QuickCommand_Result_Grid">
                        <div className="QuickCommand_Result_Icon">
                            { Object.keys(data.Icon).includes('ImageFilePath') === true ? (
                                <div className="QuickCommand_Result_Icon_Image"></div>
                            ) : (Object.keys(data.Icon).includes('FontAwesome') === true ? (
                                <div className={ `QuickCommand_Result_Icon_FontAwesome ${ data.Icon.DefaultIcon.IconColor }` }>
                                    <i className={ `fa${ data.Icon.FontAwesome.Type.substring(0, 1) } fa-${ data.Icon.FontAwesome.Icon }` }></i>
                                </div>
                            ) : (
                                <div className={ `QuickCommand_Result_Icon_Circle ${ data.Icon.DefaultIcon.IconColor }` }>
                                    { data.Icon.DefaultIcon.IconText.substring(0, 1) }
                                </div>
                            ))}
                        </div>
                        <div className="QuickCommand_Result_Contents">
                            <h1>{ data.Output.Default!.Subject }</h1>
                            <p>{ data.Output.Default!.Description }</p>
                        </div>
                    </div>
                </li>
            );
        }
        
        const WebviewResultElement = (data: Interfaces.ApplicationStdReturnInstance | any): JSX.Element => {
            data = data.data;
            return (
                <li className="QuickCommand_Result QuickCommand_Result_Webview" data-origin={ JSON.stringify(data) }>
                    <webview src={ data.Output.Webview.URI } className="QuickCommand_Webview" preload="./assets/preload.js"></webview>
                    <div className="QuickCommand_Webview_Overview">
                        <h1>{ data.Output.Webview.URI.replace(/https?:\/\//, '').split('/')[0]}</h1>
                        <p>{ data.Output.Webview.Description }</p>
                    </div>
                </li>
            );
        }

        ipcRenderer.on('result', (event, args: Interfaces.ApplicationStandardReturn): void => {
            console.log(args);
            this.setState({
                Results: args.map((arg: Interfaces.ApplicationStdReturnInstance) => {
                    switch(Object.keys(arg.Output)[0]) {
                        case 'Default': 
                            return <DefaultResultElement key={ JSON.stringify(arg) } data={arg} />;
                        case 'Webview': 
                            return <WebviewResultElement key={ JSON.stringify(arg) } data={arg} />;
                    }
                })
            });
            this.forceUpdate();
        });
    }

    componentDidUpdate() {
        document.querySelector('.QuickCommand_Results')!.setAttribute('data-selection', '0');
        const Results = document.querySelectorAll('.QuickCommand_Result');
        if(0 < Results.length) Results[0].classList.add('pressed');
        Results.forEach((ResultLI) => {
            const ElementOrigin: Interfaces.ApplicationStdReturnInstance = JSON.parse(ResultLI.getAttribute('data-origin') || '{}');
            if(ResultLI.querySelector('.QuickCommand_Result_Icon_Image') && ElementOrigin.Icon.ImageFilePath !== undefined) {
                const IconImage: HTMLElement = ResultLI.querySelector('.QuickCommand_Result_Icon_Image') as HTMLElement;
                IconImage.setAttribute('style', `--commandist-icon-image: url('${ ElementOrigin.Icon.ImageFilePath }')`);
            }
        });
        document.querySelectorAll('.QuickCommand_Result.QuickCommand_Result_Webview').forEach((WebviewLI): void => {
            const Webview: WebviewTag = WebviewLI.querySelector('.QuickCommand_Webview') as WebviewTag;
            const Overview: HTMLElement = WebviewLI.querySelector('.QuickCommand_Webview_Overview') as HTMLElement;
            const ElementOrigin: Interfaces.ApplicationStdReturnInstance = JSON.parse(WebviewLI.getAttribute('data-origin') || '{}');

            Webview.addEventListener('did-finish-load', (): void => {
                if(Webview.getZoomLevel() !== ElementOrigin.Output.Webview!.Zoom || 1) Webview.setZoomLevel(ElementOrigin.Output.Webview!.Zoom || 1);
            });

            Webview.addEventListener('did-change-theme-color', (Element): void => {
                const color: string = HexToRGBA(Element.themeColor);
                if(color !== undefined && color !== null && (color.match(/[\d]{1,3}/g) || []).reverse().slice(2).some((part: any) => 150 < parseInt(part)) === true) Overview.style.color = '#000000';
                Overview.style.backgroundColor = color;
            });
        });
    }

    render() {
        return (
            <ul className="QuickCommand_Results" id="Results" data-selection="0">
                { this.state.Results }
            </ul>
        );
    }
}

ReactDOM.render(
    <Fragment>
        { SearchBar }
        <Results />
    </Fragment>,
    document.querySelector('.QuickCommand_main')
);