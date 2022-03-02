import { Component, OnInit, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { OrderItem, Order, OrderStatusEnum, StockStatusEnum, Stock, isReturnEnum, isReturnCompleted, isReturnDenied, isReturnPending, isReturnValid } from 'src/app/_models/shop';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AppAuthenticationService } from 'src/app/_services/app-authentication.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { User } from 'src/app/_models/user';
import { ToastrService } from 'ngx-toastr';
import { blobToBase64 } from 'src/app/_models/macros';
import { dateToString, timeToString, hoursSince } from 'src/app/_models/macros';
import * as $ from 'jquery'

@Component({
    selector: 'app-return-box',
    templateUrl: './return-box.component.html',
    styleUrls: ['./return-box.component.scss']
})
export class ReturnBoxComponent implements OnInit, AfterViewInit, OnDestroy {
    bsModalRef: BsModalRef;

    @Input() item: OrderItem;
    @Input() order: Order;

    public returnDateString: string;
    public returnTimeString: string;
    public returnStatusString: string;
    public hoursSinceReturnRequest: string;

    _prevLoaded: boolean = false;
    _count: number = 0;
    _dots: string = "";
    _interval;

    _prevOrders: Order[] = [];
    _items: OrderItem[] = [];
    _prevItems: OrderItem[] = [];
    _prevPendingItems: OrderItem[] = [];
    _prevCompleteItems: OrderItem[] = [];
    _prevDeniedItems: OrderItem[] = [];

    userId: string;

    default_date = new Date('December 17, 1970 03:24:00');
    numPrevReturns: number;

    constructor(private http: HttpClient, private appAuthService: AppAuthenticationService, private modalService: BsModalService) { }

    ngOnInit(): void {

        this._interval = setInterval(() => {
            this._count += 1;
            let count = (this._count % 3) + 1;
            this._dots = "";
            for (let i = 0; i < count; i++) {
                this._dots += ".";
            }
        }, 300);

        let date = this.item.return_request.requested_date;

        this.returnDateString = dateToString(date);
        this.returnTimeString = timeToString(date);

        this.returnStatusString = this.item.status.status;
        this.hoursSinceReturnRequest = this.hoursSinceRequest(date);

        this.userId = this.order.user._id;

        let url = environment.API_URL + "/shopping/orders/" + this.userId + "/item/status";

        let params = {
            status: "all"
        }

        this.http.post(url, params, {
            headers: this.appAuthService.getAuthHeader(),
            observe: 'response'
        }).subscribe(
            success => {
                let body: any = success.body;

                body.forEach(element => {
                    let order = Order.fromJSON(element);
                    this._prevOrders.push(order);
                });

                this._prevOrders.forEach(element => {
                    let filtered = element.items.filter(element => isReturnEnum(element.status.status) && element._id != this.item._id);

                    filtered.forEach(element => this._items.push(element));

                    this._prevItems = this._items.filter(element => isReturnValid(element.status.status));
                    this._prevDeniedItems = this._items.filter(element => isReturnDenied(element.status.status));
                    this._prevPendingItems = this._items.filter(element => isReturnPending(element.status.status));
                    this._prevCompleteItems = this._items.filter(element => isReturnCompleted(element.status.status));

                    this._prevLoaded = true;
                    clearInterval(this._interval);
                });
            },
            error => {
                console.log("Error fetching orders in Return Box.");
            }
        )

    }

    ngOnDestroy(): void {

    }

    ngAfterViewInit(): void {

    }

    formatAMPM(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }

    public hoursSinceRequest(orderDate: Date): string {
        let now = new Date();

        var hours = Math.abs(now.getTime() - orderDate.getTime()) / 36e5;

        return hours.toFixed(2);
    }

    public get totalPrevOrders(): string {
        let value: number = 0;

        value = this._prevOrders.length;

        return value.toFixed(0);
    }

    public get totalOfPrevItems(): string {
        let value: number = 0;

        this._prevItems.forEach(element => {
            value += element.quantity;
        });

        this.numPrevReturns = value;

        return value.toFixed(0);
    }

    public get totalPrevCompletedReturns(): string {
        let value: number = 0;

        this._prevCompleteItems.forEach(element => {
            value += element.quantity;
        });

        return value.toFixed(0);
    }

    public get totalPrevDeniedReturns(): string {
        let value: number = 0;

        this._prevDeniedItems.forEach(element => {
            value += element.quantity;
        });

        return value.toFixed(0);
    }


    public get totalValuePrevDenied(): string {
        let value: number = 0;

        this._prevDeniedItems.forEach(element => {
            value += element.quantity * element.discount_price;
        });

        return value.toFixed(2);
    }

