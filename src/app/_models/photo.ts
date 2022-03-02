import { environment } from 'src/environments/environment'

export class Photo {
    private static keys = [
        '_id',
        'filname',
        'alt',
        'user',
        'product',
        'variant'
    ];

    _id?: string;
    filename?: string;
    alt?: string;
    user?: string;
    product?: string;
    variant?: string;
    src?: string;

    public static fromJSON(obj: Object): Photo {
        var photo: Photo = new Photo();

        if (obj == undefined) {
            return photo;
        }

        if ((typeof obj) == (typeof "string")) {
            photo._id = obj.toString();
            return photo;
        }

        for (let i = 0; i < Photo.keys.length; i++) {
            let key = Photo.keys[i]
            if (obj.hasOwnProperty(key)) {
                photo[key] = obj[key];
            }
        }

        photo.src = 'assets/images/blank.png';

        return photo;
    }

    public toJSON(): string {
        let json: Object = new Object();

        for (let i = 0; i < Photo.keys.length; i++) {
            let key = Photo.keys[i]
            if (this[key] != undefined) {
                json[key] = this[key];
            }
        }

        return JSON.stringify(json);
    }
}