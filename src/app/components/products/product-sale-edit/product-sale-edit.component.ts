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
import { Sale } from 'src/app/_models/product';

@Component({
    selector: 'app-product-sale-edit',
    templateUrl: './product-sale-edit.component.html',
    styleUrls: ['./product-sale-edit.component.scss']
})
export class ProductSaleEditComponent implements OnInit {

    public product: Product;
    public productId: String;
    public salesId: String;
    public sale: Sale;
    public loaded: boolean = false;
    public user: User;

    constructor(private http: HttpClient, private modalService: NgbModal, private appAuthService: AppAuthenticationService, private toastr: ToastrService, private route: ActivatedRoute, private router: Router) { }

    ngOnInit() {
        this.appAuthService.tokenAuthenticate(() => {

            this.user = this.appAuthService.getAuthUser();

            this.route.params.subscribe(parameter => {
                this.productId = parameter.productId;
                this.salesId = parameter.salesId;

                let url = environment.API_URL + "/product/" + this.productId;

                this.http.get(url, { observe: 'response' }).subscribe(
                    success => {
                        let body = success.body;
                        this.product = Product.fromJSON(body);

                        let filtered = this.product.sales.filter(element => (element._id == this.salesId));
                        this.sale = filtered[0];

                        this.loaded = true;
                    });
            });
        });
    }

    editSale(values) {

        values["user"] = this.user._id;

        console.log(values);

        let url = environment.API_URL + "/product/" + this.productId + "/sale/" + this.salesId;

        this.http.post(url, values, { headers: this.appAuthService.getAuthHeader(), observe: 'response' })
            .subscribe(
                success => {
                    this.toastr.success("Sale has been successfully updated", "Success!");
                    this.router.navigateByUrl("/products/product-sales-view/" + this.productId + "/sale/" + this.salesId);
                },
                error => {
                    this.toastr.success("Error updating sale", "Error!");
                });
    }
}
