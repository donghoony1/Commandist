import { Interfaces } from './interfaces';
import * as fs from 'fs';

const Load = (): Interfaces.Configuration => {
    const Path: Interfaces.ConfigurationPath = {
        Directory: './configurations', 
        File: 'configuration.json'
    };
    if(!fs.existsSync(Path.Directory)) fs.mkdirSync(Path.Directory);
    if(!fs.existsSync(Path.Directory + '/' + Path.File)) fs.writeFileSync(Path.Directory + '/' + Path.File, '{}');
    const User: Interfaces.Configuration = JSON.parse(fs.readFileSync(Path.Directory + '/' + Path.File, 'utf-8'));
    const Default: Interfaces.Configuration = JSON.parse(fs.readFileSync('./core/default/configurations/configuration.json', 'utf-8'));
    let Output: Interfaces.Configuration = User;
    Object.keys(Default).forEach((Key) => {
        if(Output[Key] === undefined) Output[Key] = Default[Key];
    });
    return Output;
}

export { Load };