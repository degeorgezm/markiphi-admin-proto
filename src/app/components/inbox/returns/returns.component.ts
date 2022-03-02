import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Order, StockStatusEnum } from 'src/app/_models/shop';
import { ToastrService } from 'ngx-toastr';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AppAuthenticationService } from 'src/app/_services/app-authentication.service';
import { User } from 'src/app/_models/user';
import { blobToBase64 } from 'src/app/_models/macros';
@Component({
    selector: 'app-returns-processed',
    templateUrl: './returns.component.html',
    styleUrls: ['./returns.component.scss']
})
export class ReturnsProcessingComponent implements OnInit {

    public orders: Order[] = [];
    public loaded: boolean = false;
    public error: boolean = false;
    public mobile: boolean;
    public user: User;

    public _items = [];
    public _orders = [];

    constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient, private toastr: ToastrService, private deviceService: DeviceDetectorService, private appAuthService: AppAuthenticationService) {
    }

    ngOnInit() {

        this.appAuthService.tokenAuthenticate(() => {

            this.user = this.appAuthService.getAuthUser();

            let url = environment.API_URL + "/shopping/orders/return/requests";


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

                    console.log(this.orders.length);

                    for (let i = 0; i < this.orders.length; i++) {
                        for (let j = 0; j < this.orders[i].items.length; j++) {
                            if (this.orders[i].items[j].status.status == StockStatusEnum.RETURN_REQUESTED) {
                                this._items.push(this.orders[i].items[j]);
                                this._orders.push(this.orders[i]);
                            }
                        }
                    }

                    this.loaded = true;

                    this.orders.forEach(order => {
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
                    console.log("Error fetching Orders");
                    this.loaded = true;
                    this.error = true;
                }
            );
        });
    }
}
