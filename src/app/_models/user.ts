import { Address } from './address';
import { environment } from 'src/environments/environment'

export class AdminSettings {
    private static keysIn = [
        'role',
        'security_level'
    ];

    private static keysOut = [
        'role',
        'security_level'
    ]

    public role?: string;
    public security_level?: number;

    public static fromJSON(obj: Object): AdminSettings {
        var settings: AdminSettings = new AdminSettings();

        for (let i = 0; i < AdminSettings.keysIn.length; i++) {
            let key = AdminSettings.keysIn[i]
            if (obj.hasOwnProperty(key)) {
                settings[key] = obj[key];
            }
        }

        return settings;
    }

    public toJSON(): string {
        let json: Object = new Object();

        for (let i = 0; i < AdminSettings.keysOut.length; i++) {
            let key = AdminSettings.keysOut[i]
            if (this[key] != undefined) {
                json[key] = this[key];
            }
        }

        return JSON.stringify(json);
    }
}

export enum GenderEnum {
    MALE = "Male",
    FEMALE = "Female",
    NON_BINARY = "Non-Binary",
    UNDEFINED = "Undefined",
    UNSPECIFIED = "Unspecified"
}

export class User {
    private static keysIn = [
        '_id',
        'birthday',
        'username',
        'firstName',
        'lastName',
        'phone',
        'email',
        'admin',
        'billingAddress',
        'shippingAddress',
        'imagesrc',
        'image',
        'twilio',
        'gender'
    ];

    private static keysOut = [
        '_id',
        'birthday',
        'username',
        'firstName',
        'lastName',
        'phone',
        'email',
        'billingAddress',
        'shippingAddress',
        'imagesrc',
        'image',
        'twilio',
        'gender'
    ]

    public _id?: string;
    public birthday?: Date;
    public username?: string;
    public firstName?: string;
    public lastName?: string;
    public phone?: string;
    public email?: string;
    public addresses: Address[];
    public shippingAddress: string;
    public billingAddress: string;
    public admin?: boolean;
    public role?: string;
    public image?: string;
    public imageSrc?: string;
    public adminSettings?: AdminSettings;
    public gender?: GenderEnum;
    public _updatedDate?: Date;
    public _creationDate?: Date;

    public getShippingAddress(): Address {
        for (let i = 0; i < this.addresses.length; i++) {
            if (this.shippingAddress == this.addresses[i]._id) {
                return this.addresses[i];
            }
        }
        return new Address();
    }

    public getBillingAddress(): Address {
        for (let i = 0; i < this.addresses.length; i++) {
            if (this.billingAddress == this.addresses[i]._id) {
                return this.addresses[i];
            }
        }
        return new Address();
    }

    public getAddress(id: string): Address {
        for (let i = 0; i < this.addresses.length; i++) {
            if (id == this.addresses[i]._id) {
                return this.addresses[i];
            }
        }
        return new Address();
    }

    public static fromJSON(obj: Object): User {
        var user: User = new User();
        user.addresses = [];

        if (obj == undefined) {
            return user;
        }

        if ((typeof obj) == (typeof "string")) {
            user._id = obj.toString();
            return user;
        }

        for (let i = 0; i < User.keysIn.length; i++) {
            let key = User.keysIn[i]
            if (obj.hasOwnProperty(key)) {
                user[key] = obj[key];
            }
        }

        if (obj.hasOwnProperty('_updatedDate')) {
            user['_updatedDate'] = new Date(obj['_updatedDate']);
        }

        if (obj.hasOwnProperty('_creationDate')) {
            user['_creationDate'] = new Date(obj['_creationDate']);
        }

        if (obj.hasOwnProperty('addresses')) {
            var addrs: Object[] = obj['addresses'];

            for (let i = 0; i < addrs.length; i++) {
                user.addresses.push(Address.fromJSON(addrs[i]));
            }
        }

        if (obj.hasOwnProperty('adminSettings')) {
            user['adminSettings'] = AdminSettings.fromJSON(obj['adminSettings']);
        }

        return user;
    }

    public toJSON(): string {
        let json: Object = new Object();
        json['addresses'] = [];

        for (let i = 0; i < User.keysOut.length; i++) {
            let key = User.keysOut[i]
            if (this[key] != undefined) {
                json[key] = this[key];
            }
        }

        if (this._updatedDate != undefined) {
            json['_updatedDate'] = this._updatedDate.toString();
        }

        if (this._creationDate != undefined) {
            json['_creationDate'] = this._creationDate.toString();
        }

        if (this.adminSettings != undefined) {
            json['adminSettings'] = JSON.parse(this.adminSettings.toJSON());
        }


        for (let i = 0; i < this.addresses.length; i++) {
            json['addresses'].push(JSON.parse(this.addresses[i].toJSON()));
        }

        return JSON.stringify(json);
    }

    getAddAddressURL(): string {
        let url = environment.API_URL + '/user/' + this._id + '/address';

        return url;
    }

    getDownloadProfileImageURL(): string {
        let url = environment.API_URL + '/user/' + this._id + '/photo/download'

        return url;
    }

    getUploadProfileImageURL(): string {
        let url = environment.API_URL + '/user/' + this._id + '/photo/upload'

        return url;
    }
}