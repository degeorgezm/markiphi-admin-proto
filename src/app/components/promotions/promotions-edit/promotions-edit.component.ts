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
import { Promotion } from 'src/app/_models/promotion';

@Component({
    selector: 'app-promotions-edit',
    templateUrl: './promotions-edit.component.html',
    styleUrls: ['./promotions-edit.component.scss']
})
export class PromotionsEditComponent implements OnInit {

    public promotion: Promotion;
    public promotionId: String;
    public loaded: boolean = false;
    public user: User;

    public departments: Department[] = [];
    public types: Type[] = [];
    public groups: Group[] = [];
    public variants: Variant[] = [];
    public brands: Brand[] = [];

    public brandCounter = 0;
    public brandArray = [];

    public departmentCounter = 0;
    public departmentArray = [];

    public typeCounter = 0;
    public typeArray = [];

    public variantCounter = 0;
    public variantArray = [];

    public groupCounter = 0;
    public groupArray = [];

    public brandsIn: Brand[] = [];
    public departmentsIn: Department[] = [];
    public typesIn: Type[] = [];
    public variantsIn: Variant[] = [];
    public groupsIn: Group[] = [];

    constructor(private http: HttpClient, private modalService: NgbModal, private appAuthService: AppAuthenticationService, private toastr: ToastrService, private activatedRoute: ActivatedRoute, private router: Router) { }

    ngOnInit() {
        this.appAuthService.tokenAuthenticate(() => {
            this.user = this.appAuthService.getAuthUser();

            this.activatedRoute.params.subscribe(parameter => {
                this.promotionId = parameter.promotionId;

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

                        let url2 = environment.API_URL + "/promotion/" + this.promotionId;
                        this.http.get(url2, { headers: this.appAuthService.getAuthHeader(), observe: 'response' }).subscribe(
                            success => {
                                let body: any = success.body;

                                this.promotion = Promotion.fromJSON(body);

                                if (this.promotion.brands.length > 0) {
                                    for (let i = 0; i < this.promotion.brands.length; i++) {
                                        this.brandsIn.push(this.promotion.brands[i]);
                                        this.brandArray.push("null");
                                    }

                                    this.brandCounter = this.brandArray.length;
                                } else {
                                    this.brandArray.push("null");
                                    this.brandCounter = 1;
                                }

                                if (this.promotion.departments.length > 0) {
                                    for (let i = 0; i < this.promotion.departments.length; i++) {
                                        this.departmentsIn.push(this.promotion.departments[i]);
                                        this.departmentArray.push("null");
                                    }

                                    this.departmentCounter = this.departmentArray.length;
                                } else {
                                    this.departmentArray.push("null");
                                    this.departmentCounter = 1;
                                }

                                if (this.promotion.types.length > 0) {
                                    for (let i = 0; i < this.promotion.types.length; i++) {
                                        this.typesIn.push(this.promotion.types[i]);
                                        this.typeArray.push("null");
                                    }

                                    this.typeCounter = this.typeArray.length;
                                } else {
                                    this.typeArray.push("null");
                                    this.typeCounter = 1;
                                }

                                if (this.promotion.variants.length > 0) {
                                    for (let i = 0; i < this.promotion.variants.length; i++) {
                                        this.variantsIn.push(this.promotion.variants[i]);
                                        this.variantArray.push("null");
                                    }

                                    this.variantCounter = this.variantArray.length;
                                } else {
                                    this.variantArray.push("null");
                                    this.variantCounter = 1;
                                }

                                if (this.promotion.groups.length > 0) {
                                    for (let i = 0; i < this.promotion.groups.length; i++) {
                                        this.groupsIn.push(this.promotion.groups[i]);
                                        this.groupArray.push("null");
                                    }

                                    this.groupCounter = this.groupArray.length;
                                } else {
                                    this.groupArray.push("null");
                                    this.groupCounter = 1;
                                }

                                this.loaded = true;
                            },
                            error => {
                                // do something
                                console.log("Error fetching skues");
                                console.log(error);
                                this.toastr.error("Error loading page. Please refresh", "Error!");
                            });
                    });
            });
        });
    }

    updatePromotion(values) {

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

        let url = environment.API_URL + "/promotion/" + this.promotionId;

        this.http.post(url, values, { headers: this.appAuthService.getAuthHeader(), observe: 'response' })
            .subscribe(
                success => {

                    this.toastr.success("Promotion has been successfully updated", "Success!");

                    this.router.navigateByUrl("/promotions/promotions-view/" + this.promotionId);
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