    public get totalValueOfPrevItems(): string {
        let value: number = 0;

        this._prevItems.forEach(element => {
            value += element.quantity * element.discount_price;
        });

        return value.toFixed(2);
    }

    public get dateOfLastReturn(): string {
        let date = this.default_date;

        this._prevItems.forEach(element => {
            if (element.status._updatedDate > date) {
                date = element.status._updatedDate;
            }
        });

        if (date == this.default_date) {
            return "";
        } else {
            return dateToString(date);
        }
    }

    public viewPreviousReturns(): void {
        const initialState = {
            list: {
                orders: this._prevOrders,
                currentItemId: this.item._id
            }
        }

        this.bsModalRef = this.modalService.show(PreviousReturnsSub, { initialState });

    }

    public submit(approved: boolean): void {
        const initialState = {
            list: {
                user: this.appAuthService.getAuthUser(),
                approved: approved,
                denied: !approved,
                item: this.item,
                order: this.order,
                returnDateString: this.returnDateString,
                returnTimeString: this.returnTimeString
            },
            class: 'modal-lg'
        }

        this.bsModalRef = this.modalService.show(ReturnSubmitSub, { initialState });
    }
}


@Component({
    selector: 'app-return-submit-sub',
    template: `
    <section style="padding-bottom: 20px; padding-top: 20px">
    <div class="container-fluid">
          <button type="button" class="close" (click)="bsModalRef.hide()">
              <span aria-hidden="true">&times;</span>
          </button>
          <div class="modal-header">
            <h4>Submit Order Return Request</h4>
            <hr>
          </div>
          <br>
          <div class="row form group">
            <div class="top-image">
                <a href="javascript:void(0)" [routerLink]="['/products/product-detail/', item.product._id]" (click)="bsModalRef.hide()"><img  [src]="item.product.image.src" width="100px" height="100px" ></a>
            </div>
            <div class="top-title" id="id_100">
                <a href="javascript:void(0)" [routerLink]="['/products/product-detail/', item.product._id]" (click)="bsModalRef.hide()">{{item.product.title}}</a>
                <p style="margin-top: 10px;">Variant: <b>{{item.variant.name}}</b> | Size: <b>{{item.size.name}}</b></p>
                <p style="margin-top: -5px;">SKU: <b>{{item.sku}}</b></p>
            </div>
            </div>
          <div *ngIf="approved">
                <h5>You have selected to <b>approve</b> this request.</h5>
            </div>
            <div *ngIf="!approved">
                <h5>You have selected to <b>deny</b> this request.</h5>
            </div>
            <br>
            <div>
                    <h6>This return was requested by <b>{{order.user.username}}</b></h6>
                    <h6>This return was requested on <b>{{returnDateString}}</b> at <b>{{returnTimeString}}</b></h6>
                    <h6>The request is for <b>{{item.return_request.quantity}}</b> items.</h6>
                    <h6>The item being returned is <b>{{item.product.title}}</b>, Variant: <b>{{item.variant.name}}</b>, Size: <b>{{item.size.name}}</b></h6>
                    <h6>
                        The method of return is <b>{{item.return_request.return_method}}</b>.
                    </h6>
                    <h6>
                        The refund method is <b>{{item.return_request.refund_method}}</b>.
                    </h6>
                    <h6>
                        The total amount of the return is for
                        <b>{{"$"+(item.return_request.quantity*item.discount_price).toFixed(2)}}</b>
                    </h6>
                    <h6>The reason listed for the return is <b>{{item.return_request.reason}}</b></h6>
                    <h6 *ngIf="item.return_request.reason == 'Other'">Additional information provided for the return
                        reason is: <b>{{item.return_request.other_reason}}</b></h6>
                </div>
            <div>
            <br>
            <div>
                <h5>Are you sure that you would like to submit this request?</h5>
            </div>
            <button class="btn btn-primary span-button" (click)="bsModalRef.hide()">Cancel</button>
            </div>
            <div>
            <button class="btn btn-success span-button" (click)="onSubmit()">Submit</button>
            </div>
        </div>
        </section>`,
    styleUrls: ['./return-box.component.scss']
})
export class ReturnSubmitSub implements OnInit {

    list: Object;

    item: OrderItem;
    order: Order;
    approved: boolean;
    denied: boolean;
    user: User;
    returnDateString: string;
    returnTimeString: string;

    constructor(public bsModalRef: BsModalRef, private http: HttpClient, private appAuthService: AppAuthenticationService, private toastr: ToastrService) { }

