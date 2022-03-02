import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Inject, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { DeviceDetectorService } from 'ngx-device-detector';
import { DOCUMENT } from '@angular/common';
import { AppAuthenticationService } from 'src/app/_services/app-authentication.service';
import { Department, Type, Size, Brand, Variant, Group } from 'src/app/_models/sku';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'app-manage-skus',
    templateUrl: './manage-skus.component.html',
    styleUrls: ['./manage-skus.component.scss']
})
export class ManageSkusComponent implements OnInit {

    public loaded: boolean = false;
    public dtOptions: DataTables.Settings = {};

    public departments: Department[] = [];
    public types: Type[] = [];
    public groups: Group[] = [];
    public variants: Variant[] = [];
    public brands: Brand[] = [];
    public sizes: Size[] = [];
    public activeTab: string = "brands";

    private closeResult = '';

    @ViewChild('fbrand') fbrand: NgForm;
    @ViewChild('img', { static: false }) image: ElementRef;

    public defualtImage = "assets/images/variant-color.jpg";
    public blankImage = "assets/images/blank-image.jpg";
    public imageError: boolean = false;
    public imageMessage: string = "";
    public url = {
        img: this.defualtImage,
    }

    constructor(private route: ActivatedRoute, private modalService: NgbModal, private router: Router, private http: HttpClient, private toastr: ToastrService, private deviceService: DeviceDetectorService, @Inject(DOCUMENT) private document: Document, private appAuthService: AppAuthenticationService, private cd: ChangeDetectorRef) {
        this.dtOptions = {
            pagingType: 'full_numbers',
            processing: true
        };
    }

