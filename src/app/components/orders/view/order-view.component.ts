import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Order, OrderStatusEnum } from 'src/app/_models/shop';
import { User } from 'src/app/_models/user';
import { AppAuthenticationService } from 'src/app/_services/app-authentication.service';
import { blobToBase64 } from 'src/app/_models/macros';

@Component({
    selector: 'app-order-view',
    templateUrl: './order-view.component.html',
    styleUrls: ['./order-view.component.scss']
})
export class OrderViewComponent implements OnInit {

    public loaded: boolean = false;
    public orderId: string;
    public order: Order;

    constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient, private toastr: ToastrService, private appAuthService: AppAuthenticationService) {

    }

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
}
