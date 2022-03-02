import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { Order, OrderStatusEnum, Stock, OrderItem, isNeedsToBeApproved, isReturnDecided, Refund } from 'src/app/_models/shop';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { dateToString, timeToString } from 'src/app/_models/macros';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { AppAuthenticationService } from 'src/app/_services/app-authentication.service';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/_models/user';
import { FilterDefault } from 'ng2-smart-table/lib/components/filter/filter-default';
import { Router } from '@angular/router';
import { timingSafeEqual } from 'crypto';

@Component({
    selector: 'app-order-box',
    templateUrl: './order-box.component.html',
    styleUrls: ['./order-box.component.scss']
})
export class OrderBoxComponent implements OnInit, AfterViewInit {
    bsModalRef: BsModalRef;

    @Input() order: Order;
    @Input() backend: boolean = false;
    @Input() opened: boolean = true;

    public orderDateString: string;
    public orderStatusString: string;
    public orderString: string;

    public currentlyProcessing: boolean = false;
    public processOrder: boolean = false;
    public dropOrder: boolean = false;
    public waitlistOrder: boolean = false;
    public cancelOrder: boolean = false;

    constructor(private modalService: BsModalService, private appAuthService: AppAuthenticationService) { }

    ngOnInit(): void {


        this.order.items.forEach(item => {
            item.sales.forEach(sale => {
                console.log(sale);
            })
        })

        this.orderDateString = timeToString(this.order._creationDate) + " " + dateToString(this.order._creationDate);

        this.orderStatusString = this.order.getStatus().status;

        switch (this.orderStatusString) {
            case OrderStatusEnum.PURCHASED: {
                if (this.backend == true) {
                    this.orderString = "This order has been purchased and is waiting for processing.";
                    this.processOrder = true;
                    this.dropOrder = true;
                    this.waitlistOrder = true;
                    this.cancelOrder = true;
                } else {
                    this.orderString = "Your order has been purchased and is waiting for processing.";
                }
                break;
            }
            case OrderStatusEnum.PROCESSING: {
                if (this.backend == true) {
                    this.orderString = "This order has been purchased and is currently processing.";
                    this.currentlyProcessing = true;
                } else {
                    this.orderString = "Your order has been purchased and is currently processing.";
                }
                break;
            }
            case OrderStatusEnum.SHIPPED: {
                if (this.backend == true) {
                    this.orderString = "This order has been shipped. It should be delivered within the next few business days.";
                } else {
                    this.orderString = "Your order has been shipped. It should be delivered within the next few business days.";
                }
                break;
            }
            case OrderStatusEnum.DELIVERED: {
                if (this.backend == true) {
                    this.orderString = "This order has been delivered";
                } else {
                    this.orderString = "Your order has been delivered.";
                }
                break;
            }
            case OrderStatusEnum.DROPPED: {
                if (this.backend == true) {
                    this.orderString = "This order has been dropped, as it could not be fulfilled. All payments have been refunded to the original buyer. ";
                } else {
                    this.orderString = "Your order has been dropped, as it could not be fulfilled. Your payment has been refunded to you. ";
                }
                break;
            }
            case OrderStatusEnum.CANCELLED: {
                if (this.backend == true) {
                    this.orderString = "This order has been cancelled.";
                } else {
                    this.orderString = "Your order has been cancelled. ";
                }
                break;
            }
        }

        console.log(this.order.shipping_address.address1);
    }

    ngAfterViewInit(): void {
        $("#id_" + this.order._id).css('display', 'none');
        $("#id_" + this.order._id + ' + .class_' + this.order._id).css('max-height', '0px');
        $("#id_" + this.order._id + ' + .class_' + this.order._id).css('overflow', 'hidden');
        $("#id_" + this.order._id + ' + .class_' + this.order._id).css('transition', 'all .3s ease');

        if (this.opened) {
            $("#id_" + this.order._id).prop("checked", true);
            this.onChange(this.order._id);
        }
    }

