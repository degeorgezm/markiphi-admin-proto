import { User } from 'src/app/_models/user';
import { Address } from 'src/app/_models/address';
import { Size, Variant } from 'src/app/_models/sku';
import { Product, Sale } from 'src/app/_models/product';
import { Promotion } from 'src/app/_models/promotion';
import { dateToString, timeToString } from './macros';

export enum StockStatusEnum {
    WISHLIST = 'Wishlist',
    BAG = 'Bag',
    PURCHASED = 'Purchased',
    WAITLISTED = 'Waitlisted',
    PROCESSING = 'Processing',
    SHIPPED = 'Shipped',
    DELIVERED = 'Delivered',
    REFUNDED = 'Refunded',
    RETURN_REQUESTED = 'Return Requested',
    RETURN_APPROVED = 'Return Approved',
    RETURN_DENIED = 'Return Denied',
    RETURN_SHIPPED = 'Return Shipped',
    RETURN_RECEIVED = 'Return Received',
    RETURN_PROCESSING = 'Return Processing',
    RETURNED = 'Returned'
}

export function isReturnEnum(str: string) {
    if (str == StockStatusEnum.RETURN_REQUESTED ||
        str == StockStatusEnum.RETURN_APPROVED ||
        str == StockStatusEnum.RETURN_DENIED ||
        str == StockStatusEnum.RETURN_SHIPPED ||
        str == StockStatusEnum.RETURN_RECEIVED ||
        str == StockStatusEnum.RETURN_PROCESSING ||
        str == StockStatusEnum.RETURNED) {
        return true;
    } else {
        return false;
    }
}

export function isReturnDecided(str: string) {
    if (str == StockStatusEnum.RETURN_APPROVED ||
        str == StockStatusEnum.RETURN_DENIED ||
        str == StockStatusEnum.RETURN_SHIPPED ||
        str == StockStatusEnum.RETURN_RECEIVED ||
        str == StockStatusEnum.RETURN_PROCESSING ||
        str == StockStatusEnum.RETURNED) {
        return true;
    } else {
        return false;
    }
}

export function isReturnStarted(str: string) {
    if (str == StockStatusEnum.RETURN_REQUESTED ||
        str == StockStatusEnum.RETURN_DENIED ||
        str == StockStatusEnum.RETURN_APPROVED ||
        str == StockStatusEnum.RETURN_SHIPPED ||
        str == StockStatusEnum.RETURN_RECEIVED ||
        str == StockStatusEnum.RETURN_PROCESSING) {
        return true;
    } else {
        return false;
    }
}

export function isReturnPending(str: string) {
    if (str == StockStatusEnum.RETURN_REQUESTED ||
        str == StockStatusEnum.RETURN_APPROVED ||
        str == StockStatusEnum.RETURN_SHIPPED ||
        str == StockStatusEnum.RETURN_RECEIVED ||
        str == StockStatusEnum.RETURN_PROCESSING) {
        return true;
    } else {
        return false;
    }
}

export function isReturnDenied(str: string) {
    if (str == StockStatusEnum.RETURN_DENIED) {
        return true;
    } else {
        return false;
    }
}

export function isReturnCompleted(str: string) {
    if (str == StockStatusEnum.RETURNED) {
        return true;
    } else {
        return false;
    }
}

export function isReturnValid(str: string) {
    if (str == StockStatusEnum.RETURN_REQUESTED ||
        str == StockStatusEnum.RETURN_APPROVED ||
        str == StockStatusEnum.RETURN_SHIPPED ||
        str == StockStatusEnum.RETURN_RECEIVED ||
        str == StockStatusEnum.RETURN_PROCESSING ||
        str == StockStatusEnum.RETURNED) {
        return true;
    } else {
        return false;
    }
}

export function isNeedsToBeProcessed(str: string) {
    if (str == StockStatusEnum.RETURN_RECEIVED) {
        return true;
    } else {
        return false;
    }
}

export function isNeedsToBeApproved(str: string) {
    if (str == StockStatusEnum.RETURN_REQUESTED) {
        return true;
    } else {
        return false;
    }
}


export class StockStatus {
    private static keys = [
        '_id',
        'status'
    ]

    _id?: string;
    date?: Date;
    status?: StockStatusEnum;
    user?: User;
    _creationDate?: Date;
    _updatedDate?: Date;

    public static fromJSON(obj: Object): StockStatus {
        var stockStatus: StockStatus = new StockStatus();

        if (obj == undefined) {
            return stockStatus;
        }

        if ((typeof obj) == (typeof "string")) {
            stockStatus._id = obj.toString();
            return stockStatus;
        }

        for (let i = 0; i < StockStatus.keys.length; i++) {
            let key = StockStatus.keys[i]
            if (obj.hasOwnProperty(key)) {
                stockStatus[key] = obj[key];
            }
        }

        if (obj.hasOwnProperty('user')) {
            let user: User = User.fromJSON(obj['user']);
            stockStatus['user'] = user;
        }

        if (obj.hasOwnProperty('date')) {
            let dateStr = obj['date'].toString();
            let date: Date = new Date(dateStr);
            stockStatus.date = date;

        }

        if (obj.hasOwnProperty('_creationDate')) {
            let dateStr = obj['_creationDate'].toString();
            let date: Date = new Date(dateStr);
            stockStatus._creationDate = date;

        }


        if (obj.hasOwnProperty('_updatedDate')) {
            let dateStr = obj['_updatedDate'].toString();
            let date: Date = new Date(dateStr);
            stockStatus._updatedDate = date;
        }

        return stockStatus;
    }

    public toJSON(): string {
        let json: Object = new Object();

        for (let i = 0; i < StockStatus.keys.length; i++) {
            let key = StockStatus.keys[i]
            if (this[key] != undefined) {
                json[key] = this[key];
            }
        }

        if (this['user'] != undefined) {
            json['user'] = JSON.parse(this.user.toJSON());
        }

        if (this['date'] != undefined) {
            json['date'] = this['date'].toString();
        }

        if (this['_creationDate']) {
            json['_creationDate'] = this['_creationDate'].toString();

        }

        if (this['_updatedDate'] != undefined) {
            json['_updatedDate'] = this['_updatedDate'].toString();
        }

        return JSON.stringify(json);
    }

}

