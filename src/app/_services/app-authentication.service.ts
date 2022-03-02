import { User } from 'src/app/_models/user';
import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';

// key that is used to access the data in local storage
const USER_STORAGE_KEY = 'local_user';
const AUTH_STORAGE_KEY = 'local_auth';
const USER_IMAGE_KEY = 'local_image';

@Injectable({
    // declares that this service should be created
    // by the root application injector.
    providedIn: 'root',
})
export class AppAuthenticationService {

    constructor(private http: HttpClient, private router: Router, @Inject(LOCAL_STORAGE) private storage: StorageService) { }

    public tokenAuthenticate(callback: Function) {

        if (!this.storage.has(AUTH_STORAGE_KEY)) {
            this.logout();
            callback();
        }

        this.http.get(environment.API_URL + "/authenticate/verify", {
            headers: this.getAuthHeader(),
            observe: 'response'
        }).subscribe(
            success => {
                // continue to site

                let admin: boolean = success.body['admin'];
                if (!admin) {
                    this.logout();
                    callback();
                }

                let user = this.getAuthUser();
                let prevUpdatedDate = user._updatedDate.toString();
                let updatedDate = new Date(success.body['_updatedDate']).toString();

                if (prevUpdatedDate != updatedDate) {

                    console.log("User model updated. Fetching updated user...");

                    this.http.get(environment.API_URL + "/user/" + user._id, {
                        headers: this.getAuthHeader(),
                        observe: 'response'
                    }).subscribe(
                        success => {
                            console.log("Successfully fetched new user");

                            let user = User.fromJSON(success.body);
                            this.storeUser(user.toJSON());

                            AppAuthenticationService.authSubject.next(true);
                            callback();
                        },
                        error => {
                            // do something
                            console.log("Error fetching new user");
                            console.log(error);
                            this.logout();
                            callback();
                        });
                } else {
                    console.log("User model up to date")

                    AppAuthenticationService.authSubject.next(true);
                    callback();
                }
            },
            error => {
                this.logout();
                callback();
            });
    }

    public static authSubject = new Subject();
    public static userProfileSubject = new Subject();

    public deleteAllStorage(): void {
        this.storage.remove(AUTH_STORAGE_KEY);
        this.storage.remove(USER_STORAGE_KEY);
        this.storage.remove(USER_IMAGE_KEY);
    }

    public logout(): void {
        this.deleteAllStorage();

        console.log("Logged Out");

        AppAuthenticationService.authSubject.next(false);
        this.router.navigateByUrl('/auth/login');
    }

    public getAuthUser(): User {

        if (!this.storage.has(USER_STORAGE_KEY)) {
            return new User();
        }

        return User.fromJSON(JSON.parse(this.storage.get(USER_STORAGE_KEY)));
    }

    public getAuthHeader(): HttpHeaders {
        let token = this.storage.get(AUTH_STORAGE_KEY);

        let authHeader = new HttpHeaders({ 'Authorization': token });

        return authHeader;
    }

    public getUserImage(): string {
        if (!this.storage.has(USER_IMAGE_KEY)) {
            return "";
        }

        return this.storage.get(USER_IMAGE_KEY);
    }

    public updateUserImage(image: string) {
        if (image.length > 50) {
            this.storage.set(USER_IMAGE_KEY, image);
        }
    }

    public updateAuthUser(obj: Object) {
        let json = obj.toString();

        this.storage.set(USER_STORAGE_KEY, json);
    }

    public storeLogin(auth: string, user: string) {
        this.storage.set(AUTH_STORAGE_KEY, auth);
        this.storage.set(USER_STORAGE_KEY, user);
    }

    public storeUser(user: string) {
        this.storage.set(USER_STORAGE_KEY, user);
    }


}