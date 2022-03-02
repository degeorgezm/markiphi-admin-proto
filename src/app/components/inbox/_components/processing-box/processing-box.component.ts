import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { Order } from 'src/app/_models/shop';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { environment } from 'src/environments/environment';
import { dateToString, timeToString } from 'src/app/_models/macros';

@Component({
    selector: 'app-processing-box',
    templateUrl: './processing-box.component.html',
    styleUrls: ['./processing-box.component.scss']
})
export class ProcessingBoxComponent implements OnInit, AfterViewInit {
    bsModalRef: BsModalRef;

    @Input() order: Order;

    public orderDateString: string;
    public orderTimeString: string;
    public orderStatusString: string;
    public orderString: string;

    constructor(private modalService: BsModalService) { }

    ngOnInit(): void {

        this.orderDateString = dateToString(this.order._creationDate);
        this.orderTimeString = timeToString(this.order._creationDate);

        this.orderStatusString = this.order.status[this.order.status.length - 1].status;
        this.orderString = "This order still has to be processed and shipped."
    }

    ngAfterViewInit(): void {
        $("#id_" + this.order._id).css('display', 'none');
        $("#id_" + this.order._id + ' + .class_' + this.order._id).css('max-height', '0px');
        $("#id_" + this.order._id + ' + .class_' + this.order._id).css('overflow', 'hidden');
        $("#id_" + this.order._id + ' + .class_' + this.order._id).css('transition', 'all .7s ease');

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

    startProcessing() {
        const initialState = {
            list: {
                order: this.order
            }
        }

        this.bsModalRef = this.modalService.show(StartProcessingOrderSub, { initialState });
    }
}




@Component({
    selector: 'app-start-processing-order-sub',
    template: `
    <section style="padding-bottom: 20px; padding-top: 20px">
    <div class="container-fluid">
          <button type="button" class="close" (click)="bsModalRef.hide()">
              <span aria-hidden="true">&times;</span>
          </button>
            <div>
            <h4>Start Processing Order</h4>
            <hr>
            </div>
            <div>
                <h6>Would you like to start processing this order for delivery?</h6>
            </div>
            <br>
            <div>
                <h5>Order Details</h5>
                <h6>Order ID: <b>{{order.orderId}}</b></h6>
                <h6>User: <b>{{order.user.username}}</b></h6>
                <h6>Total Unique Products: <b>{{order.totalProducts}}</b></h6>
                <h6>Total Items: <b>{{order.totalItems}}</b></h6>
                <h6>Sub Total: <b>{{"$"+order.sub_total}}</b></h6>
                <h6>Total: <b>{{"$"+order.total}}</b></h6>
            </div>
            <br>
            <div>
                <h5>Shipping Details</h5>
                <h6><b>{{order.shipping_address.name}}</b></h6>
                <h6><b>{{order.shipping_address.address1}}</b></h6>
                <h6 *ngIf="order.shipping_address.address2"><b>{{order.shipping_address.address2}}</b></h6>
                <h6><b>{{order.shipping_address.city}}, {{order.shipping_address.state}} {{order.shipping_address.zip}}</b></h6>
                <h6><b>Phone: {{order.shipping_address.phone}}</b></h6>
            </div>
            <br>
            <div>
            <h6>It has been <b>{{order.hoursSinceOrder}}</b> hours since this order has been placed.</h6>
            </div>
            <br>
            <div>
            <button class="btn btn-success span-button" (click)="bsModalRef.hide()">Start Processing</button>
            <button class="btn btn-primary span-button" (click)="bsModalRef.hide()" style="margin-top: 15px;">Close</button>
            </div>
        </div>
        </section>`,
    styleUrls: ['./processing-box.component.scss']
})
export class StartProcessingOrderSub implements OnInit {

    list: Object;

    order: Order;
    app_name: string;

    constructor(public bsModalRef: BsModalRef) { }

    ngOnInit(): void {
        this.order = this.list['order'];
        this.app_name = environment.APP_NAME;
    }
}