export class Stock {

    private static keys = [
        '_id',
        'sku',
        'quantity'
    ];

    _id?: string;
    product?: Product;
    size?: Size;
    variant?: Variant;
    sku?: string;
    user?: User;
    quantity?: number;
    status?: StockStatus[];
    _creationDate?: Date;
    _updatedDate?: Date;

    public static fromJSON(obj: Object): Stock {
        var stock: Stock = new Stock();

        if (obj == undefined) {
            return stock;
        }

        if ((typeof obj) == (typeof "string")) {
            stock._id = obj.toString();
            return stock;
        }

        for (let i = 0; i < Stock.keys.length; i++) {
            let key = Stock.keys[i]
            if (obj.hasOwnProperty(key)) {
                stock[key] = obj[key];
            }
        }

        if (obj.hasOwnProperty('product')) {
            let product: Product = Product.fromJSON(obj['product']);
            stock['product'] = product;
        }

        if (obj.hasOwnProperty('size')) {
            let size: Size = Size.fromJSON(obj['size']);
            stock['size'] = size;
        }

        if (obj.hasOwnProperty('variant')) {
            let variant: Variant = Variant.fromJSON(obj['variant']);
            stock['variant'] = variant;
        }

        if (obj.hasOwnProperty('user')) {
            let user: User = User.fromJSON(obj['user']);
            stock['user'] = user;
        } else {
            console.log(obj['user'])
        }

        if (obj.hasOwnProperty('status')) {
            let statusObj = obj['status'];
            let _status: StockStatus[] = [];
            for (let i = 0; i < statusObj.length; i++) {
                let status: StockStatus = StockStatus.fromJSON(statusObj[i]);
                _status.push(status);
            }

            stock['status'] = _status;
        }

        if (obj.hasOwnProperty('_creationDate')) {
            let dateStr = obj['_creationDate'].toString();
            let date: Date = new Date(dateStr);
            stock['_creationDate'] = date;

        }


        if (obj.hasOwnProperty('_updatedDate')) {
            let dateStr = obj['_updatedDate'].toString();
            let date: Date = new Date(dateStr);
            stock['_updatedDate'] = date;
        }

        stock['new'] = true;

        return stock;
    }

