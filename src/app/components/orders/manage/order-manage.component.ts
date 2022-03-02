import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Order, OrderStatusEnum } from 'src/app/_models/shop';
import { User } from 'src/app/_models/user';
import { AppAuthenticationService } from 'src/app/_services/app-authentication.service';

@Component({
    selector: 'app-order-manage',
    templateUrl: './order-manage.component.html',
    styleUrls: ['./order-manage.component.scss']
})
export class OrderManageComponent implements OnInit {

    public loaded: boolean = false;
    public user: User;
    public dtOptions: DataTables.Settings = {};
    public activeTab: string = "all";

    public orders: Order[] = [];
    public orders_purchased: Order[] = [];
    public orders_processing: Order[] = [];
    public orders_waitlisted: Order[] = [];
    public orders_dropped: Order[] = [];
    public orders_cancelled: Order[] = [];
    public orders_shipped: Order[] = [];
    public orders_delivered: Order[] = [];

    constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient, private toastr: ToastrService, private appAuthService: AppAuthenticationService) {
        this.dtOptions = {
            pagingType: 'full_numbers',
            processing: true
        };
    }

    ngOnInit() {

        this.appAuthService.tokenAuthenticate(() => {
            this.route.queryParams.subscribe(params => {
                if (params['tab'] != undefined) {
                    this.activeTab = params['tab'];
                }
            });

            let url = environment.API_URL + "/shopping/orders";

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

                    this.orders_purchased = this.orders.filter(element => element.getStatus().status == OrderStatusEnum.PURCHASED);
                    this.orders_processing = this.orders.filter(element => element.getStatus().status == OrderStatusEnum.PROCESSING);
                    this.orders_waitlisted = this.orders.filter(element => element.getStatus().status == OrderStatusEnum.WAITLISTED);
                    this.orders_dropped = this.orders.filter(element => element.getStatus().status == OrderStatusEnum.DROPPED);
                    this.orders_cancelled = this.orders.filter(element => element.getStatus().status == OrderStatusEnum.CANCELLED);
                    this.orders_shipped = this.orders.filter(element => element.getStatus().status == OrderStatusEnum.SHIPPED);
                    this.orders_delivered = this.orders.filter(element => element.getStatus().status == OrderStatusEnum.DELIVERED);

                    this.loaded = true;

                },
                error => {
                    console.log("Error loading orders: " + error.error);

                    this.loaded = true;
                }
            );
        });
    }
}
