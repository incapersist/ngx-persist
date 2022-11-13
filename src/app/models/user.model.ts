export interface IUser {
    id: number;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    roles: string;
  //  _roles: string[];
    token?: string;
}

export class User implements IUser {
    id: number;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    roles: string;
    private _roles: string[];
    token?: string;

    constructor(user: IUser) {
        if (user) {
            this.id = user.id;
            this.username = user.username;
            this.password = user.password;
            this.firstName = user.firstName;
            this.lastName = user.lastName;
            this.roles = user.roles;
            this.token = user.token;

            if (user.roles) {
                this._roles = user.roles.split(',');
            }
        }
    }

    hasRole(roles: string[]): boolean {
        return (this._roles.filter(x => roles.some(y => x.indexOf(y) > -1)).length > 0);
    }
}