    public toJSON(): string {
        let json: Object = new Object();

        for (let i = 0; i < Stock.keys.length; i++) {
            let key = Stock.keys[i]
            if (this[key] != undefined) {
                json[key] = this[key];
            }
        }

        if (this['product'] != undefined) {
            json['product'] = JSON.parse(this.product.toJSON());
        }

        if (this['size'] != undefined) {
            json['size'] = JSON.parse(this.size.toJSON());
        }

        if (this['variant'] != undefined) {
            json['variant'] = JSON.parse(this.variant.toJSON());
        }

        if (this['user'] != undefined) {
            json['user'] = JSON.parse(this.user.toJSON());
        }

        if (this['status'] != undefined) {
            json['status'] = []
            for (let i = 0; i < this['status'].length; i++) {
                let status = JSON.parse(this['status'][i].toJSON());
                json['status'].push(status);
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

    public get getTitle(): string {
        let string = this.product.title;

        if (this.product.variants.length > 1) {
            string += ", " + this.variant.name;
        }

        if (this.product.sizes.length > 1) {
            string += ", Size: " + this.size.name;
        }

        return string;
    }
}

export class Bag {
    private static keys = [
        '_id'
    ];

    _id?: string;
    user?: User;
    items?: Stock[];

    constructor() {
        this._id = '';
        this.user = new User();
        this.items = [];
    }

    public static fromJSON(obj: Object): Bag {
        var bag: Bag = new Bag();

        if (obj == undefined) {
            return bag;
        }

        if ((typeof obj) == (typeof "string")) {
            bag._id = obj.toString();
            return bag;
        }

        for (let i = 0; i < Bag.keys.length; i++) {
            let key = Bag.keys[i]
            if (obj.hasOwnProperty(key)) {
                bag[key] = obj[key];
            }
        }

        if (obj.hasOwnProperty('user')) {
            let user: User = User.fromJSON(obj['user']);
            bag['user'] = user;
        }

        if (obj.hasOwnProperty('items')) {
            let itemsObj = obj['items'];
            let items: Stock[] = [];
            for (let i = 0; i < itemsObj.length; i++) {
                let item: Stock = Stock.fromJSON(itemsObj[i]);
                items.push(item);
            }

            bag['items'] = items;
        }

        if (obj.hasOwnProperty('_creationDate')) {
            let dateStr = obj['_creationDate'].toString();
            let date: Date = new Date(dateStr);
            bag['_creationDate'] = date;

        }


        if (obj.hasOwnProperty('_updatedDate')) {
            let dateStr = obj['_updatedDate'].toString();
            let date: Date = new Date(dateStr);
            bag['_updatedDate'] = date;
        }

        return bag;
    }

    public toJSON(): string {
        let json: Object = new Object();

        for (let i = 0; i < Bag.keys.length; i++) {
            let key = Bag.keys[i]
            if (this[key] != undefined) {
                json[key] = this[key];
            }
        }

        if (this['user'] != undefined) {
            json['user'] = JSON.parse(this.user.toJSON());
        }

        if (this['items'] != undefined) {
            json['items'] = []
            for (let i = 0; i < this['items'].length; i++) {
                let item = JSON.parse(this['items'][i].toJSON());
                json['items'].push(status);
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

    public getSubTotal(): number {
        let total: number = 0;

        for (let i = 0; i < this.items.length; i++) {
            let subtotal = this.items[i].product.price * this.items[i].quantity;
            if (this.items[i].product.sale) {
                subtotal -= this.items[i].product.discount * this.items[i].quantity;
            }
            total += subtotal;
        }

        return total;
    }

    public getTotalDiscount(): number {
        let total: number = 0;
        for (let i = 0; i < this.items.length; i++) {
            let sub = 0.0;
            if (this.items[i].product.sale) {
                sub = this.items[i].product.discount * this.items[i].quantity;
            }
            total += sub;
        }

        return total;
    }

    public getTotalItems(): number {
        let total: number = 0;

        for (let i = 0; i < this.items.length; i++) {
            total += this.items[i].quantity;
        }

        return total;
    }

}

export class Wishlist {
    private static keys = [
        '_id'
    ];

    _id?: string;
    user?: User;
    items?: Stock[];

    constructor() {
        this._id = '';
        this.user = new User();
        this.items = [];
    }

    public static fromJSON(obj: Object): Wishlist {
        var wishlist: Wishlist = new Wishlist();

        if (obj == undefined) {
            return wishlist;
        }

        if ((typeof obj) == (typeof "string")) {
            wishlist._id = obj.toString();
            return wishlist;
        }

        for (let i = 0; i < Wishlist.keys.length; i++) {
            let key = Wishlist.keys[i]
            if (obj.hasOwnProperty(key)) {
                wishlist[key] = obj[key];
            }
        }

        if (obj.hasOwnProperty('user')) {
            let user: User = User.fromJSON(obj['user']);
            wishlist['user'] = user;
        }

        if (obj.hasOwnProperty('items')) {
            let itemsObj = obj['items'];
            let items: Stock[] = [];
            for (let i = 0; i < itemsObj.length; i++) {
                let item: Stock = Stock.fromJSON(itemsObj[i]);
                items.push(item);
            }

            wishlist['items'] = items;
        } else {
            wishlist['items'] = [];
        }

        if (obj.hasOwnProperty('_creationDate')) {
            let dateStr = obj['_creationDate'].toString();
            let date: Date = new Date(dateStr);
            wishlist['_creationDate'] = date;

        }


        if (obj.hasOwnProperty('_updatedDate')) {
            let dateStr = obj['_updatedDate'].toString();
            let date: Date = new Date(dateStr);
            wishlist['_updatedDate'] = date;
        }

        return wishlist;
    }

    public toJSON(): string {
        let json: Object = new Object();

        for (let i = 0; i < Wishlist.keys.length; i++) {
            let key = Wishlist.keys[i]
            if (this[key] != undefined) {
                json[key] = this[key];
            }
        }

        if (this['user'] != undefined) {
            json['user'] = JSON.parse(this.user.toJSON());
        }

        if (this['items'] != undefined) {
            json['items'] = []
            for (let i = 0; i < this['items'].length; i++) {
                let item = JSON.parse(this['items'][i].toJSON());
                json['items'].push(status);
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

    public getSubTotal(): number {
        let total: number = 0;

        for (let i = 0; i < this.items.length; i++) {
            let subtotal = this.items[i].product.price * this.items[i].quantity;
            if (this.items[i].product.sale) {
                subtotal -= this.items[i].product.discount * this.items[i].quantity;
            }
            total += subtotal;
        }

        return total;
    }

    public getTotalDiscount(): number {
        let total: number = 0;
        for (let i = 0; i < this.items.length; i++) {
            let sub = 0.0;
            if (this.items[i].product.sale) {
                sub = this.items[i].product.discount * this.items[i].quantity;
            }
            total += sub;
        }

        return total;
    }

    public getTotalItems(): number {
        let total: number = 0;

        for (let i = 0; i < this.items.length; i++) {
            total += this.items[i].quantity;
        }

        return total;
    }

}

export enum OrderStatusEnum {
    PURCHASED = 'Purchased',
    PROCESSING = 'Processing',
    WAITLISTED = 'Waitlisted',
    DROPPED = 'Dropped',
    CANCELLED = 'Cancelled',
    SHIPPED = 'Shipped',
    DELIVERED = 'Delivered'
}


export class OrderStatus {
    private static keys = [
        '_id',
        'status',
        'description'
    ]

    _id?: string;
    date?: Date;
    status?: OrderStatusEnum;
    description?: string;
    user?: User;
    _creationDate?: Date;
    _updatedDate?: Date;

    public static fromJSON(obj: Object): OrderStatus {
        var orderStatus: OrderStatus = new OrderStatus();

        if (obj == undefined) {
            return orderStatus;
        }

        if ((typeof obj) == (typeof "string")) {
            orderStatus._id = obj.toString();
            return orderStatus;
        }

        for (let i = 0; i < OrderStatus.keys.length; i++) {
            let key = OrderStatus.keys[i]
            if (obj.hasOwnProperty(key)) {
                orderStatus[key] = obj[key];
            }
        }

        if (obj.hasOwnProperty('user')) {
            let user: User = User.fromJSON(obj['user']);
            orderStatus['user'] = user;
        }

        if (obj.hasOwnProperty('date')) {
            let dateStr = obj['date'].toString();
            let date: Date = new Date(dateStr);
            orderStatus.date = date;

        }

        if (obj.hasOwnProperty('_creationDate')) {
            let dateStr = obj['_creationDate'].toString();
            let date: Date = new Date(dateStr);
            orderStatus._creationDate = date;

        }


        if (obj.hasOwnProperty('_updatedDate')) {
            let dateStr = obj['_updatedDate'].toString();
            let date: Date = new Date(dateStr);
            orderStatus._updatedDate = date;
        }

        return orderStatus;
    }

    public toJSON(): string {
        let json: Object = new Object();

        for (let i = 0; i < OrderStatus.keys.length; i++) {
            let key = OrderStatus.keys[i]
            if (this[key] != undefined) {
                json[key] = this[key];
            }
        }

        if (this['user'] != undefined) {
            json['user'] = JSON.parse(this.user.toJSON());
        }

        if (this['date'] != undefined) {
            let dateStr = this['date'].toString();
            json['date'] = dateStr;
        }

        if (this['_creationDate']) {
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

enum PackageStatusEnum {
    PROCESSING = 'Processing',
    SHIPPED = 'Shipped',
    DELIVERED = 'Delivered'
}


export class PackageStatus {
    private static keys = [
        '_id',
        'status'
    ]

    _id?: string;
    date?: Date;
    status?: PackageStatusEnum;
    user?: User;
    _creationDate?: Date;
    _updatedDate?: Date;

    public static fromJSON(obj: Object): PackageStatus {
        var packageStatus: PackageStatus = new PackageStatus();

        if (obj == undefined) {
            return packageStatus;
        }

        if ((typeof obj) == (typeof "string")) {
            packageStatus._id = obj.toString();
            return packageStatus;
        }

        for (let i = 0; i < PackageStatus.keys.length; i++) {
            let key = PackageStatus.keys[i]
            if (obj.hasOwnProperty(key)) {
                packageStatus[key] = obj[key];
            }
        }

        if (obj.hasOwnProperty('user')) {
            let user: User = User.fromJSON(obj['user']);
            packageStatus['user'] = user;
        }

        if (obj.hasOwnProperty('date')) {
            let dateStr = obj['date'].toString();
            let date: Date = new Date(dateStr);
            packageStatus.date = date;

        }

        if (obj.hasOwnProperty('_creationDate')) {
            let dateStr = obj['_creationDate'].toString();
            let date: Date = new Date(dateStr);
            packageStatus._creationDate = date;

        }


        if (obj.hasOwnProperty('_updatedDate')) {
            let dateStr = obj['_updatedDate'].toString();
            let date: Date = new Date(dateStr);
            packageStatus._updatedDate = date;
        }

        return packageStatus;
    }

    public toJSON(): string {
        let json: Object = new Object();

        for (let i = 0; i < PackageStatus.keys.length; i++) {
            let key = PackageStatus.keys[i]
            if (this[key] != undefined) {
                json[key] = this[key];
            }
        }

        if (this['user'] != undefined) {
            json['user'] = JSON.parse(this.user.toJSON());
        }

        if (this['date'] != undefined) {
            let dateStr = this['date'].toString();
            json['date'] = dateStr;
        }

        if (this['_creationDate']) {
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

interface AmountMoney {
    amount: string;
    currency: string;
}

interface ApprovedMoney {
    amount: string;
    currency: string;
}

interface Card {
    bin: string;
    cardBrand: string;
    cardType: string;
    expMonth: string;
    expYear: string;
    fingerprint: string;
    last4: string;
    prepaidType: string;
}

interface CardPaymentTimeline {
    authorizedAt: Date,
    capturedAt: Date
}

interface CardDetails {
    avsStatus: string;
    card: Card;
    cardPaymentTimeline: CardPaymentTimeline;
    cvvStatus: string;
    entryMethod: string;
    statementDescription: string;
    status: string;
}

interface RiskEvaluation {
    createdAt: Date;
    riskLevel: string;
}

interface TotalMoney {
    amount: string;
    currency: string;
}

interface ProcessingFee {
    effectiveAt: Date;
    type: string;
    amountMoney: AmountMoney;
}

export class Refund {
    private static keys = [
        '_id',
        'id',
        'status',
        'locationId',
        'paymentId',
        'orderId'
    ]

    _id?: string;
    id?: string;
    status?: string;
    locationId?: string;
    paymentId?: string;
    orderId?: string;
    amountMoney?: AmountMoney;
    processingFee?: ProcessingFee[];
    createdAt?: Date;
    updatedAt?: Date;
    _creationDate?: Date;
    _updatedDate?: Date;

    constructor() {
        this.processingFee = [];
    }

    public static fromJSON(obj: Object): Refund {
        var refundStub: Refund = new Refund();

        if (obj == undefined) {
            return refundStub;
        }

        if ((typeof obj) == (typeof "string")) {
            refundStub._id = obj.toString();
            return refundStub;
        }

        for (let i = 0; i < Refund.keys.length; i++) {
            let key = Refund.keys[i]
            if (obj.hasOwnProperty(key)) {
                refundStub[key] = obj[key];
            }
        }

        if (obj.hasOwnProperty('amountMoney')) {
            let amountMoney: AmountMoney = obj['amountMoney'];
            refundStub.amountMoney = amountMoney;
        }

        if (obj.hasOwnProperty('processingFee')) {
            let processingFeeObj: ProcessingFee[] = obj['processingFee'];

            for (let i = 0; i < processingFeeObj.length; i += 1) {
                let processingFee: ProcessingFee = processingFeeObj[i];
                if (obj['processingFee'].hasOwnProperty('effectiveAt')) {
                    let dateStr = obj['processingFee']['effectiveAt'];
                    let date: Date = new Date(dateStr);
                    processingFee.effectiveAt = date;
                }
                refundStub.processingFee.push(processingFee);
            }

        }

        if (obj.hasOwnProperty('createdAt')) {
            let dateStr = obj['createdAt'].toString();
            let date: Date = new Date(dateStr);
            refundStub['createdAt'] = date;

        }

        if (obj.hasOwnProperty('updatedAt')) {
            let dateStr = obj['updatedAt'].toString();
            let date: Date = new Date(dateStr);
            refundStub['updatedAt'] = date;
        }

        if (obj.hasOwnProperty('_creationDate')) {
            let dateStr = obj['_creationDate'].toString();
            let date: Date = new Date(dateStr);
            refundStub['_creationDate'] = date;

        }

        if (obj.hasOwnProperty('_updatedDate')) {
            let dateStr = obj['_updatedDate'].toString();
            let date: Date = new Date(dateStr);
            refundStub['_updatedDate'] = date;
        }

        return refundStub;
    }

    public toJSON(): string {
        let json: Object = new Object();

        for (let i = 0; i < Refund.keys.length; i++) {
            let key = Refund.keys[i]
            if (this[key] != undefined) {
                json[key] = this[key];
            }
        }

        if (this['amountMoney'] != undefined) {
            let amountMoney: Object = new Object();
            let _amountMoney: AmountMoney = this['amountMoney'];

            amountMoney['amount'] = _amountMoney.amount != undefined ? _amountMoney.amount : "";
            amountMoney['currency'] = _amountMoney.currency != undefined ? _amountMoney.currency : "";

            json['amountMoney'] = amountMoney;
        }

        if (this['processingFee'] != undefined) {

            json['processingFee'] = [];

            for (let i = 0; i < this['processingFee'].length; i += 1) {
                let processingFee: Object = new Object();
                let _processingFee: ProcessingFee = this['processingFee'][i];

                processingFee['effectiveAt'] = _processingFee.effectiveAt != undefined ? _processingFee.effectiveAt : "";
                processingFee['type'] = _processingFee.type != undefined ? _processingFee.type : "";

                if (processingFee['amountMoney'] != undefined) {
                    let amountMoney: Object = new Object();
                    let _amountMoney: AmountMoney = processingFee['amountMoney'];

                    amountMoney['amount'] = _amountMoney.amount != undefined ? _amountMoney.amount : "";
                    amountMoney['currency'] = _amountMoney.currency != undefined ? _amountMoney.currency : "";

                    processingFee['amountMoney'] = amountMoney;
                }
                json['processingFee'].push(processingFee);
            }
        }

        if (this['createdAt'] != undefined) {
            let dateStr = this['createdAt'].toString();
            json['createdAt'] = dateStr;

        }

        if (this['updatedAt'] != undefined) {
            let dateStr = this['updatedAt'].toString();
            json['updatedAt'] = dateStr;
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

export class Payment {
    private static keys = [
        '_id',
        'id',
        'delayAction',
        'delayDuration',
        'locationId',
        'orderId',
        'receiptNumber',
        'receiptUrl',
        'sourceType',
        'status',
        'versionToken'
    ]

    _id?: string;
    id?: string;
    delayAction?: string;
    delayDuration?: string;
    locationId?: string;
    orderId?: string;
    receiptNumber?: string;
    receiptUrl?: string;
    sourceType?: string;
    status?: string;
    versionToken?: string;
    amountMoney?: AmountMoney;
    approvedMoney?: ApprovedMoney;
    cardDetails?: CardDetails;
    riskEvaluation?: RiskEvaluation;
    totalMoney?: TotalMoney;
    _creationDate?: Date;
    _updatedDate?: Date;

    public static fromJSON(obj: Object): Payment {
        var payment: Payment = new Payment();

        if (obj == undefined) {
            return payment;
        }

        if ((typeof obj) == (typeof "string")) {
            payment._id = obj.toString();
            return payment;
        }

        for (let i = 0; i < Payment.keys.length; i++) {
            let key = Payment.keys[i]
            if (obj.hasOwnProperty(key)) {
                payment[key] = obj[key];
            }
        }

        if (obj.hasOwnProperty('amountMoney')) {
            let amountMoney: AmountMoney = obj['amountMoney'];
            payment.amountMoney = amountMoney;
        }

        if (obj.hasOwnProperty('approvedMoney')) {
            let approvedMoney: ApprovedMoney = obj['approvedMoney'];
            payment.approvedMoney = approvedMoney;
        }

        if (obj.hasOwnProperty('cardDetails')) {
            let cardDetails: CardDetails = obj['cardDetails'];

            payment.cardDetails = cardDetails;
        }

        if (obj.hasOwnProperty('riskEvaluation')) {
            let riskEvaluation: RiskEvaluation = obj['riskEvaluation']['createdAt'];;

            payment.riskEvaluation = riskEvaluation;
        }

        if (obj.hasOwnProperty('totalMoney')) {
            let totalMoney: TotalMoney = obj['totalMoney'];

            payment.totalMoney = totalMoney;
        }

        if (obj.hasOwnProperty('_creationDate')) {
            let dateStr = obj['_creationDate'].toString();
            let date: Date = new Date(dateStr);
            payment['_creationDate'] = date;

        }

        if (obj.hasOwnProperty('_updatedDate')) {
            let dateStr = obj['_updatedDate'].toString();
            let date: Date = new Date(dateStr);
            payment['_updatedDate'] = date;
        }

        return payment;
    }

    public toJSON(): string {
        let json: Object = new Object();

        for (let i = 0; i < Payment.keys.length; i++) {
            let key = Payment.keys[i]
            if (this[key] != undefined) {
                json[key] = this[key];
            }
        }

        if (this['amountMoney'] != undefined) {
            let amountMoney: Object = new Object();
            let _amountMoney: AmountMoney = this['amountMoney'];

            amountMoney['amount'] = _amountMoney.amount != undefined ? _amountMoney.amount : "";
            amountMoney['currency'] = _amountMoney.currency != undefined ? _amountMoney.currency : "";

            json['amountMoney'] = amountMoney;
        }

        if (this['approvedMoney'] != undefined) {
            let approvedMoney: Object = new Object();
            let _approvedMoney: ApprovedMoney = this['approvedMoney'];

            approvedMoney['amount'] = _approvedMoney.amount != undefined ? _approvedMoney.amount : "";
            approvedMoney['currency'] = _approvedMoney.currency != undefined ? _approvedMoney.currency : "";

            json['approvedMoney'] = approvedMoney;
        }

        if (this['cardDetails'] != undefined) {
            let cardDetails: Object = new Object();
            let _cardDetails: CardDetails = this['cardDetails'];

            if (_cardDetails.card != undefined) {
                let card: Object = new Object();
                let _card: Card = _cardDetails.card;

                card['bin'] = _card.bin != undefined ? _card.bin : "";
                card['cardBrand'] = _card.cardBrand != undefined ? _card.cardBrand : "";
                card['cardType'] = _card.cardType != undefined ? _card.cardType : "";
                card['expMonth'] = _card.expMonth != undefined ? _card.expMonth : "";
                card['expYear'] = _card.expYear != undefined ? _card.expYear : "";
                card['fingerprint'] = _card.fingerprint != undefined ? _card.fingerprint : "";
                card['last4'] = _card.last4 != undefined ? _card.last4 : "";
                card['prepaidType'] = _card.prepaidType != undefined ? _card.prepaidType : "";

                cardDetails['card'] = card;
            }

            if (_cardDetails.cardPaymentTimeline != undefined) {
                let cardPaymentTimeline: Object = new Object();
                let _cardPaymentTimeline: CardPaymentTimeline = _cardDetails.cardPaymentTimeline;

                cardPaymentTimeline['authorizedAt'] = _cardPaymentTimeline.authorizedAt.toString();
                cardPaymentTimeline['capturedAt'] = _cardPaymentTimeline.capturedAt.toString();

                cardDetails['cardPaymentTimeline'] = cardPaymentTimeline;
            }

            cardDetails['avsStatus'] = _cardDetails.avsStatus != undefined ? _cardDetails.avsStatus : "";
            cardDetails['cvvStatus'] = _cardDetails.cvvStatus != undefined ? _cardDetails.cvvStatus : "";
            cardDetails['entryMethod'] = _cardDetails.entryMethod != undefined ? _cardDetails.entryMethod : "";
            cardDetails['statementDescription'] = _cardDetails.statementDescription != undefined ? _cardDetails.statementDescription : "";
            cardDetails['status'] = _cardDetails.status != undefined ? _cardDetails.status : "";

            json['cardDetails'] = cardDetails;
        }

        if (this['riskEvaluation'] != undefined) {
            let riskEvaluation: Object = new Object();
            let _riskEvaluation: RiskEvaluation = this['riskEvaluation'];

            riskEvaluation['createdAt'] = _riskEvaluation.createdAt != undefined ? _riskEvaluation.createdAt : "";
            riskEvaluation['riskLevel'] = _riskEvaluation.riskLevel != undefined ? _riskEvaluation.riskLevel : "";

            json['riskEvaluation'] = riskEvaluation;
        }

        if (this['totalMoney'] != undefined) {
            let totalMoney: Object = new Object();
            let _totalMoney: TotalMoney = this['totalMoney'];

            totalMoney['amount'] = _totalMoney.amount != undefined ? _totalMoney.amount : "";
            totalMoney['currency'] = _totalMoney.currency != undefined ? _totalMoney.currency : "";

            json['totalMoney'] = totalMoney;
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

export enum CarrierEnum {
    FEDEX = 'FedEx',
    UPS = 'UPS',
    USPS = 'USPS',
    DHL = 'DHL'
}

export class Package {
    private static keys = [
        '_id',
        'carrier',
        'tracking_number',
        'cost',
        'charged'
    ];

    _id?: string;
    carrier?: CarrierEnum;
    tracking_number?: string;
    cost?: number;
    charged?: number;
    items?: OrderItem[];
    status?: PackageStatus[];
    shipping_date?: Date;
    received_date?: Date;
    shipping_address?: Address;
    return_address?: Address;

    constructor() {
        this.items = [];
        this.status = [];
    }

    public static fromJSON(obj: Object): Package {
        var _package: Package = new Package();

        if (obj == undefined) {
            return _package;
        }

        if ((typeof obj) == (typeof "string")) {
            _package._id = obj.toString();
            return _package;
        }

        for (let i = 0; i < Package.keys.length; i++) {
            let key = Package.keys[i]
            if (obj.hasOwnProperty(key)) {
                _package[key] = obj[key];
            }
        }

        if (obj.hasOwnProperty('shipping_date')) {
            let shipping_dateStr = obj['shipping_date'];
            _package['shipping_date'] = new Date(shipping_dateStr);
        }

        if (obj.hasOwnProperty('received_date')) {
            let received_dateStr = obj['received_date'];
            _package['received_date'] = new Date(received_dateStr);
        }

        if (obj.hasOwnProperty('items')) {
            let itemsObj: any = obj['items'];
            let _items: OrderItem[] = [];
            for (let i = 0; i < itemsObj.length; i++) {
                let item = OrderItem.fromJSON(itemsObj[i]);
                _items.push(item);
            }

            _package['items'] = _items;
        }

        if (obj.hasOwnProperty('status')) {
            let statusObj: any = obj['status'];
            let _status: PackageStatus[] = [];
            for (let i = 0; i < statusObj.length; i++) {
                let status = PackageStatus.fromJSON(statusObj[i]);
                _status.push(status);
            }

            _package['status'] = _status;
        }

        if (obj.hasOwnProperty('shipping_address')) {
            let address: Address = Address.fromJSON(obj['shipping_address']);
            _package['shipping_address'] = address;
        }

        if (obj.hasOwnProperty('return_address')) {
            let address: Address = Address.fromJSON(obj['return_address']);
            _package['return_address'] = address;
        }

        return _package;
    }

    public toJSON(): string {
        let json: Object = new Object();

        for (let i = 0; i < Package.keys.length; i++) {
            let key = Package.keys[i]
            if (this[key] != undefined) {
                json[key] = this[key];
            }
        }

        if (this['shipping_date'] != undefined) {
            json['shipping_date'] = this.shipping_date.toString();
        }

        if (this['received_date'] != undefined) {
            json['received_date'] = this.received_date.toString();
        }

        if (this['items'] != undefined) {
            let _items = [];
            this['items'].forEach(element => {
                _items.push(JSON.parse(element.toJSON()));
            });

            json['items'] = _items;
        }

        if (this['status'] != undefined) {
            let _status = [];
            this['status'].forEach(element => {
                _status.push(JSON.parse(element.toJSON()));
            });

            json['status'] = _status;
        }

        if (this['return_address'] != undefined) {
            json['return_address'] = JSON.parse(this['return_address'].toJSON());
        }

        if (this['shipping_address'] != undefined) {
            json['shipping_address'] = JSON.parse(this['shipping_address'].toJSON());
        }

        return JSON.stringify(json);
    }
}

export enum ReturnReason {
    NO_LONGER_NEEDED = 'No Longer Needed',
    INACCURATE_WEBSITE_DESCRIPTION = 'Inaccurate Website Description',
    ITEM_DEFECTIVE_OR_DOESNT_WORK = "Item Defective Or Doesn't Work",
    BOUGHT_BY_MISTAKE = 'Bought By Mistake',
    BETTER_PRICE_AVAILABLE = 'Better Price Available',
    PRODUCT_DAMAGED = 'Product Damaged',
    WRONG_ITEM_SENT = 'Wrong Item Sent',
    OTHER = 'Other'
}

export enum RefundMethod {
    REFUND_CARD = 'Refund Card',
    STORE_CREDIT = 'Store Credit'
}

export enum ReturnMethod {
    UPS = 'UPS',
    USPS = 'USPS',
    FEDEX = 'FedEx'
}

export class ReturnRequest {
    private static keys = [
        'quantity',
        'reason',
        'returnId',
        'other_reason',
        'return_method',
        'refund_method',
        'approved',
        'denied',
    ];

    returnId?: string;
    quantity?: number;
    reason?: ReturnReason;
    return_method?: ReturnMethod;
    refund_method?: RefundMethod;
    other_reason?: string;
    requested_date?: Date;
    decision_date?: Date;
    approved?: boolean;
    denied?: boolean;
    user?: User;

    public static fromJSON(obj: Object): ReturnRequest {
        var returnRequest: ReturnRequest = new ReturnRequest();

        if (obj == undefined) {
            return returnRequest;
        }

        for (let i = 0; i < ReturnRequest.keys.length; i++) {
            let key = ReturnRequest.keys[i]
            if (obj.hasOwnProperty(key)) {
                returnRequest[key] = obj[key];
            }
        }

        if (obj.hasOwnProperty('user')) {
            returnRequest['user'] = User.fromJSON(obj['user']);
        }

        if (obj.hasOwnProperty('requested_date')) {
            let dateStr = obj['requested_date'];
            returnRequest['requested_date'] = new Date(dateStr);
        }

        if (obj.hasOwnProperty('decision_date')) {
            let dateStr = obj['decision_date'];
            returnRequest['decision_date'] = new Date(dateStr);
        }

        return returnRequest;
    }

    public toJSON(): string {
        let json: Object = new Object();

        for (let i = 0; i < ReturnRequest.keys.length; i++) {
            let key = ReturnRequest.keys[i]
            if (this[key] != undefined) {
                json[key] = this[key];
            }
        }

        if (this['user'] != undefined) {
            json['user'] = JSON.parse(this['user'].toJSON());
        }


        if (this['requested_date'] != undefined) {
            json['requested_date'] = this.requested_date.toString();
        }

        if (this['decision_date'] != undefined) {
            json['decision_date'] = this.decision_date.toString();
        }

        return JSON.stringify(json);
    }
}

export class OrderItem {
    private static keys = [
        '_id',
        'sku',
        'quantity',
        'list_price',
        'discount',
        'discount_price',
        'tax',
        'sale'
    ];

    _id?: string;
    product?: Product;
    size?: Size;
    variant?: Variant;
    sku?: string;
    quantity?: number;
    status?: StockStatus;
    list_price?: number;
    discount?: number;
    discount_price?: number;
    sale?: boolean;
    tax?: number;
    promotions?: Promotion[];
    sales?: Sale[];
    review?: string = "null";
    return_request?: ReturnRequest;
    _creationDate?: Date;
    _updatedDate?: Date;

    constructor() {
        this.promotions = [];
        this.sales = [];
    }

    public static fromJSON(obj: Object): OrderItem {
        var orderItem: OrderItem = new OrderItem();

        if (obj == undefined) {
            return orderItem;
        }

        if ((typeof obj) == (typeof "string")) {
            orderItem._id = obj.toString();
            return orderItem;
        }

        for (let i = 0; i < OrderItem.keys.length; i++) {
            let key = OrderItem.keys[i]
            if (obj.hasOwnProperty(key)) {
                orderItem[key] = obj[key];
            }
        }

        if (obj.hasOwnProperty('product')) {
            orderItem['product'] = Product.fromJSON(obj['product']);
        }

        if (obj.hasOwnProperty('size')) {
            orderItem['size'] = Size.fromJSON(obj['size']);
        }

        if (obj.hasOwnProperty('variant')) {
            orderItem['variant'] = Variant.fromJSON(obj['variant']);
        }

        if (obj.hasOwnProperty('return_request')) {
            orderItem['return_request'] = ReturnRequest.fromJSON(obj['return_request']);
        }

        if (obj.hasOwnProperty('status')) {
            orderItem['status'] = StockStatus.fromJSON(obj['status']);
        }

        if (obj.hasOwnProperty('promotions')) {
            let promotionObj: any = obj['promotions'];
            let _promotions: Promotion[] = [];
            for (let i = 0; i < promotionObj.length; i++) {
                let promotion = Promotion.fromJSON(promotionObj[i]);
                _promotions.push(promotion);
            }

            orderItem['promotions'] = _promotions;
        }

        if (obj.hasOwnProperty('sales')) {
            let salesObj: any = obj['sales'];
            let _sales: Sale[] = [];
            for (let i = 0; i < salesObj.length; i++) {
                let sale = Sale.fromJSON(salesObj[i]);
                _sales.push(sale);
            }

            orderItem['sales'] = _sales;
        }

        if (obj.hasOwnProperty('_creationDate')) {
            let dateStr = obj['_creationDate'];
            orderItem['_creationDate'] = new Date(dateStr);
        }

        if (obj.hasOwnProperty('_updatedDate')) {
            let dateStr = obj['_updatedDate'];
            orderItem['_updatedDate'] = new Date(dateStr);
        }

        return orderItem;
    }

    public toJSON(): string {
        let json: Object = new Object();

        for (let i = 0; i < OrderItem.keys.length; i++) {
            let key = OrderItem.keys[i]
            if (this[key] != undefined) {
                json[key] = this[key];
            }
        }

        if (this['product'] != undefined) {
            json['product'] = JSON.parse(this['product'].toJSON());
        }

        if (this['size'] != undefined) {
            json['size'] = JSON.parse(this['size'].toJSON());
        }

        if (this['variant'] != undefined) {
            json['variant'] = JSON.parse(this['variant'].toJSON());
        }

        if (this['return_request'] != undefined) {
            json['return_request'] = JSON.parse(this['return_request'].toJSON());
        }

        if (this['status'] != undefined) {
            json['status'] = JSON.parse(this['status'].toJSON());
        }

        if (this['promotions'] != undefined) {
            let _promotions = [];
            this['promotions'].forEach(element => {
                _promotions.push(JSON.parse(element.toJSON()));
            });

            json['promotions'] = _promotions;
        }

        if (this['sales'] != undefined) {
            let _sales = [];
            this['sales'].forEach(element => {
                _sales.push(JSON.parse(element.toJSON()));
            });

            json['sales'] = _sales;
        }

        if (this['_creationDate'] != undefined) {
            json['_creationDate'] = this._creationDate.toString();
        }

        if (this['_updatedDate'] != undefined) {
            json['_updatedDate'] = this._updatedDate.toString();
        }

        return JSON.stringify(json);
    }

    public get getTitle(): string {
        let string = this.product.title;

        if (this.product.variants.length > 1) {
            string += ", " + this.variant.name;
        }

        if (this.product.sizes.length > 1) {
            string += ", Size: " + this.size.name;
        }

        return string;
    }

}
export class Order {
    private static keys = [
        '_id',
        'orderId',
        'sub_total',
        'tax',
        'tax_rate',
        'total',
        'discount',
        'shipping',
        'currency'
    ];

    _id?: string;
    orderId?: string;
    sub_total?: number;
    tax?: number;
    tax_rate?: string;
    total?: number;
    discount?: number;
    shipping?: number;
    currency?: string;
    shipping_address?: Address;
    billing_addresss: Address;
    user?: User;
    status?: OrderStatus[];
    packages?: Package[];
    items?: OrderItem[];
    payments?: Payment[];
    refund_stubs?: Refund[];
    dateString?: string;
    timeString?: string;
    _creationDate?: Date;
    _updatedDate?: Date;

    constructor() {
        this.status = [];
        this.packages = [];
        this.items = [];
        this.payments = [];
        this.refund_stubs = [];
    }

    public getStatus(): OrderStatus {
        if (this.status.length > 0) {
            let status: OrderStatus;
            status = this.status[this.status.length - 1];
            return status;
        } else {
            return new OrderStatus();
        }
    }

    public static fromJSON(obj: Object): Order {
        var order: Order = new Order();

        if (obj == undefined) {
            return order;
        }

        if ((typeof obj) == (typeof "string")) {
            order._id = obj.toString();
            return order;
        }

        for (let i = 0; i < Order.keys.length; i++) {
            let key = Order.keys[i]
            if (obj.hasOwnProperty(key)) {
                order[key] = obj[key];
            }
        }

        if (obj.hasOwnProperty('user')) {
            let user: User = User.fromJSON(obj['user']);
            order['user'] = user;
        }

        if (obj.hasOwnProperty('shipping_address')) {
            let shipping_address: Address = Address.fromJSON(obj['shipping_address']);
            order['shipping_address'] = shipping_address;
        }

        if (obj.hasOwnProperty('billing_addresss')) {
            let billing_addresss: Address = Address.fromJSON(obj['billing_addresss']);
            order['billing_addresss'] = billing_addresss;
        }

        if (obj.hasOwnProperty('status')) {
            let statusObj = obj['status'];
            let _status: OrderStatus[] = [];
            for (let i = 0; i < statusObj.length; i++) {
                let status: OrderStatus = OrderStatus.fromJSON(statusObj[i]);
                _status.push(status);
            }

            order['status'] = _status;
        }

        if (obj.hasOwnProperty('packages')) {
            let packagesObj = obj['packages'];
            let _packages: Package[] = [];
            for (let i = 0; i < packagesObj.length; i++) {
                let _package: Package = Package.fromJSON(packagesObj[i]);
                _packages.push(_package);
            }

            order['packages'] = _packages;
        }

        if (obj.hasOwnProperty('items')) {
            let itemsObj = obj['items'];
            let _items: OrderItem[] = [];
            for (let i = 0; i < itemsObj.length; i++) {
                let item: OrderItem = OrderItem.fromJSON(itemsObj[i]);
                _items.push(item);
            }

            order['items'] = _items;
        }

        if (obj.hasOwnProperty('payments')) {
            let paymentsObj = obj['payments'];
            let payments: Payment[] = [];
            for (let i = 0; i < paymentsObj.length; i++) {
                let payment: Payment = Payment.fromJSON(paymentsObj[i]);
                payments.push(payment);
            }

            order['payments'] = payments;
        }

        if (obj.hasOwnProperty('refund_stubs')) {
            let refundStubs = obj['refund_stubs'];
            let stubs: Refund[] = [];
            for (let i = 0; i < refundStubs.length; i++) {
                let stub: Refund = Refund.fromJSON(refundStubs[i]);
                stubs.push(stub);
            }

            order['refund_stubs'] = stubs;
        }

        if (obj.hasOwnProperty('_creationDate')) {
            let dateStr = obj['_creationDate'].toString();
            let date: Date = new Date(dateStr);
            order['_creationDate'] = date;

            order['dateString'] = dateToString(date);
            order['timeString'] = timeToString(date);
        }


        if (obj.hasOwnProperty('_updatedDate')) {
            let dateStr = obj['_updatedDate'].toString();
            let date: Date = new Date(dateStr);
            order['_updatedDate'] = date;
        }

        return order;
    }

    public toJSON(): string {
        let json: Object = new Object();

        for (let i = 0; i < Order.keys.length; i++) {
            let key = Order.keys[i]
            if (this[key] != undefined) {
                json[key] = this[key];
            }
        }

        if (this['user'] != undefined) {
            json['user'] = JSON.parse(this.user.toJSON());
        }

        if (this['shipping_address'] != undefined) {
            json['shipping_address'] = JSON.parse(this.shipping_address.toJSON());
        }

        if (this['billing_addresss'] != undefined) {
            json['billing_addresss'] = JSON.parse(this.billing_addresss.toJSON());
        }

        if (this['status'] != undefined) {
            json['status'] = []
            for (let i = 0; i < this['status'].length; i++) {
                let status = JSON.parse(this['status'][i].toJSON());
                json['status'].push(status);
            }
        }

        if (this['packages'] != undefined) {
            json['packages'] = []
            for (let i = 0; i < this['packages'].length; i++) {
                let _package = JSON.parse(this['packages'][i].toJSON());
                json['packages'].push(_package);
            }
        }

        if (this['items'] != undefined) {
            json['items'] = []
            for (let i = 0; i < this['items'].length; i++) {
                let item = JSON.parse(this['items'][i].toJSON());
                json['items'].push(item);
            }
        }

        if (this['payments'] != undefined) {
            json['payments'] = []
            for (let i = 0; i < this['payments'].length; i++) {
                let item = JSON.parse(this['payments'][i].toJSON());
                json['payments'].push(item);
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

    public get totalItems(): string {
        let count: number = 0;

        this.items.forEach(element => {
            count += element.quantity;
        });

        return count.toFixed(0);
    }

    public get totalProducts(): string {
        let count: number = 0;

        this.items.forEach(element => {
            count += 1;
        });

        return count.toFixed(0);
    }

    public get hoursSinceOrder(): string {
        let now = new Date();

        var hours = Math.abs(now.getTime() - this._creationDate.getTime()) / 36e5;

        return hours.toFixed(2);
    }


}
