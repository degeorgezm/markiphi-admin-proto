import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AppAuthenticationService } from 'src/app/_services/app-authentication.service';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { Variant } from 'src/app/_models/sku';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Product } from 'src/app/_models/product';
import { blobToBase64 } from 'src/app/_models/macros';

@Component({
    selector: 'app-variant-view',
    templateUrl: './variant-view.component.html',
    styleUrls: ['./variant-view.component.scss']
})
export class VariantViewComponent implements OnInit {

    public variantId: string;
    public variant: Variant;
    public variants: Variant[] = [];
    public loaded: boolean = false;
    public closeResult: string;
    public products: Product[] = [];

    public defualtImage = "assets/images/variant-color.jpg";
    public url = {
        img: this.defualtImage,
    }

    constructor(private modalService: NgbModal, private activatedRoute: ActivatedRoute, private router: Router, private http: HttpClient, private toastr: ToastrService, private appAuthService: AppAuthenticationService) {
    }

    ngOnInit() {

        this.appAuthService.tokenAuthenticate(() => {

            this.activatedRoute.params.subscribe(parameter => {
                this.variantId = parameter.variantId;

                let url = environment.API_URL + "/variants"
                this.http.get(url, { headers: this.appAuthService.getAuthHeader(), observe: 'response' }).subscribe(
                    success => {
                        let body: any = success.body;

                        body.forEach(element => {
                            let variant = Variant.fromJSON(element);
                            this.variants.push(variant);
                        });

                        let filtered = this.variants.filter(element => element._id == this.variantId);
                        this.variant = filtered[0];

                        if (this.variant.image != undefined) {
                            this.url.img = this.variant.image;
                        }

                        this.fetchProducts();
                    },
                    error => {
                        this.toastr.error("Error loading page", "Error!");
                        this.router.navigateByUrl("/skus/manage-skus");
                    });
            });
        });
    }


    fetchProducts() {

        let url = environment.API_URL + "/fetch/variant/" + this.variant._id;

        this.http.get(url, { observe: 'response' }).subscribe(
            success => {
                let body: any = success.body;

                body.forEach(element => {
                    let product = Product.fromJSON(element);
                    this.products.push(product);
                });

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
                this.toastr.error("Error loading page", "Error!");
                this.router.navigateByUrl("/skus/manage-skus");
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
        this.router.navigateByUrl("skus/variant-edit/" + this.variantId);
    }

    exit() {
        this.router.navigateByUrl("/skus/manage-skus?tab=variants");
    }

    delete() {

    }
}

