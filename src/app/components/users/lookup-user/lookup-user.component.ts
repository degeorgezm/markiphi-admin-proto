import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppAuthenticationService } from 'src/app/_services/app-authentication.service';
import { Product } from 'src/app/_models/product';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/_models/user';

@Component({
    selector: 'app-lookup-user',
    templateUrl: './lookup-user.component.html',
    styleUrls: ['./lookup-user.component.scss']
})
export class LookupUserComponent implements OnInit {

    @ViewChild('phonenumber') phone: ElementRef;

    public products: Product[] = [];
    public dtOptions: DataTables.Settings = {};
    public loaded: boolean = false;
    public users: User[] = [];

    constructor(private http: HttpClient, private toastr: ToastrService, private appAuthService: AppAuthenticationService, private route: ActivatedRoute, private router: Router) {
        this.dtOptions = {
            pagingType: 'full_numbers',
            processing: true
        };

        this.route.queryParams.subscribe(params => {
            if (params.email) {
                $("#email").val(params.email);
                $("#email-input").prop("checked", true);
            }

            if (params.firstName) {
                $("#firstName").val(params.firstName);
                $("#firstName-input").prop("checked", true);
            }

            if (params.lastName) {
                $("#lastName").val(params.lastName);
                $("#lastName-input").prop("checked", true);
            }

            if (params.phone) {
                $("#phone").val(params.phone);
                $("#phone-input").prop("checked", true);
            }
        })
    }

    ngOnInit() {

    }

    onSubmit(values) {

        this.users = [];

        let params = {};

        if ($("#email-input").prop('checked')) {
            params['email'] = values.email;
        }

        if ($("#firstName-input").prop('checked')) {
            params['firstName'] = values.firstName;
        }

        if ($("#lastName-input").prop('checked')) {
            params['lastName'] = values.lastName;
        }

        if ($("#phone-input").prop('checked')) {
            params['phone'] = values.phone;
        }

        console.log(params);

        let url = environment.API_URL + "/user/search";

        this.http.post(url, params, {
            headers: this.appAuthService.getAuthHeader(),
            observe: 'response'
        }).subscribe(
            success => {
                let body: any = success.body;

                body.forEach(element => {
                    let user = User.fromJSON(element);
                    this.users.push(user);
                });

                if (this.users.length > 0) {
                    this.toastr.success("Successfully found users!", "Success");
                } else {
                    this.toastr.error("No users were found. Try search again.", "Error!");
                }
            }
        );
    }

    phoneValid: boolean = false;
    phoneCompleted: boolean = false;

    phoneValidCheck(phn: string): boolean {
        let value: boolean = true;

        if (phn.length != 14) {
            value = false;
        }

        for (let i = 0; i < phn.length; i++) {
            switch (i) {
                case 0:
                    if (phn.charAt(0) != "(") {
                        value = false;
                    }
                    break
                case 4:
                    if (phn.charAt(4) != ")") {
                        value = false;
                    }
                    break;
                case 5:
                    if (phn.charAt(5) != " ") {
                        value = false;
                    }
                    break;
                case 9:
                    if (phn.charAt(9) != "-") {
                        value = false;
                    }
                    break;
                default:
                    if ((phn.charCodeAt(i) < "0".charCodeAt(0)) || (phn.charCodeAt(i) > "9".charCodeAt(0))) {
                        value = false;
                    }
            }
        }

        return value;
    }

    previousCount = 0;
    phoneOnChange(): void {
        let phoneValue: string = this.phone.nativeElement.value;

        let digitCount = 0;
        for (let i = 0; i < phoneValue.length; i++) {
            if ((phoneValue.charCodeAt(i) > "0".charCodeAt(0)) && phoneValue.charCodeAt(i) < "9".charCodeAt(0)) {
                digitCount++;
            }
        }

        if ((phoneValue.length == 14) || (digitCount == 10)) {
            this.phoneCompleted = true;
            this.phoneValid = this.phoneValidCheck(phoneValue);
        } else {
            this.phoneCompleted = false;
        }

        if (this.previousCount < phoneValue.length) {
            if (phoneValue.length == 3) {
                if (phoneValue.charAt(0) != "(") {
                    let text = "(" + phoneValue + ") ";
                    this.phone.nativeElement.value = text;
                }
            } else if (phoneValue.length == 5) {
                if (phoneValue.charAt(4) != ")") {
                    let substr = phoneValue.substr(4, 5);
                    let text = phoneValue.substr(0, 4) + ") " + substr;
                    this.phone.nativeElement.value = text;
                }

            } else if (phoneValue.length == 10) {
                if (phoneValue.charAt[9] != "-") {
                    let substr = phoneValue.substr(9, 10);
                    let text = phoneValue.substr(0, 9) + "-" + substr;
                    this.phone.nativeElement.value = text;
                }
            } else if (phoneValue.length == 9) {
                let text = phoneValue + "-";
                this.phone.nativeElement.value = text;
            } else if (phoneValue.length == 15) {
                let substr = phoneValue.substr(0, 14);
                this.phone.nativeElement.value = substr;
                this.phoneCompleted = true;
            } else {
                // removed character
            }
        }
        let str: string = this.phone.nativeElement.value;
        this.previousCount = str.length;
    }

    focusemail() {
        $("#email-input").prop("checked", true);
    }

    focusoutemail() {
        let value = $('#email').val();
        if (!value) {
            $("#email-input").prop("checked", false);
        }
    }

    focusfirstName() {
        $("#firstName-input").prop("checked", true);
    }

    focusoutfirstName() {
        let value = $('#firstName').val();
        if (!value) {
            $("#firstName-input").prop("checked", false);
        }
    }

    focuslastName() {
        $("#lastName-input").prop("checked", true);
    }

    focusoutlastName() {
        let value = $('#lastName').val();
        if (!value) {
            $("#lastName-input").prop("checked", false);
        }
    }

    focusphone() {
        $("#phone-input").prop("checked", true);
    }

    focusoutphone() {
        let value = $('#phone').val();
        if (!value) {
            $("#phone-input").prop("checked", false);
        }
    }

    viewUser(id) {
        this.router.navigateByUrl("/users/view-user/" + id);
    }

}