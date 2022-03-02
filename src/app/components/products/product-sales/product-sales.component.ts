import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { Product, PriceChange, Sale } from 'src/app/_models/product';
import { HttpClient } from '@angular/common/http';
import { AppAuthenticationService } from 'src/app/_services/app-authentication.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { blobToBase64 } from 'src/app/_models/macros';

@Component({
    selector: 'app-product-sales',
    templateUrl: './product-sales.component.html',
    styleUrls: ['./product-sales.component.scss']
})
export class ProductSalesComponent implements OnInit {
    bsModalRef: BsModalRef;

    @ViewChild('pageoverlay') overlay: ElementRef;
    @ViewChild('picker') picker: any;

    public product: Product;
    public productId: String;
    public loaded: boolean = false;

    public activeTab: string = "active";
    public dtOptions: DataTables.Settings = {};

    public sales: Sale[] = [];
    public active: Sale[] = [];
    public past: Sale[] = [];
    public future: Sale[] = [];

    public price_changes: PriceChange[] = [];

    constructor(private http: HttpClient, private modalService: BsModalService, private appAuthService: AppAuthenticationService, private toastr: ToastrService, private route: ActivatedRoute, private router: Router) { }

    ngOnInit() {
        this.appAuthService.tokenAuthenticate(() => {

            this.route.queryParams.subscribe(params => {
                if (params['tab'] != undefined) {
                    this.activeTab = params['tab'];
                }
            })

            this.route.params.subscribe(parameter => {
                this.productId = parameter.productId;


                this.http.get(environment.API_URL + "/product/" + this.productId, { observe: 'response' }).subscribe(
                    success => {
                        let body = success.body;
                        this.product = Product.fromJSON(body);

                        this.sales = this.product.sales != undefined ? this.product.sales : [];

                        this.active = this.sales.filter(element => (element.active == true));
                        this.future = this.sales.filter(element => (element.start > new Date()));
                        this.past = this.sales.filter(element => (element.end < new Date()));

                        this.price_changes = this.product.price_changes != undefined ? this.product.price_changes : [];

                        this.loaded = true;

                        this.http.get(environment.API_URL + "/product/" + this.product._id + "/photo/download", { observe: 'response', responseType: 'blob' })
                            .subscribe(
                                success => {

                                    //this.toastr.success("Your product has been successfully fetched!", "Success!");
                                    blobToBase64(success.body, result => {
                                        this.product.image.src = result;
                                    })
                                },
                                error => {
                                    console.log("Error fetching image");
                                });

                    });
            });
        });
    }

    goToCreateNewSale() {
        this.router.navigateByUrl("/products/product-sales-create/" + this.productId);
    }

    viewPriceChange(i) {
        const initialState = {
            list: {
                price_change: this.price_changes[i],
                product: this.product
            }
        }

        if (i > 0) {
            initialState.list['previous'] = this.price_changes[i - 1];
        }

        this.bsModalRef = this.modalService.show(ViewPricecChangeSub, { initialState });
    }
}



@Component({
    selector: 'app-view-price-changes-sub',
    template: `
    <section style="padding-bottom: 20px; padding-top: 20px">
    <div class="container-fluid">
          <button type="button" class="close" (click)="bsModalRef.hide()">
              <span aria-hidden="true">&times;</span>
          </button>
            <div>
            <h4>View Price Change</h4>
            <hr>
            </div>
            <div>
                <div class="top-image">
                <a href="javascript:void(0)" [routerLink]="['/products/product-detail/', product._id]" (click)="bsModalRef.hide()"><img [src]="product.image.src" width="100px" height="100px"></a>
                </div>
                <div class="top-title" id="id_100">
                    <a href="javascript:void(0)" [routerLink]="['/products/product-detail/', product._id]" (click)="bsModalRef.hide()">{{product.title}}</a>
                </div>
            </div>
            <br>
            <div>
                <h5>Price Change</h5>
                <br>
                <h6>ID: <b>{{price_change._id}}</b></h6>
                <h6>Price: <b>{{"$"+price_change.price}}</b></h6>
                <h6 *ngIf="previous != undefined">Previous Price: <b>{{"$"+previous.price}}</b></h6>
                <h6 *ngIf="previous == undefined">Previous Price: <b>Undefined</b></h6>
                <h6>Date: <b>{{price_change.date.toString()}}</b></h6>
                <h6>User: <b>{{price_change.user.username}}</b></h6>
                <h6>Creation Date: <b>{{price_change._creationDate.toString()}}</b></h6>
                <h6>Updated Date: <b>{{price_change._updatedDate.toString()}}</b></h6>
            </div>
            <br>
            <div>
            <button class="btn btn-info span-button" (click)="bsModalRef.hide()" style="margin-top: 15px;">Close</button>
            </div>
        </div>
        </section>`,
    styleUrls: ['./product-sales.component.scss']
})
export class ViewPricecChangeSub implements OnInit {

    list: Object;

    price_change: PriceChange;
    product: Product;
    previous?: PriceChange

    constructor(public bsModalRef: BsModalRef) { }

    ngOnInit(): void {
        this.price_change = this.list['price_change'];
        this.product = this.list['product'];

        if (this.list.hasOwnProperty('previous')) {
            this.previous = this.list['previous'];
        } else {
            this.previous = undefined;
        }
    }
}


