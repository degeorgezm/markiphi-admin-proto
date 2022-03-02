import { Component, OnInit } from '@angular/core';
import { AppAuthenticationService } from 'src/app/_services/app-authentication.service';
import { User } from 'src/app/_models/user';

const defaultProfilePicSrc = "assets/images/dashboard/man.png";
@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

    public user: User;
    public profilePic = {
        src: "assets/images/dashboard/man.png"
    }

    constructor(private appAuthService: AppAuthenticationService) { }

    ngOnInit() {
        this.appAuthService.tokenAuthenticate(() => {
            this.user = this.appAuthService.getAuthUser();

            let image = this.appAuthService.getUserImage();
            if (image != "") {
                this.profilePic.src = image;
            }
        })

    }

}
