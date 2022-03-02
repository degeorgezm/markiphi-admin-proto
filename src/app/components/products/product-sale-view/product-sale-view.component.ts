import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AppAuthenticationService } from 'src/app/_services/app-authentication.service';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Product, Sale } from 'src/app/_models/product';

@Component({
    selector: 'app-product-sale-view',
    templateUrl: './product-sale-view.component.html',
    styleUrls: ['./product-sale-view.component.scss']
})
export class ProductSaleViewComponent implements OnInit {

    public salesId: string;
    public sale: Sale;
    public loaded: boolean = false;
    public product: Product;
    public productId: string;
    public closeResult: string;

    constructor(private modalService: NgbModal, private activatedRoute: ActivatedRoute, private router: Router, private http: HttpClient, private toastr: ToastrService, private appAuthService: AppAuthenticationService) {
    }

    ngOnInit() {

        this.appAuthService.tokenAuthenticate(() => {

            this.activatedRoute.params.subscribe(parameter => {
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
        this.router.navigateByUrl("/products/product-sales-edit/" + this.productId + "/sale/" + this.salesId);
    }

    exit() {
        this.router.navigateByUrl("/products/product-sales/" + this.productId);
    }

    delete() {
        console.log("Delete pressed");
    }
}

