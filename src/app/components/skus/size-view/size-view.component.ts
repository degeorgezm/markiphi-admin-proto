import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AppAuthenticationService } from 'src/app/_services/app-authentication.service';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { Size } from 'src/app/_models/sku';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-size-view',
    templateUrl: './size-view.component.html',
    styleUrls: ['./size-view.component.scss']
})
export class SizeViewComponent implements OnInit {

    public sizeId: string;
    public size: Size;
    public sizes: Size[] = [];
    public loaded: boolean = false;
    public closeResult: string;

    constructor(private modalService: NgbModal, private activatedRoute: ActivatedRoute, private router: Router, private http: HttpClient, private toastr: ToastrService, private appAuthService: AppAuthenticationService) {
    }

    ngOnInit() {

        this.appAuthService.tokenAuthenticate(() => {

            this.activatedRoute.params.subscribe(parameter => {
                this.sizeId = parameter.sizeId;

                let url = environment.API_URL + "/sizes"
                this.http.get(url, { headers: this.appAuthService.getAuthHeader(), observe: 'response' }).subscribe(
                    success => {
                        let body: any = success.body;

                        body.forEach(element => {
                            let size = Size.fromJSON(element);
                            this.sizes.push(size);
                        });

                        let filtered = this.sizes.filter(element => element._id == this.sizeId);
                        this.size = filtered[0];
                        this.loaded = true;
                    },
                    error => {
                        this.toastr.error("Error loading page", "Error!");
                        this.router.navigateByUrl("/skus/manage-skus");
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
        this.router.navigateByUrl("skus/size-edit/" + this.sizeId);
    }

    exit() {
        this.router.navigateByUrl("/skus/manage-skus?tab=sizes");
    }

    delete() {

    }
}

