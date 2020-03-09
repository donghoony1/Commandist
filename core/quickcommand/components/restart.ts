import { Interfaces } from '../../control/interfaces';

const ApplicationName: string = 'restart';

const application = (MS: Interfaces.ModuleSuite, args: Array<string>): Interfaces.ApplicationStandardReturn => {
    return [
        {
            Name: ApplicationName,
            Icon: {
                FontAwesome: {
                    Icon: 'redo-alt',
                    Type: 'duotone'
                },
                DefaultIcon: {
                    IconText: ApplicationName.toUpperCase(),
                    IconColor: 'blue'
                }
            },
            Output: {
                Default: {
                    Subject: MS.Language['Commandist.v1.control.QuickCommand.v1.component.restart.return.subject'],
                    Description: MS.Language['Commandist.v1.control.QuickCommand.v1.component.restart.return.description']
                }
            },
            Event: {
                Click: [{
                    Commandist: {
                        Action: 'Restart'
                    }
                }],
                Return: [{
                    Commandist: {
                        Action: 'Restart'
                    }
                }],
                ShiftClick: [{
                    Commandist: {
                        Action: 'Restart'
                    }
                }],
                ShiftReturn: [{
                    Commandist: {
                        Action: 'Restart'
                    }
                }]
            },
            Error: false,
            DefaultApp: true
        }
    ];
};

export { application };