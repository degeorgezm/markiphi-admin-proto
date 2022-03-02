export class Statistic {

    private static keys = [
        '_id',
        'total_sales',
        'total_order_count',
        'total_item_count',
        'product_count',
        'total_returns_requested',
        'total_returns_denied',
        'total_return_sales',
        'total_net_sales',
        'daily_sales',
        'daily_return_sales',
        'daily_returns_denied',
        'daily_returns_requested',
        'daily_item_count',
        'daily_order_count',
        'daily_net_sales',
        'user_count',
        'admin_count'
    ];

    _id?: string;
    date: Date;
    total_sales?: number;
    total_order_count?: number;
    total_item_count?: number;
    product_count?: number;
    total_returns_requested?: number;
    total_returns_denied?: number;
    total_return_sales?: number;
    total_net_sales?: number;
    daily_sales?: number;
    daily_return_sales?: number;
    daily_returns_denied?: number;
    daily_returns_requested?: number;
    daily_item_count?: number;
    daily_order_count?: number;
    daily_net_sales?: number;
    user_count?: number;
    admin_count?: number;
    _creationDate?: Date;
    _updatedDate?: Date;

    public static fromJSON(obj: Object): Statistic {
        var statistic: Statistic = new Statistic();

        if (obj == undefined) {
            return statistic;
        }

        if ((typeof obj) == (typeof "string")) {
            statistic._id = obj.toString();
            return statistic;
        }

        for (let i = 0; i < Statistic.keys.length; i++) {
            let key = Statistic.keys[i]
            if (obj.hasOwnProperty(key)) {
                statistic[key] = obj[key];
            }
        }

        if (obj.hasOwnProperty('date')) {
            statistic['date'] = new Date(obj['date']);
        }

        if (obj.hasOwnProperty('_updatedDate')) {
            statistic['_updatedDate'] = new Date(obj['_updatedDate']);
        }

        if (obj.hasOwnProperty('_creationDate')) {
            statistic['_creationDate'] = new Date(obj['_creationDate']);
        }

        return statistic;
    }

    public toJSON(): string {
        let json: Object = new Object();

        for (let i = 0; i < Statistic.keys.length; i++) {
            let key = Statistic.keys[i]
            if (this[key] != undefined) {
                json[key] = this[key];
            }
        }

        if (this.date != undefined) {
            json['date'] = this.date.toString();
        }

        if (this._updatedDate != undefined) {
            json['_updatedDate'] = this._updatedDate.toString();
        }

        if (this._creationDate != undefined) {
            json['_creationDate'] = this._creationDate.toString();
        }

        return JSON.stringify(json);
    }
}