    getTitle(stock: Stock): string {
        let string = stock.quantity + " × " + stock.product.title;

        if (stock.variant != undefined) {
            if (stock.product.variants.length > 1) {
                for (let i = 0; i < stock.product.variants.length; i++) {
                    if (stock.variant._id == stock.product.variants[i]._id) {
                        string += ", Variant: " + stock.variant.name;
                        break;
                    }
                }
            }
        } else {
            string += "";
        }


        if (stock.product.sizes.length > 1) {
            if (stock.size != undefined) {
                for (let i = 0; i < stock.product.sizes.length; i++) {
                    if (stock.size._id == stock.product.sizes[i]._id) {
                        string += ", Size: " + stock.size.name;
                        break;
                    }
                }
            } else {
                string += "";
            }

        }

        return string;
    }

    viewItem(item: OrderItem) {
        const initialState = {
            list: {
                item: item,
                order: this.order,
                dateString: this.orderDateString
            }
        }

        this.bsModalRef = this.modalService.show(ViewItemSub, { initialState });
    }

    viewStatus(item: OrderItem) {
        const initialState = {
            list: {
                item: item,
                order: this.order,
                dateString: this.orderDateString
            }
        }

        this.bsModalRef = this.modalService.show(ViewReturnStatusSub, { initialState });
    }

    approve(approved: boolean, item: OrderItem): void {
        const initialState = {
            list: {
                user: this.appAuthService.getAuthUser(),
                approved: approved,
                denied: !approved,
                item: item,
                order: this.order,
                returnDateString: dateToString(item.status._creationDate),
                returnTimeString: timeToString(item.status._creationDate)
            },
            class: 'modal-lg'
        }

        this.bsModalRef = this.modalService.show(ReturnSubmit2Sub, { initialState });
    }

    drop(): void {
        const initialState = {
            list: {
                order: this.order
            },
            class: 'modal-lg'
        }

        this.bsModalRef = this.modalService.show(DropOrderSub, { initialState });
    }

    cancel(): void {
        const initialState = {
            list: {
                order: this.order
            },
            class: 'modal-lg'
        }

        this.bsModalRef = this.modalService.show(CancelOrderSub, { initialState });
    }

    process(): void {
        const initialState = {
            list: {
                order: this.order
            },
            class: 'modal-lg'
        }

        this.bsModalRef = this.modalService.show(ConfirmProcessOrderSub, { initialState });
    }

    viewRefunds(): void {
        const initialState = {
            list: {
                order: this.order
            },
            class: 'modal-lg'
        }

        this.bsModalRef = this.modalService.show(ViewRefundStatusSub, { initialState });
    }

    onChange(id) {
        let checked = $("#id_" + id).prop('checked');
        if (checked) {
            $("#id_" + this.order._id + ' + .class_' + this.order._id).css('max-height', '4000px');
            $("#label_id_" + id).text("Show Less");
        } else {
            $("#id_" + this.order._id + ' + .class_' + this.order._id).css('max-height', '0px');
            $("#label_id_" + id).text("Show More");
        }
    }

    needsToBeApproved(str: string): boolean {
        return isNeedsToBeApproved(str);
    }

    isReturnDecided(str: string): boolean {
        return isReturnDecided(str);
    }




}



