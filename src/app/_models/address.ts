import { environment } from 'src/environments/environment'

export class Address {

    private static keys = [
        '_id',
        'name',
        'address1',
        'address2',
        'city',
        'state',
        'country',
        'phone',
        'zip',
        'user',
        'twilio',
        'instructions'
    ];

    _id?: string;
    name?: string;
    address1?: string;
    address2?: string;
    city?: string;
    state?: string;
    country?: string;
    phone?: string;
    zip?: string;
    user?: string;
    instructions?: string;
    twilio?: string;
    _creationDate?: Date;
    _updatedDate?: Date;

    public static fromJSON(obj: Object): Address {
        var address: Address = new Address();

        if (obj == undefined) {
            return address;
        }

        if ((typeof obj) == (typeof "string")) {
            address._id = obj.toString();
            return address;
        }

        for (let i = 0; i < Address.keys.length; i++) {
            let key = Address.keys[i]
            if (obj.hasOwnProperty(key)) {
                address[key] = obj[key];
            }
        }

        if (obj.hasOwnProperty('_updatedDate')) {
            address['_updatedDate'] = new Date(obj['_updatedDate']);
        }

        if (obj.hasOwnProperty('_creationDate')) {
            address['_creationDate'] = new Date(obj['_creationDate']);
        }

        if (obj.hasOwnProperty('phone') && address.twilio == undefined) {
            address.twilio = "1" + obj['phone'].replace(/[^0-9]/g, '');
        }

        return address;
    }

    public toJSON(): string {
        let json: Object = new Object();

        for (let i = 0; i < Address.keys.length; i++) {
            let key = Address.keys[i]
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

        return JSON.stringify(json);
    }

    public addBillingAddressURL(): string {
        let url = environment.API_URL + '/user/' + this.user + '/address/' + this._id + '/billing';

        return url;
    }

    public addShippingAddressURL(): string {
        let url = environment.API_URL + '/user/' + this.user + '/address/' + this._id + '/shipping';

        return url;
    }
}