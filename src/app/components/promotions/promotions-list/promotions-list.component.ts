import { Component, OnInit } from '@angular/core';
import { Product, PriceChange } from 'src/app/_models/product';
import { HttpClient } from '@angular/common/http';
import { AppAuthenticationService } from 'src/app/_services/app-authentication.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ThemePalette } from '@angular/material/core';
import { FormControl } from '@angular/forms';
import { Promotion } from 'src/app/_models/promotion';

@Component({
    selector: 'app-promotions-list',
    templateUrl: './promotions-list.component.html',
    styleUrls: ['./promotions-list.component.scss']
})
export class PromotionsListComponent implements OnInit {

    public product: Product;
    public productId: String;
    public loaded: boolean = false;

    public activeTab: string = "active";
    public dtOptions: DataTables.Settings = {};

    public promotions: Promotion[] = [];
    public active: Promotion[] = [];
    public past: Promotion[] = [];
    public future: Promotion[] = [];

    public price_changes: PriceChange[] = [];

    constructor(private http: HttpClient, private modalService: NgbModal, private appAuthService: AppAuthenticationService, private toastr: ToastrService, private route: ActivatedRoute, private router: Router) { }

    ngOnInit() {
        this.appAuthService.tokenAuthenticate(() => {

            this.route.queryParams.subscribe(params => {
                if (params['tab'] != undefined) {
                    this.activeTab = params['tab'];
                }
            });

            this.http.get(environment.API_URL + "/promotion", { headers: this.appAuthService.getAuthHeader(), observe: 'response' }).subscribe(
                success => {
                    // continue to site
                    let body: any = success.body;
                    for (let i = 0; i < body.length; i++) {
                        let promotion = Promotion.fromJSON(body[i]);
                        this.promotions.push(promotion);
                    }

                    this.active = this.promotions.filter(element => (element.active == true));
                    this.future = this.promotions.filter(element => (element.start > new Date()));
                    this.past = this.promotions.filter(element => (element.end < new Date()));

                    this.loaded = true;
                },
                error => {
                    this.toastr.error("There was an error fetching your promotions", "Error!");
                });
        });
    }

    goToCreateNewPromotion() {
        this.router.navigateByUrl("/promotions/promotions-create");
    }

    viewPromotion(id) {
        this.router.navigateByUrl("/promotions/promotions-view/" + id);
    }

    editPromotion(id) {
        this.router.navigateByUrl("/promotions/promotions-edit/" + id);
    }
}