@Component({
    selector: 'app-view-item-sub',
    template: `
    <section style="padding-bottom: 20px; padding-top: 20px">
    <div class="container" *ngIf="loaded">
          <button type="button" class="close" (click)="bsModalRef.hide()">
              <span aria-hidden="true">&times;</span>
          </button>
          <div class="modal-header">
            <h4>Return Request</h4>
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
            <div class="padding">
                <h5>Request Info:</h5>
            </div>
            <div class="padding" *ngIf="item.return_request.denied == true && decisionDateString != undefined">
                The return request for <b>{{order.user.username}}</b> has been <b>denied</b> by the {{app_name}} team. This may be because they have had multiple returns in a short period of time. They have 48 hours from {{decisionDateString}} to petition the result if they feel that the decision is unjust or unfair. A link to where they can fill out a petition to have the {{app_name}} team reevaluate the decision can be found <a href="javascript:void(0)">here</a>.
            </div>
            <div class="padding" *ngIf="item.return_request.approved == true && decisionDateString != undefined">
                The return request for <b>{{order.user.username}}</b> has been <b>approved</b> by the {{app_name}} team.
            </div>
            <div class="padding" *ngIf="item.status.status.toString() == 'Return Approved'">
                The status of the return request is <b>{{item.status.status}}.</b> It was approved at <b>{{decisionDateString}}</b>. The <b>{{app_name}}</b> team is waiting to recieve the item(s) from <b>{{order.user.username}}</b>. Once the items are recieved they will be processed the refund will be processed within 48 hours. 
            </div>
            <div class="padding">
                <h5>Request Details:</h5>
            </div>
            <div class="padding">
                    <h6 *ngIf="item.return_request.returnId">Return Id: <b>{{item.return_request.returnId}}</b></h6>
                    <h6 *ngIf="item.return_request.quantity">Quantity: <b>{{item.return_request.quantity}}</b></h6>
                    <h6 *ngIf="item.return_request.reason">Reason: <b>{{item.return_request.reason}}</b></h6>
                    <h6 *ngIf="item.return_request.other_reason">Other Reason: <b>{{item.return_request.other_reason}}</b></h6>
                    <h6 *ngIf="item.return_request.return_method">Return Method: <b>{{item.return_request.return_method}}</b></h6>
                    <h6 *ngIf="item.return_request.refund_method">Refund Method: <b>{{item.return_request.refund_method}}</b></h6>
                    <h6 *ngIf="item.return_request.refund_method && item.return_request.refund_method == 'Refund Card'">Card Type: <b>{{order.payments[0].cardDetails.card.cardBrand}}</b></h6>
                    <h6 *ngIf="item.return_request.refund_method && item.return_request.refund_method == 'Refund Card'">Last 4: <b>{{order.payments[0].cardDetails.card.last4}}</b></h6>
                    <h6 *ngIf="item.return_request.requested_date">Requested Date: <b>{{requestedDateString}}</b></h6>
                    <h6 *ngIf="item.return_request.approved">Approved: <b>{{item.return_request.approved}}</b></h6>
                    <h6 *ngIf="item.return_request.denied">Denied: <b>{{item.return_request.denied}}</b></h6>
                    <h6 *ngIf="item.return_request.decision_date">Decision Date: <b>{{decisionDateString}}</b></h6>
                    <h6 *ngIf="item.return_request.user">User: <b>{{item.return_request.user.username}}</b></h6>
            </div>
            <div>
            <button class="btn btn-info span-button" (click)="bsModalRef.hide()">Close</button>
            </div>
        </div>
        </section>`,
    styleUrls: ['./order-box.component.scss']
})
export class ViewReturnStatusSub implements OnInit {

    list: Object;

    loaded: boolean = false;

    item: OrderItem;
    order: Order;
    dateString: string;
    decisionDateString: string;
    requestedDateString: string;
    app_name: string;

    constructor(public bsModalRef: BsModalRef) { }

    ngOnInit(): void {
        this.item = this.list['item'];
        this.order = this.list['order'];
        this.dateString = this.list['dateString'];
        this.app_name = environment.APP_NAME;

        if (this.item.return_request != undefined) {
            if (this.item.return_request.requested_date != undefined) {
                this.requestedDateString = timeToString(this.item.return_request.requested_date) + " " + dateToString(this.item.return_request.requested_date);
            } else {
                this.requestedDateString = undefined;
            }
            if (this.item.return_request.decision_date != undefined) {
                this.decisionDateString = timeToString(this.item.return_request.decision_date) + " " + dateToString(this.item.return_request.decision_date);
            } else {
                this.decisionDateString = undefined;
            }
        }

        this.loaded = true;
    }
}

