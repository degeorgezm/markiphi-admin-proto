import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Product } from 'src/app/_models/product';
import { ToastrService } from 'ngx-toastr';
import { DeviceDetectorService } from 'ngx-device-detector';
import { DOCUMENT } from '@angular/common';
import { AppAuthenticationService } from 'src/app/_services/app-authentication.service';
import { blobToBase64 } from 'src/app/_models/macros';

enum FormMode {
    AddInventory = 1,
    SetInventory,
    RecordLoses
}

@Component({
    selector: 'app-product-inventory',
    templateUrl: './product-inventory.component.html',
    styleUrls: ['./product-inventory.component.scss']
})
export class ProductInventoryComponent implements OnInit {

    public loaded: boolean = false;
    public productId: string;
    public product: Product;
    public mobile: boolean = false;
    public inventoryAddMode = false;

    public mode: FormMode = FormMode.AddInventory
    constructor(private activatedRoute: ActivatedRoute, private router: Router, private http: HttpClient, private toastr: ToastrService, private deviceService: DeviceDetectorService, @Inject(DOCUMENT) private document: Document, private appAuthService: AppAuthenticationService, private cd: ChangeDetectorRef) {
    }

    ngOnInit() {

        this.appAuthService.tokenAuthenticate(() => {
            this.mobile = this.deviceService.isMobile();

            this.activatedRoute.params.subscribe(parameter => {
                this.productId = parameter.productId;

                this.http.get(environment.API_URL + "/product/" + this.productId, { observe: 'response' }).subscribe(
                    success => {
                        let body = success.body;
                        this.product = Product.fromJSON(body);

                        console.log("Successfully fetched product");
                        this.loaded = true;
                        this.http.get(environment.API_URL + "/product/" + this.product._id + "/photo/download", { observe: 'response', responseType: 'blob' })
                            .subscribe(
                                success => {

                                    this.toastr.success("Your product has been successfully fetched!", "Success!");
                                    blobToBase64(success.body, result => {
                                        this.product.image.src = result;
                                    })
                                },
                                error => {
                                    this.toastr.error("There have been errors fetching your product photo!", "Error!");
                                    console.log("Error fetching image");
                                });

                    },
                    error => {
                        this.toastr.error("There have been errors fetching your product!", "Error!");
                        console.log("Error fetching product");
                    });
            });
        });
    }

    onSubmit() {


        let stockObj = [];

        if (this.mode == FormMode.AddInventory || this.mode == FormMode.SetInventory) {
            for (let i = 0; i < this.product.stock.length; i++) {
                let stockLine = {
                    variant: this.product.stock[i].variant._id,
                    inventory: []
                }
                for (let j = 0; j < this.product.sizes.length; j++) {
                    let id = this.mode == FormMode.AddInventory ? "add_" + this.product.stock[i].variant._id + "_" + this.product.sizes[j]._id : "set_" + this.product.stock[i].variant._id + "_" + this.product.sizes[j]._id;
                    let value = 0;
                    if (this.mode == FormMode.AddInventory) {
                        // Combine value with previous value
                        value = this.product.stock[i].inventory[j] + Number((<HTMLInputElement>document.getElementById(id)).value);
                    } else if (this.mode == FormMode.SetInventory) {
                        // Overwrite value
                        value = Number((<HTMLInputElement>document.getElementById(id)).value);
                    }

                    stockLine["inventory"].push(value);
                }

                stockObj.push(stockLine);
            }

            let body = {
                stock: stockObj
            }

            let url = environment.API_URL + "/product/" + this.product._id + "/inventory";
            this.http.post(url, body, {
                headers: this.appAuthService.getAuthHeader(),
                observe: 'response'
            }).subscribe(
                success => {
                    console.log("Successfully updated product");
                    this.toastr.success("Successfully updated product Inventory!", "Success!");
                    this.router.navigateByUrl("/products/product-detail/" + this.product._id);
                },
                error => {
                    // do something
                    console.log("Error updating product inventory");
                    console.log(error);
                    this.toastr.error("Error updating product inventory", "Error!");
                });
        } else if (this.mode == FormMode.RecordLoses) {
            for (let i = 0; i < this.product.stock.length; i++) {
                let stockLine = {
                    variant: this.product.stock[i].variant._id,
                    loss: []
                }
                for (let j = 0; j < this.product.sizes.length; j++) {
                    let id = "loss_" + this.product.stock[i].variant._id + "_" + this.product.sizes[j]._id;
                    let value = 0;
                    if (this.mode == FormMode.RecordLoses) {
                        // Combine value with previous value
                        value = Number((<HTMLInputElement>document.getElementById(id)).value);
                        stockLine["loss"].push(value);
                    }
                }

                stockObj.push(stockLine);
            }

            let body = {
                stock: stockObj
            }

            console.log(body);

            let url = environment.API_URL + "/product/" + this.product._id + "/inventory/losses";
            this.http.post(url, body, {
                headers: this.appAuthService.getAuthHeader(),
                observe: 'response'
            }).subscribe(
                success => {
                    console.log("Successfully updated product");
                    this.toastr.success("Successfully updated product Inventory!", "Success!");
                    this.router.navigateByUrl("/products/product-detail/" + this.product._id);
                },
                error => {
                    // do something
                    console.log("Error updating product inventory");
                    console.log(error);
                    this.toastr.error("Error updating product inventory", "Error!");
                });
        }
    }

    postMode(value) {
        this.mode = value;
        console.log(this.mode);
    }
}
