import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AppAuthenticationService } from 'src/app/_services/app-authentication.service';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { Group } from 'src/app/_models/sku';

@Component({
    selector: 'app-group-edit',
    templateUrl: './group-edit.component.html',
    styleUrls: ['./group-edit.component.scss']
})
export class GroupEditComponent implements OnInit {

    public groupId: string;
    public group: Group;
    public groups: Group[] = [];
    public loaded: boolean = false;

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private http: HttpClient, private toastr: ToastrService, private appAuthService: AppAuthenticationService) {
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
        this.router.navigateByUrl("/skus/group-view/" + this.groupId);
    }

    onSubmit(values) {

        console.log(values);

        let url = environment.API_URL + "/groups/" + this.groupId;
        this.http.put(url, values, { headers: this.appAuthService.getAuthHeader(), observe: "response" }).subscribe(
            success => {
                this.toastr.success("You have successfully updated group", "Success!");
                this.router.navigateByUrl("/skus/group-view/" + this.groupId);
            },
            error => {
                this.toastr.error("Error updating group", "Error!");
            }
        );
    }
}