@Component({
    selector: 'app-view-return-status-sub',
    template: `
    <section style="padding-bottom: 20px; padding-top: 20px">
    <div class="container">
          <button type="button" class="close" (click)="bsModalRef.hide()">
              <span aria-hidden="true">&times;</span>
          </button>
          <div class="modal-header">
            <h4>Item Details</h4>
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
            <br>
            <div class="padding">
                    <h5>Status:</h5>
            </div>
            <div class="padding">
                <h6>Status: <b>{{this.item.status.status}}</b></h6>
                <h6>Date: <b>{{statusDateString}}</b></h6>
            </div>
            <div class="padding">
                    <h5>Pricing:</h5>
            </div>
            <div class="padding">
                    <h6>List Price: <b>{{"$"+(item.list_price).toFixed(2)}}</b></h6>
                    <h6>Discount: <b>{{"$"+(item.discount).toFixed(2)}}</b></h6>
                    <h6>Discount Price: <b>{{"$"+(item.discount_price).toFixed(2)}}</b></h6>
                    <h6>Quantity: <b>{{(item.quantity).toFixed(0)}}</b></h6>
                    <h6>Subtotal: <b>{{"$"+(item.discount_price * item.quantity).toFixed(2)}}</b></h6>
                    <h6>Tax: <b>{{"$"+tax.toFixed(2)}}</b></h6>
                    <h6>Total Discount: <b>{{"$"+(item.discount * item.quantity).toFixed(2)}}</b></h6>
                    <h6>Total: <b>{{"$"+(tax+subtotal).toFixed(2)}}</b></h6>
            </div>
            <div class="padding">
                    <h5>Promotions:</h5>
            </div>
            <div class="padding">
                    <h6 *ngIf="item.promotions.length == 0"><b>No Promotions</b></h6>
                    <div *ngFor="let promotion of item.promotions">
                        <a href="javascript:void(0)" [routerLink]="'/promotions/promotions-view/'+promotion._id" (click)="bsModalRef.hide()">Type: {{promotion.type}} | Value: {{promotion.value}}</a>
                    </div>
            </div>
            <div class="padding">
                    <h5>Sales:</h5>
            </div>
            <div class="padding">
                    <h6 *ngIf="item.sales.length == 0"><b>No Sales</b></h6>
                    <div *ngFor="let sale of item.sales, let i=index">
                        <a href="javascript:void(0)" [routerLink]="'/products/product-sales-view/'+item.product._id+'/sale/'+sale._id" (click)="bsModalRef.hide()">Sale {{i+1}}</a>
                    </div>
            </div>
            <div class="padding" *ngIf="item.return_request">
                    <h5>Return Request:</h5>
            </div>
            <div class="padding" *ngIf="item.return_request">
                    <h6 *ngIf="item.return_request.returnId">Return Id: <b>{{item.return_request.returnId}}</b></h6>
                    <h6 *ngIf="item.return_request.quantity">Quantity: <b>{{item.return_request.quantity}}</b></h6>
                    <h6 *ngIf="item.return_request.reason">Reason: <b>{{item.return_request.reason}}</b></h6>
                    <h6 *ngIf="item.return_request.other_reason">Other Reason: <b>{{item.return_request.other_reason}}</b></h6>
                    <h6 *ngIf="item.return_request.return_method">Return Method: <b>{{item.return_request.return_method}}</b></h6>
                    <h6 *ngIf="item.return_request.refund_method">Refund Method: <b>{{item.return_request.refund_method}}</b></h6>
                    <h6 *ngIf="item.return_request.refund_method && item.return_request.refund_method == 'Refund Card'">Card Type: <b>{{order.payments[0].cardDetails.card.cardBrand}}</b></h6>
                    <h6 *ngIf="item.return_request.refund_method && item.return_request.refund_method == 'Refund Card'">Last 4: <b>{{order.payments[0].cardDetails.card.last4}}</b></h6>
                    <h6 *ngIf="item.return_request.requested_date">Requested Date: <b>{{requestedDateString}}</b></h6>
                    <h6 *ngIf="item.return_request.approved">Approved: <b>{{item.return_request.approved}}</b></h6>
                    <h6 *ngIf="item.return_request.denied">Denied: <b>{{item.return_request.denied}}</b></h6>
                    <h6 *ngIf="item.return_request.decision_date">Decision Date: <b>{{decisionDateString}}</b></h6>
                    <h6 *ngIf="item.return_request.user">User: <b>{{item.return_request.user.username}}</b></h6>
            </div>
            <div>
            <button class="btn btn-info span-button" (click)="bsModalRef.hide()">Close</button>
            </div>
        </div>
        </section>`,
    styleUrls: ['./order-box.component.scss']
})
export class ViewItemSub implements OnInit {

