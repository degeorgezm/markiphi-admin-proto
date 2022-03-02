import { Type, Department, Group, Size, Variant, Brand } from 'src/app/_models/sku';
import { Photo } from 'src/app/_models/photo';
import { Promotion } from 'src/app/_models/promotion';
import { User } from './user';
import { dateToString, timeToString } from './macros';

export class StockObj {
    variant: Variant;
    inventory: number[];
    skus: string[];
    upcs: string[];
    sold: number[];
    loss: number[];

    public static fromJSON(obj: Object): StockObj {
        var stockObj: StockObj = new StockObj();

        if (obj == undefined) {
            return stockObj;
        }

        if (obj.hasOwnProperty('variant')) {
            let variant: Variant = Variant.fromJSON(obj['variant']);
            stockObj['variant'] = variant;
        }

        if (obj.hasOwnProperty('inventory')) {
            stockObj['inventory'] = [];
            obj['inventory'].forEach(element => {
                stockObj['inventory'].push(element);
            })
        }

        if (obj.hasOwnProperty('skus')) {
            stockObj['skus'] = [];
            obj['skus'].forEach(element => {
                stockObj['skus'].push(element);
            })
        }

        if (obj.hasOwnProperty('upcs')) {
            stockObj['upcs'] = [];
            obj['upcs'].forEach(element => {
                stockObj['upcs'].push(element);
            })
        }

        if (obj.hasOwnProperty('sold')) {
            stockObj['sold'] = [];
            obj['sold'].forEach(element => {
                stockObj['sold'].push(element);
            })
        }

        if (obj.hasOwnProperty('loss')) {
            stockObj['loss'] = [];
            obj['loss'].forEach(element => {
                stockObj['loss'].push(element);
            })
        }

        return stockObj;
    }

    public toJSON(): string {
        let json: Object = new Object();

        if (this['variant'] != undefined) {
            json['variant'] = JSON.parse(this.variant.toJSON());
        }

        if (this['inventory'] != undefined) {
            let inventory = [];
            this['inventory'].forEach(element => {
                inventory.push(element);
            });
            json['inventory'] = inventory;
        }

        if (this['skus'] != undefined) {
            let skus = [];
            this['skus'].forEach(element => {
                skus.push(element);
            });
            json['skus'] = skus;
        }

        if (this['upcs'] != undefined) {
            let upcs = [];
            this['upcs'].forEach(element => {
                upcs.push(element);
            });
            json['upcs'] = upcs;
        }

        if (this['sold'] != undefined) {
            let sold = [];
            this['sold'].forEach(element => {
                sold.push(element);
            });
            json['sold'] = sold;
        }

        if (this['loss'] != undefined) {
            let loss = [];
            this['loss'].forEach(element => {
                loss.push(element);
            });
            json['loss'] = loss;
        }

        return JSON.stringify(json);
    }
}

export class Sale {
    private static keys = [
        '_id',
        'title',
        'description',
        'type',
        'value',
        'stackable'
    ];

    _id?: string;
    title?: string;
    description?: string;
    type?: string;
    value?: number;
    stackable?: boolean;
    start?: Date;
    end?: Date;
    user?: User;
    active?: boolean;
    _creationDate?: Date;
    _updatedDate?: Date;

