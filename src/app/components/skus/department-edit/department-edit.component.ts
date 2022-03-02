import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AppAuthenticationService } from 'src/app/_services/app-authentication.service';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { Department, Brand } from 'src/app/_models/sku';

@Component({
    selector: 'app-department-edit',
    templateUrl: './department-edit.component.html',
    styleUrls: ['./department-edit.component.scss']
})
export class DepartmentEditComponent implements OnInit {

    public departmentId: string;
    public department: Department;
    public departments: Department[] = [];
    public brands: Brand[] = [];
    public loaded: boolean = false;
    public brandsLoaded: boolean = false;

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private http: HttpClient, private toastr: ToastrService, private appAuthService: AppAuthenticationService) {
    }

    ngOnInit() {

        this.appAuthService.tokenAuthenticate(() => {

            this.activatedRoute.params.subscribe(parameter => {
                this.departmentId = parameter.departmentId;

                let url = environment.API_URL + "/departments"
                this.http.get(url, { headers: this.appAuthService.getAuthHeader(), observe: 'response' }).subscribe(
                    success => {
                        let body: any = success.body;

                        body.forEach(element => {
                            let department = Department.fromJSON(element);
                            this.departments.push(department);
                        });

                        let filtered = this.departments.filter(element => element._id == this.departmentId);
                        this.department = filtered[0];
                        this.loaded = true;
                    },
                    error => {
                        this.toastr.error("Error loading page", "Error!");
                        this.router.navigateByUrl("/skus/manage-skus");
                    });

                let url2 = environment.API_URL + "/brands"
                this.http.get(url2, { headers: this.appAuthService.getAuthHeader(), observe: 'response' }).subscribe(
                    success => {
                        let body: any = success.body;

                        body.forEach(element => {
                            let brand = Brand.fromJSON(element);
                            this.brands.push(brand);
                        });

                        this.brandsLoaded = true;
                    },
                    error => {
                        this.toastr.error("Error loading page", "Error!");
                        this.router.navigateByUrl("/skus/manage-skus");
                    });
            });
        });
    }

    cancel() {
        this.router.navigateByUrl("/skus/department-view/" + this.departmentId);
    }

    onSubmit(values) {

        console.log(values);

        let url = environment.API_URL + "/departments/" + this.departmentId;
        this.http.put(url, values, { headers: this.appAuthService.getAuthHeader(), observe: "response" }).subscribe(
            success => {
                this.toastr.success("You have successfully updated department", "Success!");
                this.router.navigateByUrl("/skus/department-view/" + this.departmentId);
            },
            error => {
                this.toastr.error("Error updating department", "Error!");
            }
        );
    }
}