    list: Object;

    item: OrderItem;
    order: Order;
    dateString: string;
    decisionDateString: string;
    requestedDateString: string;
    tax: number;
    subtotal: number;
    quantity: number;
    statusDateString: string;

    constructor(public bsModalRef: BsModalRef) { }

    ngOnInit(): void {
        this.item = this.list['item'];
        this.order = this.list['order'];
        this.dateString = this.list['dateString'];
        this.quantity = this.item.quantity;
        this.subtotal = this.quantity * this.item.discount_price;
        this.tax = parseFloat((this.subtotal * parseFloat(this.order.tax_rate)).toFixed(2))
        this.statusDateString = timeToString(this.item.status._creationDate) + " " + dateToString(this.item.status._creationDate);

        console.log(this.item.sales);

        if (this.item.return_request) {
            if (this.item.return_request.requested_date != undefined) {
                this.requestedDateString = timeToString(this.item.return_request.requested_date) + " " + dateToString(this.item.return_request.requested_date);
            } else {
                this.requestedDateString = undefined;
            }
            if (this.item.return_request.decision_date != undefined) {
                this.decisionDateString = timeToString(this.item.return_request.decision_date) + " " + dateToString(this.item.return_request.decision_date);
            } else {
                this.decisionDateString = undefined;
            }
        }

    }
}

@Component({
    selector: 'app-return-submit2-sub',
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
    styleUrls: ['./order-box.component.scss']
})
export class ReturnSubmit2Sub implements OnInit {

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
    selector: 'app-drop-order-sub',
    template: `
    <section style="padding-bottom: 20px; padding-top: 20px">
    <div class="container-fluid">
          <button type="button" class="close" (click)="bsModalRef.hide()">
              <span aria-hidden="true">&times;</span>
          </button>
          <div class="modal-header">
            <h4>Drop Order</h4>
            <hr>
          </div>
          <br>
          <form (ngSubmit)="onSubmit(f.value)" #f="ngForm">
          <div class="padding">
                <h5>You have selected to <b>drop</b> this order. </h5>
            </div>
            <div class="padding">
                <h6> This is usually done when it is determined that an order can no longer be fullfilled. Be careful before dropping an order, as it can not be undone, and it is not good for customer relationships. </h6>
            </div>
            <div class="padding">
                <h6>Please give a brief description of why you are dropping this order. </h6>
                <textarea ngModel name="description" rows="5" cols="53" id="description"></textarea>
            </div>
            <div class="padding">
                <h5>Are you sure that you would like to complete this request?</h5>
            </div>
            <div class="padding">
            <button class="btn btn-primary span-button" (click)="bsModalRef.hide()">Cancel</button>
            <button class="btn btn-success span-button" type="submit">Submit</button>
            </div>
            </form>
        </div>
        </section>`,
    styleUrls: ['./order-box.component.scss']
})
export class DropOrderSub implements OnInit {

    list: Object;

    order: Order;

    constructor(public bsModalRef: BsModalRef, private http: HttpClient, private appAuthService: AppAuthenticationService, private toastr: ToastrService) { }

    ngOnInit(): void {
        this.order = this.list['order'];
    }

    onSubmit(values) {

        let description = values['description'];

        if (description.length < 15) {
            this.toastr.info("Please add more detail to your description before submitting. Thank you.", "Info");
            return;
        }

        let user = this.appAuthService.getAuthUser();

        let params = {
            user: user._id,
            description: description
        }

        let url = environment.API_URL + "/shopping/order/" + this.order._id + "/drop";

        this.http.post(url, params, {
            headers: this.appAuthService.getAuthHeader(),
            observe: 'response'
        }).subscribe(
            success => {
                this.toastr.success("You have successfully updated the status of the order", "Success!");
                setTimeout(() => {
                    location.reload();
                }, 1500);
            },
            error => {
                this.toastr.error("There was an error submitting the request.", "Error!");
            }
        );

        this.bsModalRef.hide();
    }

}



