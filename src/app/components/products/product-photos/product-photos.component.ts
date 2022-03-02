import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AppAuthenticationService } from 'src/app/_services/app-authentication.service';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Product } from 'src/app/_models/product';
import { Photo } from 'src/app/_models/photo';
import { Router, ActivatedRoute } from '@angular/router';
import { blobToBase64 } from 'src/app/_models/macros';

@Component({
    selector: 'app-product-photos',
    templateUrl: './product-photos.component.html',
    styleUrls: ['./product-photos.component.scss']
})
export class ProductPhotosComponent implements OnInit {

    public product: Product;
    public productId: String;
    public loaded: boolean = false;

    constructor(private http: HttpClient, private appAuthService: AppAuthenticationService, private toastr: ToastrService, private activatedRoute: ActivatedRoute, private router: Router) {


    }

    ngOnInit() {

        this.appAuthService.tokenAuthenticate(() => {

            this.activatedRoute.params.subscribe(parameter => {
                this.productId = parameter.productId;

                this.http.get(environment.API_URL + "/product/" + this.productId, { observe: 'response' }).subscribe(
                    success => {
                        let body = success.body;
                        this.product = Product.fromJSON(body);

                        console.log("Successfully fetched product");
                        this.loaded = true;

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
        });
    }

    delete(image: Photo) {
        let url = environment.API_URL + "/product/" + this.product._id + "/photos/" + image._id;

        this.http.delete(url, { headers: this.appAuthService.getAuthHeader(), observe: 'response' })
            .subscribe(
                success => {
                    this.toastr.success("You have successfully deleted the photo", "Success!");
                    location.reload();
                },
                error => {
                    this.toastr.error("There was an error deleting the photo", "Error!");
                });
    }

    setPrimary(image: Photo) {
        let url = environment.API_URL + "/product/" + this.product._id + "/photos/" + image._id;

        this.http.put(url, {}, { headers: this.appAuthService.getAuthHeader(), observe: 'response' })
            .subscribe(
                success => {
                    this.toastr.success("You have successfully updated the primary photo", "Success!");
                    location.reload();
                },
                error => {
                    this.toastr.error("There was an error updating the primary photo", "Error!");
                });
    }

}
