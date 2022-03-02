import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Product } from 'src/app/_models/product';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { Department, Type, Size, Brand, Variant, Group } from 'src/app/_models/sku'
import { AppAuthenticationService } from 'src/app/_services/app-authentication.service';
import { DOCUMENT } from '@angular/common';
import { CarouselComponent } from 'angular-bootstrap-md';
import { User } from 'src/app/_models/user';
import { blobToBase64 } from 'src/app/_models/macros';
@Component({
    selector: 'app-product-edit',
    templateUrl: './product-edit.component.html',
    styleUrls: ['./product-edit.component.scss']
})
export class ProductEditComponent implements OnInit {

    @ViewChild('f', { static: false }) f: NgForm;
    @ViewChild('img', { static: false }) image: ElementRef;
    @ViewChild('carousel', { static: false }) public carousel: CarouselComponent;

    public loaded: boolean = false;
    public user: User;
    public productId: string;
    public product: Product;
    private defualtImage = "assets/images/pro3/1.jpg";
    public imageError: boolean = false;
    public imageMessage: string = "";
    public url = {
        img: this.defualtImage,
    }

    public departments: Department[] = [];
    public types: Type[] = [];
    public groups: Group[] = [];
    public variants: Variant[] = [];
    public brands: Brand[] = [];
    public sizes: Size[] = [];

    public variantCounter = 1;
    public variantArray = ["null"];
    public sizeCounter = 1;
    public sizeArray = [];
    public groupCounter = 1;
    public groupArray = [];

