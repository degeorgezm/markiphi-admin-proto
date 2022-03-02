
export class Department {
    private static keys = [
        '_id',
        'name',
        'sku_shortcode',
        'display'
    ];

    public _id?: string;
    public name?: string;
    public sku_shortcode?: string;
    public display?: boolean;
    public brand?: Brand;

    public static fromJSON(obj: Object): Department {
        var department: Department = new Department();

        if (obj == undefined) {
            return department;
        }

        if ((typeof obj) == (typeof "string")) {
            department._id = obj.toString();
            return department;
        }

        for (let i = 0; i < Department.keys.length; i++) {
            let key = Department.keys[i]
            if (obj.hasOwnProperty(key)) {
                department[key] = obj[key];
            }
        }

        if (obj.hasOwnProperty('brand')) {
            department.brand = Brand.fromJSON(obj['brand']);
        } else {
            let brand = new Brand();
            brand._id = '';
            brand.name = 'None';
            department.brand = brand;
        }

        return department;
    }

    public toJSON(): string {
        let json: Object = new Object();

        for (let i = 0; i < Department.keys.length; i++) {
            let key = Department.keys[i]
            if (this[key] != undefined) {
                json[key] = this[key];
            }
        }

        if (this['brand'] != undefined) {
            json['brand'] = JSON.parse(this.brand.toJSON());
        }

        return JSON.stringify(json);
    }
}

export class Type {
    private static keys = [
        '_id',
        'name',
        'sku_shortcode',
        'display'
    ];

    public _id?: string;
    public name?: string;
    public sku_shortcode?: string;
    public display?: boolean;

    public static fromJSON(obj: Object): Type {
        var type: Type = new Type();

        if (obj == undefined) {
            return type;
        }

        if ((typeof obj) == (typeof "string")) {
            type._id = obj.toString();
            return type;
        }

        for (let i = 0; i < Type.keys.length; i++) {
            let key = Type.keys[i]
            if (obj.hasOwnProperty(key)) {
                type[key] = obj[key];
            }
        }

        return type;
    }

    public toJSON(): string {
        let json: Object = new Object();

        for (let i = 0; i < Type.keys.length; i++) {
            let key = Type.keys[i]
            if (this[key] != undefined) {
                json[key] = this[key];
            }
        }

        return JSON.stringify(json);
    }
}

export class Size {
    private static keys = [
        '_id',
        'name',
        'sku_shortcode'
    ];

    public _id?: string;
    public name?: string;
    public sku_shortcode?: string;

    public static fromJSON(obj: Object): Size {
        var size: Size = new Size();

        if (obj == undefined) {
            return size;
        }

        if ((typeof obj) == (typeof "string")) {
            size._id = obj.toString();
            return size;
        }

        for (let i = 0; i < Size.keys.length; i++) {
            let key = Size.keys[i]
            if (obj.hasOwnProperty(key)) {
                size[key] = obj[key];
            }
        }

        return size;
    }

    public toJSON(): string {
        let json: Object = new Object();

        for (let i = 0; i < Size.keys.length; i++) {
            let key = Size.keys[i]
            if (this[key] != undefined) {
                json[key] = this[key];
            }
        }

        return JSON.stringify(json);
    }
}

export class Brand {
    private static keys = [
        '_id',
        'name',
        'sku_shortcode',
        'display'
    ];

    public _id?: string;
    public name?: string;
    public sku_shortcode?: string;
    public display?: boolean;

    public static fromJSON(obj: Object): Brand {
        var brand: Brand = new Brand();

        if (obj == undefined) {
            return brand;
        }

        if ((typeof obj) == (typeof "string")) {
            brand._id = obj.toString();
            return brand;
        }

        for (let i = 0; i < Brand.keys.length; i++) {
            let key = Brand.keys[i]
            if (obj.hasOwnProperty(key)) {
                brand[key] = obj[key];
            }
        }

        return brand;
    }

    public toJSON(): string {
        let json: Object = new Object();

        for (let i = 0; i < Brand.keys.length; i++) {
            let key = Brand.keys[i]
            if (this[key] != undefined) {
                json[key] = this[key];
            }
        }

        return JSON.stringify(json);
    }
}

export class Variant {
    private static keys = [
        '_id',
        'name',
        'sku_shortcode',
        'image',
        'display'

    ];

    public _id?: string;
    public name?: string;
    public sku_shortcode?: string;
    public image: string;
    //public brand?: Brand;
    public display?: boolean;

    public static fromJSON(obj: Object): Variant {
        var variant: Variant = new Variant();

        if (obj == undefined) {
            return variant;
        }

        if ((typeof obj) == (typeof "string")) {
            variant._id = obj.toString();
            return variant;
        }

        for (let i = 0; i < Variant.keys.length; i++) {
            let key = Variant.keys[i]
            if (obj.hasOwnProperty(key)) {
                variant[key] = obj[key];
            }
        }

        /* if (obj.hasOwnProperty('brand')) {
            variant.brand = Brand.fromJSON(obj['brand']);
        } */

        return variant;
    }

    public toJSON(): string {
        let json: Object = new Object();

        for (let i = 0; i < Variant.keys.length; i++) {
            let key = Variant.keys[i]
            if (this[key] != undefined) {
                json[key] = this[key];
            }
        }

        /* if (this['brand'] != undefined) {
            json['brand'] = JSON.parse(this.brand.toJSON());
        } */

        return JSON.stringify(json);
    }
}

export class Group {
    private static keys = [
        '_id',
        'name',
        'sku_shortcode',
        'display'
    ];

    public _id?: string;
    public name?: string;
    public sku_shortcode?: string;
    public display?: boolean;

    public static fromJSON(obj: Object): Group {
        var group: Group = new Group();

        if (obj == undefined) {
            return group;
        }

        if ((typeof obj) == (typeof "string")) {
            group._id = obj.toString();
            return group;
        }

        for (let i = 0; i < Group.keys.length; i++) {
            let key = Group.keys[i]
            if (obj.hasOwnProperty(key)) {
                group[key] = obj[key];
            }
        }

        return group;
    }

    public toJSON(): string {
        let json: Object = new Object();

        for (let i = 0; i < Group.keys.length; i++) {
            let key = Group.keys[i]
            if (this[key] != undefined) {
                json[key] = this[key];
            }
        }

        return JSON.stringify(json);
    }
}