import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { ipcRenderer } from 'electron';
import { Interfaces } from '../../../control/interfaces';

document.addEventListener('DOMContentLoaded', () => {
    ipcRenderer.send('Windows.Setting.load');
});

class Setting extends React.Component {
    UI: Array<Interfaces.SettingUIMenu> = [];
    Configuration: Interfaces.Configuration = {};

    constructor(props: any) {
        super(props);
    }

    componentDidMount() {
        ipcRenderer.on('data', (event, args: { UI: Array<Interfaces.SettingUIMenu>, Configuration: Interfaces.Configuration }): void => {
            this.UI = args.UI;
            this.Configuration = args.Configuration;

            this.forceUpdate();
        });
    }

    componentDidUpdate() {
        document.querySelectorAll('[data-element=setting]').forEach((Element: Element): void => {
            const ID: string = Element.getAttribute('data-id') as string;
            const Type: Interfaces.SettingTypes = Element.getAttribute('data-type') as Interfaces.SettingTypes;
            
            switch(Type) {
                case 'Select': {
                    (Element as HTMLSelectElement).value = this.Configuration[ID] as string;
                    break;
                }
                case 'Toggle': {
                    (Element as HTMLDivElement).setAttribute('data-state', (this.Configuration[ID] as Boolean) === true ? 'on' : 'off');
                    break;
                }
            }
        });
    }

    ModifySetting(Type: Interfaces.SettingTypes, Event: React.ChangeEvent<HTMLSelectElement> | React.MouseEvent<HTMLDivElement, MouseEvent>, ID: string) {
        const This: Element = Event.currentTarget as Element;
        console.log(This);
        let Value: any;
    
        switch(Type) {
            case 'Select':
                Value = { Select: (This as HTMLSelectElement).value };
                break;
            case 'Toggle': 
                This.setAttribute('data-state', This.getAttribute('data-state') === 'on' ? 'off' : 'on');
                Value = { Toggle: This.getAttribute('data-state') === 'on' };
                break;
        }
    
        ipcRenderer.send('Windows.Setting.modify', { Type, ID, Value });
    }

    render() {
        return (
            <Fragment>
                <aside className="sidebar">
                    <ul className="list">
                        { this.UI.map((Divider) => (
                            <Fragment key={ JSON.stringify(Divider) }>
                                <li className="divider"><span>{ Divider.Subject }</span></li>
                                { Divider.Menus.map((Menu) => (
                                    <li className="setting" key={ JSON.stringify(Menu) }><span>{ Menu.Subject }</span></li>
                                )) }
                            </Fragment>
                        )) }
                    </ul>
                </aside>
                <main className="content">
                    { this.UI.map((Divider) => (
                        Divider.Menus.map((Menu) => (
                            <article className="menu" key={ JSON.stringify(Menu) }>
                                <header className="header">
                                    <h1 className="subject">{ Menu.Subject }</h1>
                                </header>
                                { Menu.Sections.map((Section) => (
                                    <section className="hero" key={ JSON.stringify(Section) }>
                                        <h2 className="subject">{ Section.Subject }</h2>
                                        <div className="settings">
                                            { Section.Settings.map((Setting) => (
                                                <div className="setting" key={ JSON.stringify(Setting) } data-type={ Setting.Type }>
                                                    <p className="name">{ Setting.Name }</p>
                                                    { Setting.Description !== undefined && (
                                                        <p className="description">{ Setting.Description }</p>
                                                    ) }
                                                    <div className="option-container">
                                                        { Setting.Type === 'Input' && (
                                                            <Fragment>

                                                            </Fragment>
                                                        ) }
                                                        { Setting.Type === 'Select' && (
                                                            <Fragment>
                                                                <select className="select" onChange={ (event) => this.ModifySetting(Setting.Type, event, Setting.ID) } data-element="setting" data-id={ Setting.ID } data-type={ Setting.Type } data-opts={ JSON.stringify(Setting.Definition!.Select!.Selections!) }>
                                                                    { Setting.Definition!.Select!.Selections!.map((Selection, Index) => (
                                                                        <option key={ Index } data-id={ Index }>{ Selection }</option>
                                                                    )) }
                                                                </select>
                                                            </Fragment>
                                                        ) }
                                                        { Setting.Type === 'Toggle' && (
                                                            <Fragment>
                                                                <div className="toggle" onClick={ (event) => this.ModifySetting(Setting.Type, event, Setting.ID) } data-element="setting" data-id={ Setting.ID } data-type={ Setting.Type }><div className="toggle-switcher"><div className="toggle-trigger"></div></div></div>
                                                            </Fragment>
                                                        ) }
                                                    </div>
                                                </div>
                                            )) }
                                        </div>
                                    </section>
                                )) }
                            </article>
                        ))
                    )) }
                </main>
            </Fragment>
        );
    }
}

ReactDOM.render(
    <Setting />,
    document.querySelector('.spes-setting-v1')
);