    ngOnInit(): void {
        this.item = this.list['item'];
        this.order = this.list['order'];
        this.approved = this.list['approved'];
        this.denied = this.list['denied'];
        this.user = this.list['user'];
        this.returnDateString = this.list['returnDateString'];
        this.returnTimeString = this.list['returnTimeString'];
    }

    onSubmit() {

        let params = {
            approved: this.approved,
            denied: this.denied,
            user: this.user._id
        }

        let url = environment.API_URL + "/shopping/order/" + this.order._id + "/requests/" + this.order.user._id + "/item/" + this.item._id;

        console.log(url);

        this.http.post(url, params, {
            headers: this.appAuthService.getAuthHeader(),
            observe: 'response'
        }).subscribe(
            success => {
                this.toastr.success("You have succesfully submitted the return request", "Success!");
                setTimeout(() => {
                    location.reload();
                }, 1500);
                console.log("Success");
            },
            error => {
                this.toastr.success("There was an error submitting the return request", "Error!");
                console.log("Error");
            }
        )


        this.bsModalRef.hide();
    }

}


@Component({
    selector: 'app-previous-returns-sub',
    template: `
    <section style="padding-bottom: 20px; padding-top: 20px">
    <div class="container-fluid">
          <button type="button" class="close" (click)="bsModalRef.hide()">
              <span aria-hidden="true">&times;</span>
          </button>
          <div>
            <h4>Previous Returns</h4>
            <hr>
          </div>
          <div class="return-box-lower-container" *ngFor="let item of items, let i=index">
              <h6 class="header-value">DATE: <b>{{dates[i]}}</b> at <b>{{times[i]}}</b></h6>
              <h6 class="header-value">STATUS: <b>{{status[i]}}</b></h6>
              <h6 class="header-value">RETURN # <b>{{item.return_request.returnId}}</b></h6>
                <div class="return-box-lower-column1">
                    <div class="return-box-lower-container" style="margin-bottom: 10px;">
                        <div class="previous-returns-image">
                            <img [src]="item.product.image.src" style="height: 80px; width:80px">
                        </div>
                        <div class="previous-returns-product-info" style="padding-left: 20px;">
                            <div>
                                <a href="javascript:void(0)">{{item.product.title}}</a>
                            </div>
                            <div style="margin-top: -4px;">
                                <p>Quantity: <b>{{item.quantity}}</b></p>
                            </div>
                            <div class="previous-returns-content">
                                <p>Size: <b>{{item.size.name}}</b></p>
                            </div>
                            <div class="previous-returns-content">
                                <p>Variant: <b>{{item.variant.name}}</b></p>
                            </div>
                            <div class="previous-returns-content">
                                <p>SKU: <b>{{item.sku}}</b></p>
                            </div>
                        </div>
                    </div>
                    <input type="checkbox" id="{{item._id}}" (change)="seeMore(item._id)" />
                    <div class="previous_return_info_{{item._id}}">
                        <h6>This return was requested by <b>{{user.username}}</b></h6>
                        <h6>This return was requested on <b>{{dates[i]}}</b> at <b>{{times[i]}}</b></h6>
                        <h6>The request is for <b>{{item.return_request.quantity}}</b> items.</h6>
                        <h6>The item being returned is <b>{{item.product.title}}</b>, Variant: <b>{{item.variant.name}}</b>, Size: <b>{{item.size.name}}</b></h6>
                        <h6>
                            The method of return is <b>{{item.return_request.return_method}}</b>.
                        </h6>
                        <h6>
                            The refund method is <b>{{item.return_request.refund_method}}</b>.
                        </h6>
                        <h6>
                            The total amount of the return is for
                            <b>{{"$"+(item.return_request.quantity*item.discount_price).toFixed(2)}}</b>
                        </h6>
                        <h6>The reason listed for the return is <b>{{item.return_request.reason}}</b></h6>
                        <h6 *ngIf="item.return_request.reason == 'Other'">Additional information provided for the return
                            reason is: <b>{{item.return_request.other_reason}}</b></h6>
                        <h6 *ngIf="item.return_request.approved">
                            The return request has been <b>approved</b>. It was approved on <b>{{decisionDates[i]}}</b> at <b>{{decisionTimes[i]}}</b> by <b>{{users[i]}}</b>.
                        </h6>
                        <h6 *ngIf="item.return_request.denied">
                            The return request has been <b>denied</b>. It was denied on <b>{{decisionDates[i]}}</b> at <b>{{decisionTimes[i]}}</b> by <b>{{users[i]}}</b>.
                        </h6>
                        <h6 *ngIf="!item.return_request.approved && !item.return_request.denied">
                            The request is pending approval. It has been pending approval for <b>{{hours[i]}}</b> hours.
                        </h6> 
                    </div>
                    <label id="label_{{item._id}}" for="{{item._id}}">Show More</label>
                    <div>
                        <button class="btn btn-info span-button" *ngIf="item.return_request.approved == false && item.return_request.denied == false" disabled="true">Pending Approval</button>
                        <button class="btn btn-success span-button" *ngIf="item.return_request.approved" disabled="true">Approved</button>
                        <button class="btn btn-primary span-button" *ngIf="item.return_request.denied" disabled="true"> Denied</button>
                    </div>
                    <hr>
                    </div>
                </div>
                <div>
            <button class="btn btn-success span-button" (click)="onSubmit()">Close</button>
            </div>
        </div>
        </section>`,
    styleUrls: ['./return-box.component.scss']
})
export class PreviousReturnsSub implements OnInit, AfterViewInit {

