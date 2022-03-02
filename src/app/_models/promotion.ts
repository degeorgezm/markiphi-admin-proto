import { Type, Department, Group, Size, Variant, Brand } from 'src/app/_models/sku';

export class Promotion {

    private static keys = [
        '_id',
        'title',
        'description',
        'type',
        'value',
        'minimum',
        'maximum',
        'stackable',
        'free_shipping'
    ];

    _id?: string;
    title?: string;
    description?: string;
    type?: string;
    value?: number;
    minimum?: number;
    maximum?: number;
    stackable?: boolean;
    free_shipping?: boolean;
    start?: Date;
    end?: Date;
    brands?: Brand[];
    departments?: Department[];
    types?: Type[];
    variants?: Variant[];
    groups?: Group[];
    _creationDate?: Date;
    _updatedDate?: Date;
    active: Boolean;

    public static fromJSON(obj: Object): Promotion {
        var promotion: Promotion = new Promotion();

        if (obj == undefined) {
            return promotion;
        }

        if ((typeof obj) == (typeof "string")) {
            promotion._id = obj.toString();
            return promotion;
        }

        for (let i = 0; i < Promotion.keys.length; i++) {
            let key = Promotion.keys[i]
            if (obj.hasOwnProperty(key)) {
                promotion[key] = obj[key];
            }
        }

        if (obj.hasOwnProperty('start')) {
            let dateStr = obj['start'].toString();
            let date: Date = new Date(dateStr);
            promotion.start = date;

        }

        if (obj.hasOwnProperty('end')) {
            let dateStr = obj['end'].toString();
            let date: Date = new Date(dateStr);
            promotion.end = date;
        }

        if ((promotion.start != undefined) && (promotion.end != undefined)) {
            let now = new Date();
            if ((now >= promotion.start) && (now <= promotion.end)) {
                promotion.active = true;
            } else {
                promotion.active = false;
            }
        } else {
            promotion.active = false;
        }

        if (obj.hasOwnProperty('brands')) {
            let brandsObj = obj['brands'];
            let brands: Brand[] = [];
            for (let i = 0; i < brandsObj.length; i++) {
                let brand: Brand = Brand.fromJSON(brandsObj[i]);
                brands.push(brand);
            }

            promotion['brands'] = brands;
        }

        if (obj.hasOwnProperty('departments')) {
            let departmentsObj = obj['departments'];
            let departments: Department[] = [];
            for (let i = 0; i < departmentsObj.length; i++) {
                let department: Brand = Brand.fromJSON(departmentsObj[i]);
                departments.push(department);
            }

            promotion['departments'] = departments;
        }

        if (obj.hasOwnProperty('types')) {
            let typesObj = obj['types'];
            let types: Type[] = [];
            for (let i = 0; i < typesObj.length; i++) {
                let type: Type = Type.fromJSON(typesObj[i]);
                types.push(type);
            }

            promotion['types'] = types;
        }

        if (obj.hasOwnProperty('variants')) {
            let variantsObj = obj['variants'];
            let variants: Variant[] = [];
            for (let i = 0; i < variantsObj.length; i++) {
                let variant: Variant = Variant.fromJSON(variantsObj[i]);
                variants.push(variant);
            }

            promotion['variants'] = variants;
        }

        if (obj.hasOwnProperty('groups')) {
            let groupsObj = obj['groups'];
            let groups: Group[] = [];
            for (let i = 0; i < groupsObj.length; i++) {
                let group: Group = Group.fromJSON(groupsObj[i]);
                groups.push(group);
            }

            promotion['groups'] = groups;
        }

        if (obj.hasOwnProperty('_creationDate')) {
            let dateStr = obj['_creationDate'].toString();
            let date: Date = new Date(dateStr);
            promotion._creationDate = date;

        }


        if (obj.hasOwnProperty('_updatedDate')) {
            let dateStr = obj['_updatedDate'].toString();
            let date: Date = new Date(dateStr);
            promotion._updatedDate = date;
        }

        return promotion;
    }

    public toJSON(): string {
        let json: Object = new Object();

        for (let i = 0; i < Promotion.keys.length; i++) {
            let key = Promotion.keys[i]
            if (this[key] != undefined) {
                json[key] = this[key];
            }
        }

        if (this['start'] != undefined) {
            let dateStr = this['start'].toString();
            json['start'] = dateStr;

        }

        if (this['end'] != undefined) {
            let dateStr = this['end'].toString();
            json['end'] = dateStr;
        }

        if (this['brands'] != undefined) {
            json['brands'] = []
            for (let i = 0; i < this['brands'].length; i++) {
                let brand = JSON.parse(this['brands'][i].toJSON());
                json['brands'].push(brand);
            }
        }

        if (this['departments'] != undefined) {
            json['departments'] = []
            for (let i = 0; i < this['departments'].length; i++) {
                let department = JSON.parse(this['departments'][i].toJSON());
                json['departments'].push(department);
            }
        }

        if (this['types'] != undefined) {
            json['types'] = []
            for (let i = 0; i < this['types'].length; i++) {
                let type = JSON.parse(this['types'][i].toJSON());
                json['types'].push(type);
            }
        }

        if (this['variants'] != undefined) {
            json['variants'] = []
            for (let i = 0; i < this['variants'].length; i++) {
                let variant = JSON.parse(this['variants'][i].toJSON());
                json['variants'].push(variant);
            }
        }

        if (this['groups'] != undefined) {
            json['groups'] = []
            for (let i = 0; i < this['groups'].length; i++) {
                let group = JSON.parse(this['groups'][i].toJSON());
                json['groups'].push(group);
            }
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