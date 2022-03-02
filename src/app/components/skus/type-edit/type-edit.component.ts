import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AppAuthenticationService } from 'src/app/_services/app-authentication.service';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { Type } from 'src/app/_models/sku';

@Component({
    selector: 'app-type-edit',
    templateUrl: './type-edit.component.html',
    styleUrls: ['./type-edit.component.scss']
})
export class TypeEditComponent implements OnInit {

    public typeId: string;
    public type: Type;
    public types: Type[] = [];
    public loaded: boolean = false;

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private http: HttpClient, private toastr: ToastrService, private appAuthService: AppAuthenticationService) {
    }

    ngOnInit() {

        this.appAuthService.tokenAuthenticate(() => {

            this.activatedRoute.params.subscribe(parameter => {
                this.typeId = parameter.typeId;

                let url = environment.API_URL + "/types"
                this.http.get(url, { headers: this.appAuthService.getAuthHeader(), observe: 'response' }).subscribe(
                    success => {
                        let body: any = success.body;

                        body.forEach(element => {
                            let type = Type.fromJSON(element);
                            this.types.push(type);
                        });

                        let filtered = this.types.filter(element => element._id == this.typeId);
                        this.type = filtered[0];
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
        this.router.navigateByUrl("/skus/type-view/" + this.typeId);
    }

    onSubmit(values) {

        console.log(values);

        let url = environment.API_URL + "/types/" + this.typeId;
        this.http.put(url, values, { headers: this.appAuthService.getAuthHeader(), observe: "response" }).subscribe(
            success => {
                this.toastr.success("You have successfully updated type", "Success!");
                this.router.navigateByUrl("/skus/type-view/" + this.typeId);
            },
            error => {
                this.toastr.error("Error updating type", "Error!");
            }
        );
    }
}