    public imageArray = ["null"];
    public imageCounter = 1;
    public images = [this.defualtImage];
    public imagesErrors = [false];
    public imagesErrorsMessages = ["null"];
    public imagesValid = [false];

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private http: HttpClient, private toastr: ToastrService, private appAuthService: AppAuthenticationService, @Inject(DOCUMENT) private document: Document) {
    }


    ngOnInit() {
        this.appAuthService.tokenAuthenticate(() => {
            this.user = this.appAuthService.getAuthUser();

            this.activatedRoute.params.subscribe(parameter => {
                this.productId = parameter.productId;

                this.http.get(environment.API_URL + "/product/" + this.productId, { observe: 'response' }).subscribe(
                    success => {
                        let body = success.body;
                        this.product = Product.fromJSON(body);

                        for (let i = 0; i < this.product.groups.length; i++) {
                            this.groupArray.push("null");
                        }
                        this.groupCounter = this.groupArray.length;

                        for (let i = 0; i < this.product.sizes.length; i++) {
                            this.sizeArray.push("null");
                        }
                        this.sizeCounter = this.sizeArray.length;

                        console.log("Successfully fetched product");
                        this.loaded = true;
                        this.http.get(environment.API_URL + "/product/" + this.product._id + "/photo/download", { observe: 'response', responseType: 'blob' })
                            .subscribe(
                                success => {

                                    //this.toastr.success("Your product has been successfully fetched!", "Success!");
                                    blobToBase64(success.body, result => {
                                        this.product.image.src = result;
                                        this.url.img = result;
                                    })
                                },
                                error => {
                                    console.log("Error fetching image");
                                });

                        for (let i = 0; i < this.product.images.length; i++) {
                            this.http.get(environment.API_URL + "/product/" + this.product._id + "/photos/" + this.product.images[i]._id, { observe: 'response', responseType: 'blob' })
                                .subscribe(
                                    success => {
                                        blobToBase64(success.body, result => {
                                            this.product.images[i].src = result;
                                        })
                                    },
                                    error => {
                                        console.log("Error fetching image");
                                    });
                        }

                    },
                    error => {

                    });
            });

            let url = environment.API_URL + "/skus";
            this.http.get(url, {
                headers: this.appAuthService.getAuthHeader(),
                observe: 'response'
            }).subscribe(
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
                },
                error => {
                    // do something
                    console.log("Error fetching skues");
                    console.log(error);
                    this.toastr.error("Error loading page. Please refresh", "Error!");
                });
        });
    }

    readFile(event: any, i: number) {
        if (event.target.files.length === 0) {
            this.imagesErrors[i] = true;
            this.imagesErrorsMessages[i] = "Please make sure you selecet a file.";
            return;
        }

        //Image upload validation
        var mimeType = event.target.files[0].type;
        if (mimeType.match(/image\/*/) == null) {
            this.imagesErrors[i] = true;
            this.imagesErrorsMessages[i] = "Please make sure you select an image file."
            return;
        }

        // Image upload
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (_event) => {
            var image = new Image();
            image.src = reader.result.toString();

            image.onload = () => {

                if ((image.height != 736) || (image.width != 736)) {
                    this.imagesErrors[i] = true;
                    this.imagesErrorsMessages[i] = "Error! Please make sure your image is 736x736px";
                    let id = "imageinput_" + i.toString();
                    (<HTMLInputElement>document.getElementById(id)).value = "";
                    this.images[i] = this.defualtImage;
                } else {
                    this.imagesErrors[i] = false;
                    this.imagesErrorsMessages[i] = "null";
                    this.images[i] = image.src;
                    this.imagesValid[i] = true;
                }
            }
        }

    }

    //FileUpload
    readUrl(event: any) {
        if (event.target.files.length === 0) {
            this.imageError = true;
            this.imageMessage = "Please make sure you a file.";
            return;
        }
        //Image upload validation
        var mimeType = event.target.files[0].type;
        if (mimeType.match(/image\/*/) == null) {
            this.imageError = true;
            this.imageMessage = "Please make sure you select an image file.";
            return;
        }

        // Image upload
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (_event) => {
            var image = new Image();
            image.src = reader.result.toString();

            image.onload = () => {

                if ((image.height != 736) || (image.width != 736)) {
                    this.imageError = true;
                    this.imageMessage = "Error! Please make sure your image is 736x736px";
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

    incrementImage() {
        this.imageCounter++;
        this.imageArray.push("null");
        this.images.push(this.defualtImage);
        this.imagesErrors.push(false);
    }

    decrementImage() {
        this.imageCounter--;
        this.imageArray.pop();
        this.images.pop();
        this.imagesErrors.pop();
    }

    incrementVariant() {
        this.variantCounter++;
        this.variantArray.push("null");
    }

    decrementVariant() {
        this.variantCounter--;
        this.variantArray.pop();
    }

    incrementSize() {
        this.sizeCounter++;
        this.sizeArray.push("null");
    }

    decrementSize() {
        this.sizeCounter--;
        this.sizeArray.pop();
    }

    incrementGroup() {
        this.groupCounter++;
        this.groupArray.push("null");
    }

    decrementGroup() {
        this.groupCounter--;
        this.groupArray.pop();
    }

    onSubmit(value) {

        console.log(value);

        let groups = [];
        for (let i = 0; i < this.groupCounter; i++) {
            let id = "group_" + i.toString();
            let groupval = (<HTMLInputElement>document.getElementById(id)).value;
            if (groupval != "") {
                groups.push(groupval);
            }
        }

        let sizes = [];
        for (let i = 0; i < this.sizeCounter; i++) {
            let id = "size_" + i.toString();
            let sizeval = (<HTMLInputElement>document.getElementById(id)).value;
            if (sizeval != "") {
                sizes.push(sizeval);
            }
        }

        value["groups"] = groups;
        value["sizes"] = sizes;
        value["user"] = this.user._id;

        let url = environment.API_URL + "/product/" + this.product._id;
        this.http.post(url, value, {
            headers: this.appAuthService.getAuthHeader(),
            observe: 'response'
        }).subscribe(
            success => {
                console.log("Successfully updated product");
                this.toastr.success("Successfully updated product!", "Success!");
                this.router.navigateByUrl("/products/product-detail/" + this.product._id);
            },
            error => {
                // do something
                console.log("Error fetching skues");
                console.log(error);
                this.toastr.error("Error updating product", "Error!");
            });

        for (let i = 0; i < this.imageCounter; i++) {
            if (this.imagesValid[i]) {
                let id = "imageinput_" + i.toString();
                let file = (<HTMLInputElement>document.getElementById(id)).files[0];
                let filename = (<HTMLInputElement>document.getElementById(id)).value;

                const formData = new FormData();
                formData.set("photo", file, filename);
                formData.set("tag", "Product Photo");

                this.http.post(environment.API_URL + "/product/" + this.product._id + "/photos", formData, { headers: this.appAuthService.getAuthHeader(), observe: 'response' })
                    .subscribe(
                        success => {
                            this.toastr.success('You have successfully added your picture to the product!', 'Success');
                            this.router.navigateByUrl('/products/product-view');
                        },
                        error => {
                            this.toastr.error('There was an error uploading your photo', 'Error');
                        });

            }

        }

    }

    goToSlide(index: number) {
        this.carousel.selectSlide(index);
    }
}
