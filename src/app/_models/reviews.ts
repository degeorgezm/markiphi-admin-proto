import { User } from './user';
import { Product } from './product';
import { dateToString } from './macros';
export class Review {

    private static keys = [
        '_id',
        'rating',
        'title',
        'review'
    ];

    _id?: string;
    rating?: number;
    title?: string;
    review?: string;
    user?: User;
    product?: Product;
    dateString?: string;
    _creationDate?: Date;
    _updatedDate?: Date;

    public static fromJSON(obj: Object): Review {
        var review: Review = new Review();

        if (obj == undefined) {
            return review;
        }

        if ((typeof obj) == (typeof "string")) {
            review._id = obj.toString();
            return review;
        }

        for (let i = 0; i < Review.keys.length; i++) {
            let key = Review.keys[i]
            if (obj.hasOwnProperty(key)) {
                review[key] = obj[key];
            }
        }

        if (obj.hasOwnProperty('user')) {
            let user = User.fromJSON(obj['user']);
            review.user = user;
        }

        if (obj.hasOwnProperty('product')) {
            let product = Product.fromJSON(obj['product']);
            review.product = product;
        }

        if (obj.hasOwnProperty('_creationDate')) {
            let date: Date = new Date(obj['_creationDate'].toString());
            review._creationDate = date;

            review.dateString = dateToString(date);
        }

        if (obj.hasOwnProperty('_updatedDate')) {
            let dateStr = obj['_updatedDate'].toString();
            let date: Date = new Date(dateStr);
            review._updatedDate = date;
        }

        return review;

    }

    public toJSON(): string {
        let json: Object = new Object();

        for (let i = 0; i < Review.keys.length; i++) {
            let key = Review.keys[i]
            if (this[key] != undefined) {
                json[key] = this[key];
            }
        }

        if (this['user'] != undefined) {
            json['user'] = JSON.parse(this['user'].toJSON());
        }

        if (this['product'] != undefined) {
            json['product'] = JSON.parse(this['product'].toJSON());
        }

        if (this['_creationDate'] != undefined) {
            let dateStr = this['_creationDate'].toString();
            json['_creationDate'] = dateStr;

        }

        if (this['_updatedDate'] != undefined) {
            let dateStr = this['_updatedDate'].toString();
            json['_updatedDate'] = dateStr;
        }

        return JSON.stringify(json);
    }

}