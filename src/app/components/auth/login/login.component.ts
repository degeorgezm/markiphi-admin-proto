import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppAuthenticationService } from 'src/app/_services/app-authentication.service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/_models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @ViewChild('f') f: NgForm;

  constructor(private appAuthService: AppAuthenticationService, private http: HttpClient, private toastr: ToastrService, private router: Router) {
  }

  owlcarousel = [
    {
      title: "Welcome to Multikart",
      desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy.",
    },
    {
      title: "Welcome to Multikart",
      desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy.",
    },
    {
      title: "Welcome to Multikart",
      desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy.",
    }
  ]
  owlcarouselOptions = {
    loop: true,
    items: 1,
    dots: true
  };

  ngOnInit() {
  }

  onSubmit() {
    this.http.post(environment.API_URL + "/authenticate/user", this.f.value, { observe: 'response', responseType: 'json' })
      .subscribe(
        success => {
          let user = User.fromJSON(success.body);
          let token = success.headers.get('Authorization');

          this.appAuthService.storeLogin(token, user.toJSON());
          AppAuthenticationService.authSubject.next(true);

          this.toastr.success('You have successfully logged into your account!', 'Success!');
          this.router.navigateByUrl('/dashboard/default');
        },
        error => {
          this.appAuthService.deleteAllStorage();

          AppAuthenticationService.authSubject.next(false);

          this.toastr.error('Username or password is incorrect. Please try again.', 'Error!');
        });
  }

}
