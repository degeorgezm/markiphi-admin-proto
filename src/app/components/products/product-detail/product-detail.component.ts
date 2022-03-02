import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Product } from 'src/app/_models/product';
import { ToastrService } from 'ngx-toastr';
import { DeviceDetectorService } from 'ngx-device-detector';
import { CarouselComponent } from 'angular-bootstrap-md';
import { AppAuthenticationService } from 'src/app/_services/app-authentication.service';
import { blobToBase64 } from 'src/app/_models/macros';
@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {

  @ViewChild('carousel', { static: false }) public carousel: CarouselComponent;

  public productId: string;
  public product: Product;
  public mobile: boolean = false;
  public loaded: boolean = false;
  constructor(private activatedRoute: ActivatedRoute, private router: Router, private http: HttpClient, private toastr: ToastrService, private deviceService: DeviceDetectorService, private appAuthService: AppAuthenticationService) {
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

                  //this.toastr.success("Your product has been successfully fetched!", "Success!");
                  blobToBase64(success.body, result => {
                    this.product.image.src = result;
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
    });
  }

  goToSlide(index: number) {
    this.carousel.selectSlide(index);
  }
}
