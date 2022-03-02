import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AppAuthenticationService } from 'src/app/_services/app-authentication.service';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Product } from 'src/app/_models/product';
import { Department, Type, Group, Variant, Brand } from 'src/app/_models/sku';
import { Promotion } from 'src/app/_models/promotion';
import { blobToBase64 } from 'src/app/_models/macros';

@Component({
    selector: 'app-promotions-view',
    templateUrl: './promotions-view.component.html',
    styleUrls: ['./promotions-view.component.scss']
})
export class PromotionsViewComponent implements OnInit {

    public promotionId: string;
    public promotion: Promotion;
    public loaded: boolean = false;
    public products: Product[] = [];
    public closeResult: string;

    public brandNames: String[] = [];
    public departmentNames: String[] = [];
    public typeNames: String[] = [];
    public variantNames: String[] = [];
    public groupNames: String[] = [];

    constructor(private modalService: NgbModal, private activatedRoute: ActivatedRoute, private router: Router, private http: HttpClient, private toastr: ToastrService, private appAuthService: AppAuthenticationService) {
    }

    ngOnInit() {

        this.appAuthService.tokenAuthenticate(() => {

            this.activatedRoute.params.subscribe(parameter => {
                this.promotionId = parameter.promotionId;

                let url = environment.API_URL + "/promotion/" + this.promotionId;
                this.http.get(url, { headers: this.appAuthService.getAuthHeader(), observe: 'response' }).subscribe(
                    success => {
                        let body: any = success.body;

                        this.promotion = Promotion.fromJSON(body);

                        if (this.promotion.brands.length > 0) {
                            for (let i = 0; i < this.promotion.brands.length; i++) {
                                let name = this.promotion.brands[i].name;
                                this.brandNames.push(name);
                            }
                        }

                        if (this.promotion.departments.length > 0) {
                            for (let i = 0; i < this.promotion.departments.length; i++) {
                                let name = this.promotion.departments[i].name;
                                this.departmentNames.push(name);
                            }
                        }

                        if (this.promotion.types.length > 0) {
                            for (let i = 0; i < this.promotion.types.length; i++) {
                                let name = this.promotion.types[i].name;
                                this.typeNames.push(name);
                            }
                        }

                        if (this.promotion.variants.length > 0) {
                            for (let i = 0; i < this.promotion.variants.length; i++) {
                                let name = this.promotion.variants[i].name;
                                this.variantNames.push(name);
                            }
                        }

                        if (this.promotion.groups.length > 0) {
                            for (let i = 0; i < this.promotion.groups.length; i++) {
                                let name = this.promotion.groups[i].name;

                                this.groupNames.push(name);
                            }
                        }

                        let url2 = environment.API_URL + "/promotion/" + this.promotionId + "/products";
                        this.http.get(url2, { headers: this.appAuthService.getAuthHeader(), observe: 'response' }).subscribe(
                            success => {
                                let body: any = success.body;

                                console.log(body);

                                for (let i = 0; i < body.length; i++) {
                                    let product = Product.fromJSON(body[i]);
                                    this.products.push(product);
                                }

                                for (let i = 0; i < this.products.length; i++) {
                                    this.http.get(environment.API_URL + "/product/" + this.products[i]._id + "/photo/download", { observe: 'response', responseType: 'blob' })
                                        .subscribe(
                                            success => {

                                                blobToBase64(success.body, result => {
                                                    this.products[i].image.src = result;
                                                })
                                            },
                                            error => {
                                                console.log("Error fetching image");
                                            });
                                }

                                this.loaded = true;
                            },
                            error => {
                                this.toastr.error("Error fetching products", "Error!");
                                this.loaded = true;
                            })
                    },
                    error => {
                        this.toastr.error("Error loading promotion. Please reload.", "Error!");
                        this.router.navigateByUrl("/promotions/promotions-list?tab=promotions");
                    });
            });
        });
    }

    open(content) {
        this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
            this.closeResult = `${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            console.log(this.closeResult);
        });
    }

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }

    edit() {
        this.router.navigateByUrl("/promotions/promotions-edit/" + this.promotionId);
    }

    exit() {
        this.router.navigateByUrl("/promotions/promotions-list?tab=promotions");
    }

    delete() {
        console.log("Delete pressed");
    }
}

