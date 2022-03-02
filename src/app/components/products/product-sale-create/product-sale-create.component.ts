import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { Product, PriceChange } from 'src/app/_models/product';
import { HttpClient } from '@angular/common/http';
import { AppAuthenticationService } from 'src/app/_services/app-authentication.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ThemePalette } from '@angular/material/core';
import { FormControl } from '@angular/forms';
import { User } from 'src/app/_models/user';

@Component({
    selector: 'app-product-sale-create',
    templateUrl: './product-sale-create.component.html',
    styleUrls: ['./product-sale-create.component.scss']
})
export class ProductSaleCreateComponent implements OnInit {

    public product: Product;
    public productId: String;
    public loaded: boolean = false;
    public user: User;

    constructor(private http: HttpClient, private modalService: NgbModal, private appAuthService: AppAuthenticationService, private toastr: ToastrService, private route: ActivatedRoute, private router: Router) { }

    ngOnInit() {
        this.appAuthService.tokenAuthenticate(() => {

            this.user = this.appAuthService.getAuthUser();

            this.route.params.subscribe(parameter => {
                this.productId = parameter.productId;

                this.http.get(environment.API_URL + "/product/" + this.productId, { observe: 'response' }).subscribe(
                    success => {
                        let body = success.body;
                        this.product = Product.fromJSON(body);

                        this.loaded = true;
                    });
            });
        });
    }

    createSale(values) {

        let start = new Date(values["start"]);
        let end = new Date(values["end"]);

        if (start >= end) {
            this.toastr.error("End date must be after start date.", "Error!");
            return;
        }

        values["user"] = this.user._id;

        console.log(values);

        let url = environment.API_URL + "/product/" + this.productId + "/sale";

        this.http.post(url, values, { headers: this.appAuthService.getAuthHeader(), observe: 'response' })
            .subscribe(
                success => {
                    this.toastr.success("Sale has been successfully created", "Success!");
                    this.router.navigateByUrl("/products/product-sales/" + this.productId);
                },
                error => {
                    this.toastr.success("Error creating sale", "Error!");
                });
    }
}
