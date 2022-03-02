import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppAuthenticationService } from 'src/app/_services/app-authentication.service';
import { Product } from 'src/app/_models/product';
import { environment } from 'src/environments/environment';
import { blobToBase64 } from 'src/app/_models/macros';
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

  public products: Product[] = [];
  public dtOptions: DataTables.Settings = {};
  public loaded: boolean = false;

  constructor(private http: HttpClient, private toastr: ToastrService, private appAuthService: AppAuthenticationService) {
    this.dtOptions = {
      pagingType: 'full_numbers',
      processing: true
    };


  }

  ngOnInit() {
    this.appAuthService.tokenAuthenticate(() => {
      this.products = [];

      this.http.get(environment.API_URL + "/product", {
        observe: 'response'
      }).subscribe(
        success => {
          // continue to site
          let body: any = success.body;
          for (let i = 0; i < body.length; i++) {
            let product = Product.fromJSON(body[i]);
            this.products.push(product);
          }

          if (this.products.length == 0) {
            this.loaded = true;
          }

          //this.toastr.success("You successfully grabbed your products", "Success!");

          for (let i = 0; i < this.products.length; i++) {
            this.http.get(environment.API_URL + "/product/" + this.products[i]._id + "/photo/download", { observe: 'response', responseType: 'blob' })
              .subscribe(
                success => {

                  blobToBase64(success.body, result => {
                    this.products[i].image.src = result;

                    if (i == this.products.length - 1) {
                      this.loaded = true;
                    }
                  })
                },
                error => {
                  console.log("Error fetching image");
                });

          }
        },
        error => {
          this.toastr.success("There was an error fetching your products. Please reload.", "Error!");
        });
    });
  }

  ngAfterViewInit() {
    $(".dataTables_filter").css("margin-bottom", "0px");
  }

  blobToBase64 = function (blob, callback) {
    let reader = new FileReader();
    reader.onload = function () {
      let result = reader.result;
      callback(result);
    };
    reader.readAsDataURL(blob);
  };
}
