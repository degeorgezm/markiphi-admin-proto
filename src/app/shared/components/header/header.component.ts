import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AppAuthenticationService } from 'src/app/_services/app-authentication.service';
import { User } from 'src/app/_models/user';
import { NavService } from '../../service/nav.service';


const defaultProfilePicSrc = "assets/images/dashboard/man.png"

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public right_sidebar: boolean = false;
  public open: boolean = false;
  public openNav: boolean = false;
  public isOpenMobile: boolean;

  public user: User;
  public profilePic = {
    src: defaultProfilePicSrc
  }

  @Output() rightSidebarEvent = new EventEmitter<boolean>();

  constructor(public navServices: NavService, private appAuthService: AppAuthenticationService) { }

  collapseSidebar() {
    this.open = !this.open;
    this.navServices.collapseSidebar = !this.navServices.collapseSidebar
  }
  right_side_bar() {
    this.right_sidebar = !this.right_sidebar
    this.rightSidebarEvent.emit(this.right_sidebar)
  }

  openMobileNav() {
    this.openNav = !this.openNav;
  }


  ngOnInit() {

    this.appAuthService.tokenAuthenticate(() => {

      this.user = this.appAuthService.getAuthUser();

      let image = this.appAuthService.getUserImage();
      if (image != "") {
        this.profilePic.src = image;
      }
    })

    AppAuthenticationService.userProfileSubject.subscribe(value => {
      if (value == true) {
        let image = this.appAuthService.getUserImage();
        if (image != "") {
          this.profilePic.src = image;
        } else {
          this.profilePic.src = defaultProfilePicSrc;
        }
      } else {
        this.profilePic.src = defaultProfilePicSrc;
      }
    });

  }

  logout() {
    this.appAuthService.logout();
  }

}