    public static fromJSON(obj: Object): Sale {
        var sale: Sale = new Sale();


        console.log(obj);

        if (obj == undefined) {
            return sale;
        }

        if ((typeof obj) == (typeof "string")) {
            sale._id = obj.toString();
            return sale;
        }

        for (let i = 0; i < Sale.keys.length; i++) {
            let key = Sale.keys[i]
            if (obj.hasOwnProperty(key)) {
                sale[key] = obj[key];
            }
        }

        if (obj.hasOwnProperty('start')) {
            let dateStr = obj['start'].toString();
            let date: Date = new Date(dateStr);
            sale.start = date;

        }

        if (obj.hasOwnProperty('end')) {
            let dateStr = obj['end'].toString();
            let date: Date = new Date(dateStr);
            sale.end = date;
        }

        if ((sale.start != undefined) && (sale.end != undefined)) {
            let now = new Date();
            if ((now >= sale.start) && (now <= sale.end)) {
                sale.active = true;
            } else {
                sale.active = false;
            }
        } else {
            sale.active = false;
        }

        if (obj.hasOwnProperty('user')) {
            let user = User.fromJSON(obj['user']);
            sale.user = user;
        }

        if (obj.hasOwnProperty('_creationDate')) {
            let dateStr = obj['_creationDate'].toString();
            let date: Date = new Date(dateStr);
            sale._creationDate = date;

        }

        if (obj.hasOwnProperty('_updatedDate')) {
            let dateStr = obj['_updatedDate'].toString();
            let date: Date = new Date(dateStr);
            sale._updatedDate = date;
        }

        return sale;
    }