@Component({
    selector: 'app-cancel-order-sub',
    template: `
    <section style="padding-bottom: 20px; padding-top: 20px">
    <div class="container-fluid">
          <button type="button" class="close" (click)="bsModalRef.hide()">
              <span aria-hidden="true">&times;</span>
          </button>
          <div class="modal-header">
            <h4>Cancel Order</h4>
            <hr>
          </div>
          <br>
          <form (ngSubmit)="onSubmit(f.value)" #f="ngForm">
          <div class="padding">
                <h5>You have selected to <b>cancel</b> this order. </h5>
            </div>
            <div class="padding">
                <h6> This is usually done when it is determined that an order is fraudulant and should not be fulfilled. Be careful before cancelling an order, as it can not be undone, and it is not good for customer relationships. </h6>
            </div>
            <div class="padding">
                <h6>Please give a brief description of why you are cancelling this order. </h6>
                <textarea ngModel name="description" rows="5" cols="53" id="description"></textarea>
            </div>
            <div class="padding">
                <h5>Are you sure that you would like to complete this request?</h5>
            </div>
            <div class="padding">
            <button class="btn btn-primary span-button" (click)="bsModalRef.hide()">Cancel</button>
            <button class="btn btn-success span-button" type="submit">Submit</button>
            </div>
            </form>
        </div>
        </section>`,
    styleUrls: ['./order-box.component.scss']
})
export class CancelOrderSub implements OnInit {

    list: Object;

    order: Order;

    constructor(public bsModalRef: BsModalRef, private http: HttpClient, private appAuthService: AppAuthenticationService, private toastr: ToastrService) { }

    ngOnInit(): void {
        this.order = this.list['order'];
    }

    onSubmit(values) {

        let description = values['description'];

        if (description.length < 15) {
            this.toastr.info("Please add more detail to your description before submitting. Thank you.", "Info");
            return;
        }

        let user = this.appAuthService.getAuthUser();

        let params = {
            user: user._id,
            description: description
        }

        let url = environment.API_URL + "/shopping/order/" + this.order._id + "/cancel";

        this.http.post(url, params, {
            headers: this.appAuthService.getAuthHeader(),
            observe: 'response'
        }).subscribe(
            success => {
                this.toastr.success("You have successfully updated the status of the order", "Success!");
                setTimeout(() => {
                    location.reload();
                }, 1500);
            },
            error => {
                this.toastr.error("There was an error submitting the request.", "Error!");
            }
        );

        this.bsModalRef.hide();
    }

}

@Component({
    selector: 'app-view-refund-status-sub',
    template: `
    <section style="padding-bottom: 20px; padding-top: 20px">
    <div class="container-fluid">
          <button type="button" class="close" (click)="bsModalRef.hide()">
              <span aria-hidden="true">&times;</span>
          </button>
          <div class="modal-header">
            <h4>Refund Status</h4>
            <hr>
          </div>
          <br>
          <div class="padding">
                <h5>There are <b>{{order.refund_stubs.length}}</b> refund stubs for this order.</h5>
            </div>
            <div class="padding" *ngFor="let refund of order.refund_stubs">
                <h6 style="text-decoration:underline"><b>Refund Payment</b></h6>
                <h6>Amount: <b>{{"$"+(parseFloat(refund.amountMoney.amount)/100).toFixed(2)}}</b></h6>
                <h6>Currency: <b>{{refund.amountMoney.currency}}</b></h6>
                <h6>Status: <b>{{refund.status}}</b></h6>
                <h6>Location ID: <b>{{refund.locationId}}</b></h6>
                <h6>Order Id: <b>{{refund.orderId}}</b></h6>
                <h6>Created At: <b>{{refund.createdAt.toString()}}</b></h6>
                <h6>Updated At: <b>{{refund.updatedAt.toString()}}</b></h6>
                <div *ngIf="refund.processingFee.length > 0">
                    <h6 style="text-decoration:underline"><b>Processing Fee</b></h6>
                    <h6>Effective At: <b>{{refund.processingFee[0].effectiveAt.toString()}}</b></h6>
                    <h6>Type: <b>{{refund.processingFee[0].type}}</b></h6>
                    <h6>Amount: <b>{{"$"+(parseFloat(refund.processingFee[0].amountMoney.amount)/100).toFixed(2)}}</b></h6>
                    <h6>Currency: <b>{{refund.processingFee[0].amountMoney.currency}}</b></h6>
                </div>
            <button *ngIf="refundNeedsToBeUpdated(refund.id)" class="btn btn-info span-button" (click)="update(refund.id)">Update Status</button>
            </div> 
            <div class="padding">
            <button class="btn btn-success span-button" (click)="bsModalRef.hide()">Close</button>
            </div>
        </div>
        </section>`,
    styleUrls: ['./order-box.component.scss']
})
export class ViewRefundStatusSub implements OnInit {

