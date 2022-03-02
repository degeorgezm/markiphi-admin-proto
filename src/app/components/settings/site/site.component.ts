import { Component, OnInit } from '@angular/core';
import { AppAuthenticationService } from 'src/app/_services/app-authentication.service';
import { User } from 'src/app/_models/user';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NumericLiteral } from 'typescript';
import { ToastrService } from 'ngx-toastr';

const defaultProfilePicSrc = "assets/images/dashboard/man.png";
@Component({
  selector: 'app-site-settings',
  templateUrl: './site.component.html',
  styleUrls: ['./site.component.scss']
})
export class SiteSettingsComponent implements OnInit {

  public user: User;

  loaded: boolean = false;

  user_count?: string;
  admin_count?: string;
  product_count?: string;
  order_count?: string;
  item_count?: string;
  total_sales?: string;
  returns_requested?: string;
  returns_denied?: string;
  return_sales?: string;
  net_sales?: string;

  public incoming_order_alert_email: string;
  public incoming_return_alert_email: string;
  public incoming_review_alert_email: string;
  public default_shipping_cost: string;

  constructor(private appAuthService: AppAuthenticationService, private http: HttpClient, private toastr: ToastrService) { }

  ngOnInit() {
    this.appAuthService.tokenAuthenticate(() => {
      this.user = this.appAuthService.getAuthUser();

      let url = environment.API_URL + "/meta";

      this.http.get(url, {
        headers: this.appAuthService.getAuthHeader(),
        observe: 'response'
      }).subscribe(
        success => {
          let body: any = success.body;

          this.user_count = body['user-count'];
          this.admin_count = body['admin-count'];
          this.product_count = body['product-count'];
          this.order_count = body['order-count'];
          this.item_count = body['item-count'];
          this.total_sales = parseFloat(body['total-sales']).toFixed(2);
          this.returns_requested = body['returns-requested'];
          this.returns_denied = body['returns-denied'];
          this.return_sales = parseFloat(body['return-sales']).toFixed(2);
          this.net_sales = (parseFloat(this.total_sales) - parseFloat(this.return_sales)).toFixed(2);

          this.loaded = true;
        },
        error => {
          console.log("Error fetching Meta");
        }
      );

    });
  }

  onSubmit(values) {
    console.log(values);

    this.toastr.success("Your values have been successfully submitted", "Success!");
  }

}