    ngOnInit() {

        this.appAuthService.tokenAuthenticate(() => {

            this.route.queryParams.subscribe(params => {
                if (params['tab'] != undefined) {
                    this.activeTab = params['tab'];
                }
            })

            this.http.get(environment.API_URL + "/skus", { headers: this.appAuthService.getAuthHeader(), observe: 'response' }).subscribe(
                success => {

                    console.log("Successfully fetched skus");

                    let departments = success.body['departments'];
                    let sizes = success.body['sizes'];
                    let types = success.body['types'];
                    let variants = success.body['variants'];
                    let brands = success.body['brands'];
                    let groups = success.body['groups'];

                    departments.forEach(element => {
                        let department = Department.fromJSON(element);
                        this.departments.push(department);
                    });

                    sizes.forEach(element => {
                        let size = Size.fromJSON(element);
                        this.sizes.push(size);
                    });

                    types.forEach(element => {
                        let type = Type.fromJSON(element);
                        this.types.push(type);
                    });

                    variants.forEach(element => {
                        let variant = Variant.fromJSON(element);

                        if (variant.image == undefined) {
                            variant.image = this.blankImage;
                        }

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
                    this.toastr.error("There have been errors fetching your product!", "Error!");
                    console.log("Error fetching product");
                });
        });
    }

    ngAfterViewInit() {
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

    createBrand(value) {
        console.log("Create Brand Called");

        console.log(value);

        let url = environment.API_URL + "/brands";
        this.http.post(url, value, { headers: this.appAuthService.getAuthHeader(), observe: "response" }).subscribe(
            success => {
                console.log("Successfully Created New Brand");
                let newBrand = Brand.fromJSON(success.body);
                this.toastr.success("Successfully created new brand", "Success!");
                location.reload();
            },
            error => {
                console.log("Error Creating New Brand");
                this.toastr.error("Error creating new brand", "Error!");
            }
        )
    }

    createDepartment(value) {
        console.log("Create Department Called");

        console.log(value);

        let url = environment.API_URL + "/departments";
        this.http.post(url, value, { headers: this.appAuthService.getAuthHeader(), observe: "response" }).subscribe(
            success => {
                console.log("Successfully Created New Department");
                let newBrand = Brand.fromJSON(success.body);
                this.toastr.success("Successfully created new department", "Success!");
                location.reload();
            },
            error => {
                console.log("Error Creating New Department");
                this.toastr.error("Error creating new department", "Error!");
            }
        )
    }

    createType(value) {
        console.log("Create Type Called");

        console.log(value);

        let url = environment.API_URL + "/types";
        this.http.post(url, value, { headers: this.appAuthService.getAuthHeader(), observe: "response" }).subscribe(
            success => {
                console.log("Successfully Created New Type");
                this.toastr.success("Successfully created new type", "Success!");
                location.reload();
            },
            error => {
                console.log("Error Creating New Type");
                this.toastr.error("Error creating new type", "Error!");
            }
        )
    }

    createSize(value) {
        console.log("Create Size Called");

        console.log(value);

        let url = environment.API_URL + "/sizes";
        this.http.post(url, value, { headers: this.appAuthService.getAuthHeader(), observe: "response" }).subscribe(
            success => {
                console.log("Successfully Created New Size");
                this.toastr.success("Successfully created new size", "Success!");
                location.reload();
            },
            error => {
                console.log("Error Creating New Size");
                this.toastr.error("Error creating new size", "Error!");
            }
        )
    }

    createVariant(value) {
        console.log("Create Variant Called");

        value["image"] = this.url.img;

        console.log(value);

        let url = environment.API_URL + "/variants";
        this.http.post(url, value, { headers: this.appAuthService.getAuthHeader(), observe: "response" }).subscribe(
            success => {
                console.log("Successfully Created New Variant");
                this.toastr.success("Successfully created new variant", "Success!");
                location.reload();
            },
            error => {
                console.log("Error Creating New Variant");
                this.toastr.error("Error creating new variant", "Error!");
            }
        )
    }

    createGroup(value) {
        console.log("Create Group Called");

        console.log(value);

        let url = environment.API_URL + "/groups";
        this.http.post(url, value, { headers: this.appAuthService.getAuthHeader(), observe: "response" }).subscribe(
            success => {
                console.log("Successfully Created New Group");
                this.toastr.success("Successfully created new group", "Success!");
                location.reload();
            },
            error => {
                console.log("Error Creating New Group");
                this.toastr.error("Error creating new group", "Error!");
            }
        )
    }

    viewBrand(brandId) {
        this.router.navigateByUrl("/skus/brand-view/" + brandId);
    }

    editBrand(brandId) {
        this.router.navigateByUrl("/skus/brand-edit/" + brandId);
    }

    viewDepartment(departmentId) {
        this.router.navigateByUrl("/skus/department-view/" + departmentId);
    }

    editDepartment(departmentId) {
        this.router.navigateByUrl("/skus/department-edit/" + departmentId);
    }

    viewType(typeId) {
        this.router.navigateByUrl("/skus/type-view/" + typeId);
    }

    editType(typeId) {
        this.router.navigateByUrl("/skus/type-edit/" + typeId);
    }

    viewGroup(groupId) {
        this.router.navigateByUrl("/skus/group-view/" + groupId);
    }

    editGroup(groupId) {
        this.router.navigateByUrl("/skus/group-edit/" + groupId);
    }

    viewSize(sizeId) {
        this.router.navigateByUrl("/skus/size-view/" + sizeId);
    }

    editSize(sizeId) {
        this.router.navigateByUrl("/skus/size-edit/" + sizeId);
    }

    viewVariant(variantId) {
        this.router.navigateByUrl("/skus/variant-view/" + variantId);
    }

    editVariant(variantId) {
        this.router.navigateByUrl("/skus/variant-edit/" + variantId);
    }

    readUrl(event: any) {
        if (event.target.files.length === 0)
            return;
        //Image upload validation
        var mimeType = event.target.files[0].type;
        if (mimeType.match(/image\/*/) == null) {
            return;
        }
        // Image upload
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (_event) => {
            var image = new Image();
            image.src = reader.result.toString();

            image.onload = () => {

                if ((image.height != 300) || (image.width != 300)) {
                    this.imageError = true;
                    this.imageMessage = "Error! Please make sure your image is 300x300px";
                    this.image.nativeElement.value = "";
                    this.url.img = this.defualtImage;
                } else {
                    this.imageError = false;
                    this.imageMessage = "";
                    this.url.img = image.src;
                }
            }
        }
    }
}
