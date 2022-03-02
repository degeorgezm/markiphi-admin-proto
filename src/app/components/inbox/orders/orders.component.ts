import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Order } from 'src/app/_models/shop';
import { ToastrService } from 'ngx-toastr';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AppAuthenticationService } from 'src/app/_services/app-authentication.service';
import { blobToBase64 } from 'src/app/_models/macros';
@Component({
    selector: 'app-orders-processed',
    templateUrl: './orders.component.html',
    styleUrls: ['./orders.component.scss']
})
export class OrdersProcessingComponent implements OnInit {

    public orders: Order[] = [];
    public loaded: boolean = false;
    public error: boolean = false;
    public mobile: boolean;

    constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient, private toastr: ToastrService, private deviceService: DeviceDetectorService, private appAuthService: AppAuthenticationService) {
    }

    ngOnInit() {

        this.appAuthService.tokenAuthenticate(() => {

            let url = environment.API_URL + "/shopping/orders/status";
            let params = {
                status: "Purchased"
            }

            this.http.post(url, params, {
                headers: this.appAuthService.getAuthHeader(),
                observe: 'response'
            }).subscribe(
                success => {
                    let body: any = success.body;

                    body.forEach(element => {
                        let order = Order.fromJSON(element);

                        this.orders.push(order);
                    });

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
