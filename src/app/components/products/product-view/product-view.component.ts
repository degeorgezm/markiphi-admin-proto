import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AppAuthenticationService } from 'src/app/_services/app-authentication.service';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Product } from 'src/app/_models/product';
import { blobToBase64 } from 'src/app/_models/macros';

@Component({
  selector: 'app-product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.scss']
})
export class ProductViewComponent implements OnInit {

  public products: Product[] = [];

  constructor(private http: HttpClient, private auppAuthService: AppAuthenticationService, private toastr: ToastrService) {


  }

  ngOnInit() {
    this.auppAuthService.tokenAuthenticate(() => {
      this.http.get(environment.API_URL + "/product", {
        observe: 'response'
      }).subscribe(
        success => {
          // continue to site
          let body: any = success.body;
          for (let i = 0; i < body.length; i++) {
            let product = Product.fromJSON(body[i]);
            console.log(product);
            this.products.push(product);
          }

          //this.toastr.success("You successfully grabbed your products", "Success!");

          for (let i = 0; i < this.products.length; i++) {
            this.http.get(environment.API_URL + "/product/" + this.products[i]._id + "/photo/download", { observe: 'response', responseType: 'blob' })
              .subscribe(
                success => {

                  blobToBase64(success.body, result => {
                    this.products[i].image.src = result;
                  })
                },
                error => {
                  console.log("Error fetching image");
                });
          }
        },
        error => {
          this.toastr.success("There was an error grabbing your products", "Error!");
        });
    });
  }

  blobToBase64 = function (blob, callback) {
    let reader = new FileReader();
    reader.onload = function () {
      let result = reader.result;
      callback(result);
    };
    reader.readAsDataURL(blob);
  }

}
