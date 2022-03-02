import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Order, OrderStatusEnum } from 'src/app/_models/shop';
import { User } from 'src/app/_models/user';
import { AppAuthenticationService } from 'src/app/_services/app-authentication.service';
import { blobToBase64 } from 'src/app/_models/macros';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-order-process',
    templateUrl: './order-process.component.html',
    styleUrls: ['./order-process.component.scss']
})
export class OrderProcessComponent implements OnInit {
    bsModalRef: BsModalRef;

    public loaded: boolean = false;
    public user: User;

    public order: Order;
    public orderId: string;

    constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient, private toastr: ToastrService, private appAuthService: AppAuthenticationService, private modalService: BsModalService) { }

    ngOnInit() {

        this.appAuthService.tokenAuthenticate(() => {
            this.route.params.subscribe(params => {
                this.orderId = params['orderId'];

                let url = environment.API_URL + "/shopping/order/" + this.orderId;

                this.http.get(url, {
                    headers: this.appAuthService.getAuthHeader(),
                    observe: 'response'
                }).subscribe(
                    success => {
                        let body: any = success.body;

                        this.order = Order.fromJSON(body);

                        this.loaded = true;

                        this.order.items.forEach(item => {
                            this.http.get(environment.API_URL + "/product/" + item.product._id + "/photo/download", { observe: 'response', responseType: 'blob' })
                                .subscribe(
                                    success => {
                                        blobToBase64(success.body, result => {
                                            item.product.image.src = result;
                                        });
                                    },
                                    error => {
                                        console.log("Error fetching image");
                                    });
                        });
                    },
                    error => {
                        console.log("Error loading order: " + error.error);
                    }
                );
            });
        });
    }

    reviewChange() {

        if ($('#review').is(':checked')) {
            const initialState = {
                list: {}
            }

            this.bsModalRef = this.modalService.show(ConfirmReviewProceduresSub, { initialState });
        }

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
            <h4>Confirm</h4>
            <hr>
          </div>
          <br>
          <div class="padding">
                <h5>By selecting this you are confirming that you have read and reviewed the <b>Order Processing Procedures</b>, and are prepared to continue with the processing of the order.</h5>
            </div>
            <div class="padding">
                <h5>If you still need to review the <b>Order Processing Procedures</b> they can be found <a href="javascript:void(0)">here</a>, and are available for download.</h5>
            </div>
            <div class="padding">
                <h5>Are you sure you are prepared to continue?</h5>
            </div>
            <div class="padding">
            <button class="btn btn-primary span-button" (click)="cancel()">Cancel</button>
            <button class="btn btn-success span-button" (click)="confirm()">Confirm</button>
            </div>
        </div>
        </section>`,
    styleUrls: ['./order-process.component.scss']
})
export class ConfirmReviewProceduresSub implements OnInit {

    list: Object;

    constructor(public bsModalRef: BsModalRef, private http: HttpClient, private appAuthService: AppAuthenticationService, private toastr: ToastrService, private router: Router) { }

    ngOnInit(): void {
    }

    confirm(): void {
        this.bsModalRef.hide();
        $("#invoice").prop('disabled', false);
        $("#review").prop("disabled", true);
    }

    cancel(): void {
        $('#review').prop('checked', false);
        this.bsModalRef.hide();
    }

}
