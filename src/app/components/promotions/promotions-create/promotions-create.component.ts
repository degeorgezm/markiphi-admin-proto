import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { Product, PriceChange } from 'src/app/_models/product';
import { HttpClient } from '@angular/common/http';
import { AppAuthenticationService } from 'src/app/_services/app-authentication.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ThemePalette } from '@angular/material/core';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
import { Department, Type, Group, Variant, Brand } from 'src/app/_models/sku';
import { User } from 'src/app/_models/user';

@Component({
    selector: 'app-promotions-create',
    templateUrl: './promotions-create.component.html',
    styleUrls: ['./promotions-create.component.scss']
})
export class PromotionsCreateComponent implements OnInit {

    public product: Product;
    public productId: String;
    public loaded: boolean = false;
    public user: User;

    public departments: Department[] = [];
    public types: Type[] = [];
    public groups: Group[] = [];
    public variants: Variant[] = [];
    public brands: Brand[] = [];

    public brandCounter = 1;
    public brandArray = ["null"];

    public departmentCounter = 1;
    public departmentArray = ["null"];

    public typeCounter = 1;
    public typeArray = ["null"];

    public variantCounter = 1;
    public variantArray = ["null"];

    public groupCounter = 1;
    public groupArray = ["null"];

    constructor(private http: HttpClient, private modalService: NgbModal, private appAuthService: AppAuthenticationService, private toastr: ToastrService, private route: ActivatedRoute, private router: Router) { }

    ngOnInit() {
        this.appAuthService.tokenAuthenticate(() => {
            this.user = this.appAuthService.getAuthUser();

            let url = environment.API_URL + "/skus";

            this.http.get(url, {
                headers: this.appAuthService.getAuthHeader(),
                observe: 'response'
            }).subscribe(
                success => {
                    console.log("Successfully fetched skus");

                    let departments = success.body['departments'];
                    let types = success.body['types'];
                    let variants = success.body['variants'];
                    let brands = success.body['brands'];
                    let groups = success.body['groups'];

                    departments.forEach(element => {
                        let department = Department.fromJSON(element);
                        this.departments.push(department);
                    });

                    types.forEach(element => {
                        let type = Type.fromJSON(element);
                        this.types.push(type);
                    });

                    variants.forEach(element => {
                        let variant = Variant.fromJSON(element);
                        this.variants.push(variant);
                    });

                    brands.forEach(element => {
                        let brand = Brand.fromJSON(element);
                        this.brands.push(brand);
                    });

                    groups.forEach(element => {
                        let group = Group.fromJSON(element);
                        this.groups.push(group);
                    });

                    this.loaded = true;
                },
                error => {
                    // do something
                    console.log("Error fetching skues");
                    console.log(error);
                    this.toastr.error("Error loading page. Please refresh", "Error!");
                });
        });
    }

    createPromotion(values) {

        let start = new Date(values["start"]);
        let end = new Date(values["end"]);

        if (start >= end) {
            this.toastr.error("End date must be after start date.", "Error!");
            return;
        }

        let variants = [];
        for (let i = 0; i < this.variantCounter; i++) {
            let id = "variant_" + i.toString();
            let value = (<HTMLInputElement>document.getElementById(id)).value;
            if (value != "") {
                variants.push(value);
            }
        }

        let brands = [];
        for (let i = 0; i < this.brandCounter; i++) {
            let id = "brand_" + i.toString();
            let value = (<HTMLInputElement>document.getElementById(id)).value;
            if (value != "") {
                brands.push(value);
            }
        }

        let departments = [];
        for (let i = 0; i < this.departmentCounter; i++) {
            let id = "department_" + i.toString();
            let value = (<HTMLInputElement>document.getElementById(id)).value;
            if (value != "") {
                departments.push(value);
            }
        }

        let groups = [];
        for (let i = 0; i < this.groupCounter; i++) {
            let id = "group_" + i.toString();
            let value = (<HTMLInputElement>document.getElementById(id)).value;
            if (value != "") {
                groups.push(value);
            }
        }

        let types = [];
        for (let i = 0; i < this.typeCounter; i++) {
            let id = "type_" + i.toString();
            let value = (<HTMLInputElement>document.getElementById(id)).value;
            if (value != "") {
                types.push(value);
            }
        }

        values["variants"] = variants;
        values["brands"] = brands;
        values["departments"] = departments;
        values["groups"] = groups;
        values["types"] = types;

        values["user"] = this.user._id;

        this.http.post(environment.API_URL + "/promotion", values, { headers: this.appAuthService.getAuthHeader(), observe: 'response' })
            .subscribe(
                success => {

                    console.log(success.body.toString());

                    this.toastr.success("Promotion has been successfully created", "Success!");

                    this.router.navigateByUrl("/promotions/promotions-list");
                },
                error => {
                    this.toastr.error("Error creating promotion", "Error!");
                });
    }


    incrementBrand() {
        this.brandCounter++;
        this.brandArray.push("null");
    }

    decrementBrand() {
        this.brandCounter--;
        this.brandArray.pop();
    }

    incrementDepartment() {
        this.departmentCounter++;
        this.departmentArray.push("null");
    }

    decrementDepartment() {
        this.departmentCounter--;
        this.departmentArray.pop();
    }

    incrementType() {
        this.typeCounter++;
        this.typeArray.push("null");
    }

    decrementType() {
        this.typeCounter--;
        this.typeArray.pop();
    }

    incrementVariant() {
        this.variantCounter++;
        this.variantArray.push("null");
    }

    decrementVariant() {
        this.variantCounter--;
        this.variantArray.pop();
    }

    incrementGroup() {
        this.groupCounter++;
        this.groupArray.push("null");
    }

    decrementGroup() {
        this.groupCounter--;
        this.groupArray.pop();
    }
}
