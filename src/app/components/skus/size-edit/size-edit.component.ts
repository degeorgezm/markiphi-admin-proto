import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AppAuthenticationService } from 'src/app/_services/app-authentication.service';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { Size } from 'src/app/_models/sku';

@Component({
    selector: 'app-size-edit',
    templateUrl: './size-edit.component.html',
    styleUrls: ['./size-edit.component.scss']
})
export class SizeEditComponent implements OnInit {

    public sizeId: string;
    public size: Size;
    public sizes: Size[] = [];
    public loaded: boolean = false;

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private http: HttpClient, private toastr: ToastrService, private appAuthService: AppAuthenticationService) {
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

    cancel() {
        this.router.navigateByUrl("/skus/size-view/" + this.sizeId);
    }

    onSubmit(values) {

        console.log(values);

        let url = environment.API_URL + "/sizes/" + this.sizeId;
        this.http.put(url, values, { headers: this.appAuthService.getAuthHeader(), observe: "response" }).subscribe(
            success => {
                this.toastr.success("You have successfully updated size", "Success!");
                this.router.navigateByUrl("/skus/size-view/" + this.sizeId);
            },
            error => {
                this.toastr.error("Error updating size", "Error!");
            }
        );
    }
}

