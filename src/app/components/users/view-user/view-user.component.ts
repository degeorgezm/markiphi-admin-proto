import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppAuthenticationService } from 'src/app/_services/app-authentication.service';
import { User } from 'src/app/_models/user';
import { environment } from 'src/environments/environment';
import { Order, OrderItem, StockStatusEnum, isReturnEnum } from 'src/app/_models/shop';
import { blobToBase64 } from 'src/app/_models/macros';

@Component({
    selector: 'app-view-user',
    templateUrl: './view-user.component.html',
    styleUrls: ['./view-user.component.scss']
})
export class ViewUserComponent implements OnInit {

    public activeTab: string = "summary";
    public user: User;
    public userId: string;
    public birthday: string;
    public loaded: boolean = false;
    public loaded2: boolean = false;
    public orders: Order[] = [];

    public _orders: Order[] = [];
    public _returnItems: OrderItem[] = [];
    public _returnOrders: Order[] = [];

    constructor(private http: HttpClient, private toastr: ToastrService, private appAuthService: AppAuthenticationService, private route: ActivatedRoute) {
        this.route.queryParams.subscribe(params => {
            if (params['tab'] != undefined) {
                this.activeTab = params['tab'];
            }
        })

        this.route.paramMap.subscribe(params => {
            this.userId = params.get('userId');

            let url = environment.API_URL + "/user/" + this.userId;
            this.http.get(url, {
                headers: this.appAuthService.getAuthHeader(),
                observe: 'response'
            }).subscribe(
                success => {
                    let body = success.body;

                    this.user = User.fromJSON(body);

                    this.loaded = true;

                    this.orders = [];
                    let url = environment.API_URL + "/shopping/" + this.userId + "/orders";
                    this.http.get(url, {
                        headers: this.appAuthService.getAuthHeader(),
                        observe: 'response'
                    }).subscribe(
                        success => {
                            let body: any = success.body;

                            body.forEach(element => {
                                let order = Order.fromJSON(element);
                                this.orders.push(order);
                            });

                            this.orders.forEach(order => {
                                order.items.forEach(item => {
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
                            });
                        }
                    );
                },
                error => {
                    this.toastr.error("There was an error retrieving the user. Please try again.", "Error!");
                }
            )
        })

    }

    ngOnInit() {
        this.retrieveReturns()
    }

    retrieveReturns() {

        this._returnOrders = [];
        this._returnItems = [];

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

                    this._orders.push(order);
                });

                for (let i = 0; i < this._orders.length; i++) {
                    for (let j = 0; j < this._orders[i].items.length; j++) {
                        if (isReturnEnum(this._orders[i].items[j].status.status)) {
                            this._returnItems.push(this._orders[i].items[j]);
                            this._returnOrders.push(this._orders[j]);

                        }
                    }
                }

                this._orders.forEach(order => {
                    order.items.forEach(item => {

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
                });
            },
            error => {
                console.log("Error fetching return orders in View User.");
            }
        )
    }
}