    public toJSON(): string {
        let json: Object = new Object();

        for (let i = 0; i < Sale.keys.length; i++) {
            let key = Sale.keys[i]
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

export class PriceChange {
    private static keys = [
        '_id',
        'price'
    ];

    _id?: string;
    price?: string;
    date?: Date;
    user?: User;
    _creationDate?: Date;
    _updatedDate?: Date;

    public static fromJSON(obj: Object): PriceChange {
        var priceChange: PriceChange = new PriceChange();

        if (obj == undefined) {
            return priceChange;
        }

        if ((typeof obj) == (typeof "string")) {
            priceChange._id = obj.toString();
            return priceChange;
        }

        for (let i = 0; i < PriceChange.keys.length; i++) {
            let key = PriceChange.keys[i]
            if (obj.hasOwnProperty(key)) {
                priceChange[key] = obj[key];
            }
        }

        if (obj.hasOwnProperty('date')) {
            let dateStr = obj['date'].toString();
            let date: Date = new Date(dateStr);
            priceChange.date = date;

        }

        if (obj.hasOwnProperty('user')) {
            let user = User.fromJSON(obj['user']);
            priceChange.user = user;
        }

        if (obj.hasOwnProperty('_creationDate')) {
            let dateStr = obj['_creationDate'].toString();
            let date: Date = new Date(dateStr);
            priceChange._creationDate = date;

        }

        if (obj.hasOwnProperty('_updatedDate')) {
            let dateStr = obj['_updatedDate'].toString();
            let date: Date = new Date(dateStr);
            priceChange._updatedDate = date;
        }

        return priceChange;
    }

    public toJSON(): string {
        let json: Object = new Object();

        for (let i = 0; i < PriceChange.keys.length; i++) {
            let key = PriceChange.keys[i]
            if (this[key] != undefined) {
                json[key] = this[key];
            }
        }

        if (this['date'] != undefined) {
            let dateStr = this['date'].toString();
            json['date'] = dateStr;

        }

        if (this['user'] != undefined) {
            json['user'] = JSON.parse(this['user'].toJSON());
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

export class Product {

    private static keys = [
        '_id',
        'title',
        'description',
        'price',
        'discount',
        'sale',
        'sold',
        'returned',
        'code',
        '_deleted'
    ];

    _id?: string;
    title?: string;
    description?: string;
    price?: number;
    discount?: number;
    sale?: boolean;
    new?: boolean;
    type?: Type;
    department?: Department;
    brand?: Brand;
    image?: Photo;
    images?: Photo[];
    sizes?: Size[];
    groups?: Group[];
    sold?: number;
    code?: string;
    returned?: number;
    tags?: string[];
    variants?: Variant[];
    stock?: StockObj[];
    sales?: Sale[];
    active_sales?: Sale[];
    promotions?: Promotion[];
    price_end?: Date;
    price_changes?: PriceChange[];
    dateString?: string;
    timeString?: string;
    _deleted?: boolean;
    _creationDate?: Date;
    _updatedDate?: Date;

    constructor() {
        this.image = new Photo();
        this.images = [];
        this.sizes = [];
        this.groups = [];
        this.tags = [];
        this.variants = [];
        this.stock = [];
        this.sales = [];
        this.active_sales = [];
        this.promotions = [];
        this.price_changes = [];
    }

    public static fromJSON(obj: Object): Product {
        var product: Product = new Product();

        if (obj == undefined) {
            return product;
        }

        if ((typeof obj) == (typeof "string")) {
            product._id = obj.toString();
            return product;
        }

        for (let i = 0; i < Product.keys.length; i++) {
            let key = Product.keys[i]
            if (obj.hasOwnProperty(key)) {
                product[key] = obj[key];
            }
        }

        if (obj.hasOwnProperty('type')) {
            let type: Type = Type.fromJSON(obj['type']);
            product['type'] = type;
        }

        if (obj.hasOwnProperty('department')) {
            let department: Department = Department.fromJSON(obj['department']);
            product['department'] = department;
        }

        if (obj.hasOwnProperty('image')) {
            let image: Photo = Photo.fromJSON(obj['image']);
            product['image'] = image;
        }

        if (obj.hasOwnProperty('brand')) {
            let brand: Brand = Brand.fromJSON(obj['brand']);
            product['brand'] = brand;
        }

        if (obj.hasOwnProperty('sizes')) {
            let sizeObj = obj['sizes'];
            let sizes: Size[] = [];
            for (let i = 0; i < sizeObj.length; i++) {
                let size: Size = Size.fromJSON(sizeObj[i]);
                sizes.push(size);
            }

            product['sizes'] = sizes;
        }

        if (obj.hasOwnProperty('sales')) {
            let salesObj = obj['sales'];
            let sales: Sale[] = [];
            for (let i = 0; i < salesObj.length; i++) {
                let sale: Sale = Sale.fromJSON(salesObj[i]);
                sales.push(sale);
            }

            product['sales'] = sales;
            product['active_sales'] = sales.filter(element => (element.active == true));
        }

        if (obj.hasOwnProperty('price_changes')) {
            let price_changeObj = obj['price_changes'];
            let price_changes: PriceChange[] = [];
            for (let i = 0; i < price_changeObj.length; i++) {
                let price_change: PriceChange = PriceChange.fromJSON(price_changeObj[i]);
                price_changes.push(price_change);
            }

            product['price_changes'] = price_changes;
        }

        if (obj.hasOwnProperty('promotions')) {
            let promotionsObj = obj['promotions'];
            let promotions: Promotion[] = [];
            for (let i = 0; i < promotionsObj.length; i++) {
                let promotion: Promotion = Promotion.fromJSON(promotionsObj[i]);
                promotions.push(promotion);
            }

            product['promotions'] = promotions;
        }

        if (obj.hasOwnProperty('images')) {
            let imagesObj = obj['images'];
            let images: Photo[] = [];
            for (let i = 0; i < imagesObj.length; i++) {
                let photo: Photo = Photo.fromJSON(imagesObj[i]);
                images.push(photo);
            }

            product['images'] = images;
        }

        if (obj.hasOwnProperty('variants')) {
            let variantsObj = obj['variants'];
            let variants: Variant[] = [];
            for (let i = 0; i < variantsObj.length; i++) {
                let variant: Variant = Variant.fromJSON(variantsObj[i]);
                variants.push(variant);
            }

            product['variants'] = variants;
        }

        if (obj.hasOwnProperty('groups')) {
            let groupObj = obj['groups'];
            let groups: Group[] = [];
            for (let i = 0; i < groupObj.length; i++) {
                let group: Group = Group.fromJSON(groupObj[i]);
                groups.push(group);
            }

            product['groups'] = groups;
        }

        if (obj.hasOwnProperty('stock')) {
            let stockObj = obj['stock'];
            let stocks: StockObj[] = [];
            for (let i = 0; i < stockObj.length; i++) {
                let stock: StockObj = StockObj.fromJSON(stockObj[i]);
                stocks.push(stock);
            }

            product['stock'] = stocks;
        }

        product['tags'] = [];
        if (obj.hasOwnProperty('tags')) {
            for (let i = 0; i < obj['tags'].length; i++) {
                product['tags'].push(obj['tags'][i]);
            }
        }

        if (obj.hasOwnProperty('_creationDate')) {
            let dateStr = obj['_creationDate'].toString();
            let date: Date = new Date(dateStr);
            product._creationDate = date;

            product.dateString = dateToString(date);
            product.timeString = timeToString(date);

        }


        if (obj.hasOwnProperty('_updatedDate')) {
            let dateStr = obj['_updatedDate'].toString();
            let date: Date = new Date(dateStr);
            product._updatedDate = date;
        }

        product.calculateDiscount();

        return product;
    }

    public toJSON(): string {
        let json: Object = new Object();

        for (let i = 0; i < Product.keys.length; i++) {
            let key = Product.keys[i]
            if (this[key] != undefined) {
                json[key] = this[key];
            }
        }

        if (this['type'] != undefined) {
            json['type'] = JSON.parse(this.type.toJSON());
        }

        if (this['department'] != undefined) {
            json['department'] = JSON.parse(this.department.toJSON());
        }

        if (this['image'] != undefined) {
            json['image'] = JSON.parse(this.image.toJSON());
        }

        if (this['sizes'] != undefined) {
            json['sizes'] = []
            for (let i = 0; i < this['sizes'].length; i++) {
                let size = JSON.parse(this['sizes'][i].toJSON());
                json['sizes'].push(size);
            }
        }

        if (this['sales'] != undefined) {
            json['sales'] = []
            for (let i = 0; i < this['sales'].length; i++) {
                let sale = JSON.parse(this['sales'][i].toJSON());
                json['sales'].push(sale);
            }
        }

        if (this['price_changes'] != undefined) {
            json['price_changes'] = []
            for (let i = 0; i < this['price_changes'].length; i++) {
                let price_change = JSON.parse(this['price_changes'][i].toJSON());
                json['price_changes'].push(price_change);
            }
        }

        if (this['promotions'] != undefined) {
            json['promotions'] = []
            for (let i = 0; i < this['promotions'].length; i++) {
                let promotion = JSON.parse(this['promotions'][i].toJSON());
                json['promotions'].push(promotion);
            }
        }

        if (this['variants'] != undefined) {
            json['variants'] = []
            for (let i = 0; i < this['variants'].length; i++) {
                let variant = JSON.parse(this['variants'][i].toJSON());
                json['variants'].push(variant);
            }
        }

        if (this['stock'] != undefined) {
            json['stock'] = []
            for (let i = 0; i < this['stock'].length; i++) {
                let stock = JSON.parse(this['stock'][i].toJSON());
                json['stock'].push(stock);
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

    public calculateDiscount() {

        let stackableDiscount: number = 0.0;
        let stackableEndDate: Date;

        let standaloneDiscount: number = 0.0;
        let standaloneEndDate: Date;

        let now = new Date();

        if (this.promotions.length > 0 || this.active_sales.length > 0) {

            // First Find Stackable Discount Amount
            let stackablePromotions: Promotion[] = this.promotions ? this.promotions.filter(element => ((element.stackable == true) && (element.minimum == 0))) : [];
            let stackableSales: Sale[] = this.active_sales ? this.active_sales.filter(element => (element.stackable == true)) : [];


            if ((stackablePromotions.length > 0 || stackableSales.length > 0)) {

                let salePercentages = stackableSales.filter(element => (element.type == 'percentage'));
                let saleAmounts = stackableSales.filter(element => (element.type == 'amount'));

                let promotionPercentages = stackablePromotions.filter(element => (element.type == 'percentage'));
                let promotionAmounts = stackablePromotions.filter(element => (element.type == 'amount'));

                let percentageDiscounts: number[] = [];
                salePercentages.forEach(element => percentageDiscounts.push(element.value));
                promotionPercentages.forEach(element => percentageDiscounts.push(element.value));
                percentageDiscounts.sort((a, b) => a - b);

                let newPrice = this.price;

                saleAmounts.forEach(element => {
                    newPrice = newPrice - element.value;
                });

                promotionAmounts.forEach(element => {
                    newPrice = newPrice - element.value;
                });

                percentageDiscounts.forEach(element => {
                    newPrice = newPrice * ((100.0 - element) / 100.0);
                });

                stackableDiscount = this.price - newPrice;

                let endDate = new Date('December 31, 2099 00:20:00');
                if (stackablePromotions) {
                    stackablePromotions.forEach(element => {
                        if (element.end < endDate) {
                            endDate = element.end;
                        }
                    });
                }

                if (stackableSales) {
                    stackableSales.forEach(element => {
                        if (element.end < endDate) {
                            endDate = element.end;
                        }
                    });
                }

                stackableEndDate = endDate;

                console.log('Stackable New Price: ' + newPrice.toFixed(2));
                console.log('Stackable Discount: ' + stackableDiscount.toFixed(2));
                console.log('Stackable End Date: ' + stackableEndDate.toString());
            }

            // First Find Stackable Discount Amount
            let standalonePromotions = this.promotions ? this.promotions.filter(element => (element.stackable == false)) : [];
            let standaloneSales = this.active_sales ? this.sales.filter(element => (element.stackable == false)) : [];

            if ((standalonePromotions.length > 0) || (standaloneSales.length > 0)) {
                let discounts = [];

                if (standalonePromotions) {
                    standalonePromotions.forEach(element => {
                        let object = {};
                        object['type'] = element.type;
                        object['end'] = element.end;
                        object['value'] = element.value;
                        discounts.push(object);
                    });
                }

                if (standaloneSales) {
                    standaloneSales.forEach(element => {
                        let object = {};
                        object['type'] = element.type;
                        object['end'] = element.end;
                        object['value'] = element.value;
                        discounts.push(object);
                    });
                }

                let index = 0;
                let high = 0.0;
                for (let i = 0; i < discounts.length; i++) {
                    let discount = discounts[i];

                    if (discount['type'] == 'amount') {
                        if (discount['value'] > high) {
                            index = i;
                            high = discount['value'];
                        }
                    } else if (discount['type'] == 'percentage') {
                        let value = discount['value'];
                        let newPrice = this.price * ((100.0 - value) / 100.0);
                        let savings = this.price - newPrice;
                        if (savings > high) {
                            index = i;
                            high = savings;
                        }
                    }
                }

                standaloneDiscount = high;
                standaloneEndDate = discounts[index]['end'];

                console.log('Standalone New Price: ' + (this.price - standaloneDiscount).toFixed(2));
                console.log('Standalone Discount: ' + standaloneDiscount.toFixed(2));
                console.log('Standalone End Date: ' + standaloneEndDate.toString());
            }

            if ((stackableDiscount > 0.0) || (standaloneDiscount > 0.0)) {

                this.sale = true;

                if (stackableDiscount > standaloneDiscount) {
                    this.discount = parseFloat(stackableDiscount.toFixed(2));
                    this.price_end = stackableEndDate;
                } else {
                    this.discount = parseFloat(standaloneDiscount.toFixed(2));
                    this.price_end = standaloneEndDate;
                }

            } else {
                this.discount = 0.0;
                this.sale = false;
            }
        } else {
            this.discount = 0.0;
            this.sale = false;
        }
    }
}