    list: Object;

    items: OrderItem[] = [];
    orders: Order[] = [];
    user: User;
    currentItemId: string;

    dates: string[] = [];
    decisionDates: string[] = [];
    decisionTimes: string[] = [];
    users: string[] = [];
    times: string[] = [];
    status: string[] = [];
    hours: string[] = [];

    constructor(public bsModalRef: BsModalRef, private http: HttpClient, private appAuthService: AppAuthenticationService, private toastr: ToastrService) { }

    ngOnInit(): void {
        this.orders = this.list['orders'];
        this.currentItemId = this.list['currentItemId'];

        if (this.orders.length > 0) {
            this.user = this.orders[0].user;
        } else {
            this.bsModalRef.hide();
            this.toastr.error("There was an error loading the previous returns", "Error!");
            return;
        }

        this.orders.forEach(element => {
            let filter: OrderItem[] = element.items.filter(item => isReturnEnum(item.status.status) && item._id != this.currentItemId);

            filter.forEach(filtered => this.items.push(filtered));
        });

        this.items.sort((a, b) => b.return_request.requested_date.getDate() - a.return_request.requested_date.getDate());


        this.items.forEach(item => {

            let date = item.return_request.requested_date;

            let returnDateString = dateToString(date);
            let returnTimeString = timeToString(date);
            let returnStatusString = item.status.status;

            this.dates.push(returnDateString);
            this.times.push(returnTimeString);
            this.status.push(returnStatusString);
            this.hours.push(hoursSince(date));

            if (item.return_request.decision_date) {
                let decisionDate = item.return_request.decision_date;

                let decisionDateString = dateToString(decisionDate);
                let decisionTimeString = timeToString(decisionDate);

                this.decisionDates.push(decisionDateString);
                this.decisionTimes.push(decisionTimeString);
                this.users.push(item.return_request.user.username);
            } else {
                this.decisionDates.push(" ");
                this.decisionTimes.push(" ");
                this.users.push(" ");
            }

            let url = environment.API_URL + "/product/" + item.product._id + "/photo/download"
            this.http.get(url, {
                observe: 'response',
                responseType: 'blob'
            }).subscribe(
                success => {
                    blobToBase64(success.body, result => {
                        item.product.image.src = result;
                    });
                },
                error => {
                    console.log("Error fetching image");
                });
        });
    }

    ngAfterViewInit(): void {

        this.items.forEach(item => {
            $("#" + item._id).css('display', 'none');
            $("#" + item._id + ' + .previous_return_info_' + item._id).css('max-height', '0px');
            $("#" + item._id + ' + .previous_return_info_' + item._id).css('overflow', 'hidden');
            $("#" + item._id + ' + .previous_return_info_' + item._id).css('transition', 'all .7s ease');
            $("#" + item._id + ':checked + .previous_return_info_' + item._id).css('max-height', '500px');
        });

    }

    seeMore(id: string) {
        let checked = $("#" + id).prop('checked');
        console.log(checked);
        if (checked) {
            $("#" + id + ' + .previous_return_info_' + id).css('max-height', '500px');
            $("#label_" + id).text("Show Less");
        } else {
            $("#" + id + ' + .previous_return_info_' + id).css('max-height', '0px');
            $("#label_" + id).text("Show More");
        }
    }

    formatAMPM(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }

    public hoursSinceRequest(orderDate: Date): string {
        let now = new Date();

        var hours = Math.abs(now.getTime() - orderDate.getTime()) / 36e5;

        return hours.toFixed(2);
    }

    onSubmit() {
        this.bsModalRef.hide();
    }
}