    list: Object;

    order: Order;

    constructor(public bsModalRef: BsModalRef, private http: HttpClient, private appAuthService: AppAuthenticationService, private toastr: ToastrService) { }

    ngOnInit(): void {
        this.order = this.list['order'];
    }

    parseFloat(number): number {
        return parseFloat(number);
    }

    refundNeedsToBeUpdated(refundId): boolean {
        let filtered = this.order.refund_stubs.filter(element => element.id == refundId);
        filtered = filtered.filter(element => element.status == 'COMPLETED');

        if (filtered.length > 0) {
            return false;
        } else {
            return true;
        }
    }

    update(refundId): void {

        let url = environment.API_URL + "/shopping/order/" + this.order._id + "/refund/" + refundId;

        this.http.get(url, {
            headers: this.appAuthService.getAuthHeader(),
            observe: 'response'
        }).subscribe(
            success => {
                let body: any = success.body;

                let refund = Refund.fromJSON(body);

                this.order.refund_stubs.push(refund);

                this.toastr.success("Your request was successfully processed.", "Success!");
            },
            error => {
                this.toastr.error("There was an error processing your request.", "Error!");
            }
        )

    }

}

@Component({
    selector: 'app-confirm-process-order-sub',
    template: `
    <section style="padding-bottom: 20px; padding-top: 20px">
    <div class="container-fluid">
          <button type="button" class="close" (click)="bsModalRef.hide()">
              <span aria-hidden="true">&times;</span>
          </button>
          <div class="modal-header">
            <h4>Process Order</h4>
            <hr>
          </div>
          <br>
          <div class="padding">
                <h5>You have selected to <b>Start Processing</b> this order. </h5>
            </div>
            <div class="padding">
                <h5>Are you sure that you would like to do this?</h5>
            </div>
            <div class="padding">
                <h5>Once you start processing an order it can not be undone and it will prevent the buyer from being able to cancel their order.</h5>
            </div>
            <div class="padding">
            <button class="btn btn-primary span-button" (click)="bsModalRef.hide()">Cancel</button>
            <button class="btn btn-success span-button" (click)="submit()">Submit</button>
            </div>
        </div>
        </section>`,
    styleUrls: ['./order-box.component.scss']
})
export class ConfirmProcessOrderSub implements OnInit {

    list: Object;

    order: Order;

    constructor(public bsModalRef: BsModalRef, private http: HttpClient, private appAuthService: AppAuthenticationService, private toastr: ToastrService, private router: Router) { }

    ngOnInit(): void {
        this.order = this.list['order'];
    }

    submit(): void {

        this.bsModalRef.hide();

        let url = environment.API_URL + "/shopping/order/" + this.order._id + "/process";

        let params = {
            user: this.appAuthService.getAuthUser()._id
        }

        this.http.post(url, params, {
            headers: this.appAuthService.getAuthHeader(),
            observe: 'response'
        }).subscribe(
            success => {
                this.toastr.success("Your request was successfully processed.", "Success!");

                setTimeout(() => {
                    this.router.navigateByUrl("/order/process/" + this.order._id);
                }, 1500);
            },
            error => {
                this.toastr.error("There was an error processing your request.", "Error!");
            }
        )
    }

}
