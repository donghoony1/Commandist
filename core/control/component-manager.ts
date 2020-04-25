import { Interfaces } from './interfaces';
import * as fs from 'fs';
import path from 'path';

class Control_ComponentManager {
    public Components: Interfaces.Components = { Default: [], Extension: [] };
    public CommandHelper: { Prefixes: Array<{ Prefix: string, ID: string, IsDefaultComponent: boolean }>, RegExps: Array<{ RegExp: RegExp, ID: string, IsDefaultComponent: boolean }>};

    constructor(Configuration: Interfaces.Configuration) {
        // Load default components.
        this.Components.Default = [
            'com.commandist.component.calculator',
            'com.commandist.component.launcher',
            'com.commandist.component.quit',
            'com.commandist.component.restart',
            'com.commandist.component.webview'
        ].map((ComponentID) => require(`../components/${ ComponentID }/${ ComponentID }`));

        // Put configuration.
        this.Components.Default.forEach((Component) => {
            const ComponentConfigurationPath: string = path.join(__dirname, '..', '..', process.env.build === 'application' ? '..' : '', 'configurations', `${ Component.Component.ID }.json`);
            let ComponentConfiguration: Interfaces.Configuration = Component.Component.Setting.Default;
            if(fs.existsSync(ComponentConfigurationPath)) ComponentConfiguration = { ...ComponentConfiguration, ...JSON.parse(fs.readFileSync(ComponentConfigurationPath, 'utf-8')) };
            Component.ConfigurationInit(ComponentConfiguration);
            console.log(Component.Configuration);
        });

        console.log(this.Components.Default.find((Component) => Component.Component.ID === 'com.commandist.component.calculator')!.Configuration);

        // Call the functions for each component initialization.
        this.Components.Default.filter((Component) => Component.Init !== undefined).forEach((Component) => Component.Init!());

        this.CommandHelper = {
            Prefixes: [
                ...this.Components.Default.map((Component) => ({
                    Prefix: Component.Component.CallSign,
                    ID: Component.Component.ID,
                    IsDefaultComponent: true
                }))
            ],
            RegExps: [
                ...this.Components.Default.filter((Component) => Component.Component.RegExp !== undefined).map((Component) => ({
                    RegExp: Component.Component.RegExp!,
                    ID: Component.Component.ID,
                    IsDefaultComponent: true
                }))
            ]
        };
    }
}

export { Control_ComponentManager };