import { Interfaces } from '../../interfaces';

const ApplicationName: string = 'quit';

const application = (MS: Interfaces.ModuleSuite, args: Array<string>): Interfaces.ApplicationStandardReturn => {
    return [
        {
            Name: ApplicationName,
            Icon: {
                FontAwesome: {
                    Icon: 'times-circle',
                    Type: 'duotone'
                },
                DefaultIcon: {
                    IconText: ApplicationName.toUpperCase(),
                    IconColor: 'red'
                }
            },
            Output: {
                Default: {
                    Subject: MS.Language['Commandist.v1.control.QuickCommand.v1.component.quit.return.subject'],
                    Description: MS.Language['Commandist.v1.control.QuickCommand.v1.component.quit.return.description']
                }
            },
            Event: {
                Click: [{
                    Commandist: {
                        Action: 'Quit'
                    }
                }],
                Return: [{
                    Commandist: {
                        Action: 'Quit'
                    }
                }],
                ShiftClick: [{
                    Commandist: {
                        Action: 'Quit'
                    }
                }],
                ShiftReturn: [{
                    Commandist: {
                        Action: 'Quit'
                    }
                }]
            },
            Error: false,
            DefaultApp: true
        }
    ];
};

export { application };