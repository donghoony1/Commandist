import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';

import { ipcRenderer } from 'electron';

import { Interfaces } from '../../../control/interfaces';

const SearchBar = (
    <div className="QuickCommand_SearchBar">
        <div className="QuickCommand_Logo">Commandist</div>
        <input className="QuickCommand_SearchBar_Input" id="SearchBar" type="text" placeholder="QuickCommand" />
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
        ipcRenderer.on('result', (event, args: Interfaces.ApplicationStandardReturn) => {
            this.setState({
                Results: args.map((arg) => (
                    <li className="QuickCommand_Result" key={ JSON.stringify(arg) }>
                        <div className="QuickCommand_Result_Grid">
                            <div className="QuickCommand_Result_Icon">
                                
                            </div>
                            <div className="QuickCommand_Result_Contents">
                                <h1>{ arg.Output.Default!.Subject }</h1>
                                <p>{ arg.Output.Default!.Description }</p>
                            </div>
                        </div>
                    </li>
                ))
            });
            this.forceUpdate();
        });
    }

    render() {
        return (
            <ul className="QuickCommand_Results" id="Results">
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
