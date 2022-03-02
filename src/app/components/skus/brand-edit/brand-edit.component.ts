import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AppAuthenticationService } from 'src/app/_services/app-authentication.service';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { Brand } from 'src/app/_models/sku';

@Component({
    selector: 'app-brand-edit',
    templateUrl: './brand-edit.component.html',
    styleUrls: ['./brand-edit.component.scss']
})
export class BrandEditComponent implements OnInit {

    public brandId: string;
    public brand: Brand;
    public brands: Brand[] = [];
    public loaded: boolean = false;

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private http: HttpClient, private toastr: ToastrService, private appAuthService: AppAuthenticationService) {
    }

    ngOnInit() {

        this.appAuthService.tokenAuthenticate(() => {

            this.activatedRoute.params.subscribe(parameter => {
                this.brandId = parameter.brandId;

                let url = environment.API_URL + "/brands"
                this.http.get(url, { headers: this.appAuthService.getAuthHeader(), observe: 'response' }).subscribe(
                    success => {
                        let body: any = success.body;

                        body.forEach(element => {
                            let brand = Brand.fromJSON(element);
                            this.brands.push(brand);
                        });

                        let filtered = this.brands.filter(element => element._id == this.brandId);
                        this.brand = filtered[0];
                        this.loaded = true;
                    },
                    error => {
                        this.toastr.error("Error loading page", "Error!");
                        this.router.navigateByUrl("/skus/manage-skus");
                    });
            });
        });
    }

    cancel() {
        this.router.navigateByUrl("/skus/brand-view/" + this.brandId);
    }

    onSubmit(values) {

        let url = environment.API_URL + "/brands/" + this.brandId;
        this.http.put(url, values, { headers: this.appAuthService.getAuthHeader(), observe: "response" }).subscribe(
            success => {
                this.toastr.success("You have successfully updated brand", "Success!");
                this.router.navigateByUrl("/skus/brand-view/" + this.brandId);
            },
            error => {
                this.toastr.error("Error updating brand", "Error!");
            }
        );
    }
}

