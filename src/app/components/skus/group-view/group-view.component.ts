import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AppAuthenticationService } from 'src/app/_services/app-authentication.service';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { Group } from 'src/app/_models/sku';
import { Product } from 'src/app/_models/product'
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { blobToBase64 } from 'src/app/_models/macros';

@Component({
    selector: 'app-group-view',
    templateUrl: './group-view.component.html',
    styleUrls: ['./group-view.component.scss']
})
export class GroupViewComponent implements OnInit {

    public groupId: string;
    public group: Group;
    public groups: Group[] = [];
    public loaded: boolean = false;
    public closeResult: string;
    public products: Product[] = [];

    constructor(private modalService: NgbModal, private activatedRoute: ActivatedRoute, private router: Router, private http: HttpClient, private toastr: ToastrService, private appAuthService: AppAuthenticationService) {
    }

    ngOnInit() {

        this.appAuthService.tokenAuthenticate(() => {

            this.activatedRoute.params.subscribe(parameter => {
                this.groupId = parameter.groupId;

                let url = environment.API_URL + "/groups"
                this.http.get(url, { headers: this.appAuthService.getAuthHeader(), observe: 'response' }).subscribe(
                    success => {
                        let body: any = success.body;

                        body.forEach(element => {
                            let group = Group.fromJSON(element);
                            this.groups.push(group);
                        });

                        let filtered = this.groups.filter(element => element._id == this.groupId);
                        this.group = filtered[0];
                        this.fetchProducts()
                    },
                    error => {
                        this.toastr.error("Error loading page", "Error!");
                        this.router.navigateByUrl("/skus/manage-skus");
                    });
            });
        });
    }

    fetchProducts() {

        let url = environment.API_URL + "/fetch/group/" + this.group._id;

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
        this.router.navigateByUrl("skus/group-edit/" + this.groupId);
    }

    exit() {
        this.router.navigateByUrl("/skus/manage-skus?tab=groups");
    }

    delete() {

    }
}

