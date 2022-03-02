import { Component, Input, ViewEncapsulation, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { NavService, Menu } from '../../service/nav.service';
import { AppAuthenticationService } from 'src/app/_services/app-authentication.service';
import { User } from 'src/app/_models/user';
import { HttpClient } from '@angular/common/http';
import { Buffer } from 'buffer';

const fs = require('fs')
const defaultProfilePicSrc = "assets/images/dashboard/man.png"
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SidebarComponent implements OnInit {

  public menuItems: Menu[];
  public url: any;
  public fileurl: any;
  public user: User;
  public loaded: boolean = false;

  public profilePic = {
    src: defaultProfilePicSrc
  }

  constructor(private router: Router, public navServices: NavService, private appAuthService: AppAuthenticationService, private http: HttpClient) {
    this.navServices.items.subscribe(menuItems => {
      this.menuItems = menuItems
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          menuItems.filter(items => {
            if (items.path === event.url)
              this.setNavActive(items)
            if (!items.children) return false
            items.children.filter(subItems => {
              if (subItems.path === event.url)
                this.setNavActive(subItems)
              if (!subItems.children) return false
              subItems.children.filter(subSubItems => {
                if (subSubItems.path === event.url)
                  this.setNavActive(subSubItems)
              })
            })
          })
        }
      })
    })
  }

  ngOnInit() {
    this.appAuthService.tokenAuthenticate(() => {
      this.user = this.appAuthService.getAuthUser();
      this.loaded = true;
      let image = this.appAuthService.getUserImage();
      console.log(image.length);
      if (image.length > 50) {
        this.profilePic.src = image;
      } else {
        console.log("Fetching Profile image");

        let url = this.user.getDownloadProfileImageURL();

        console.log(url);

        this.http.get(url, {
          headers: this.appAuthService.getAuthHeader(),
          observe: 'response',
          responseType: 'blob'
        }).subscribe(
          success => {
            let blob = success.body;

            var reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
              let image = reader.result.toString();
              if (image.length > 50) {
                this.profilePic.src = image;
                this.appAuthService.updateUserImage(image);
                AppAuthenticationService.userProfileSubject.next(true);
              } else {
                this.profilePic.src = defaultProfilePicSrc;
                AppAuthenticationService.userProfileSubject.next(false);
              }
            }
          },
          error => {
            console.log("Error Downloading User Profile Picture")
            this.profilePic.src = defaultProfilePicSrc;
            AppAuthenticationService.userProfileSubject.next(false);
          });
      }
    });
  }

  // Active Nave state
  setNavActive(item) {
    this.menuItems.filter(menuItem => {
      if (menuItem != item)
        menuItem.active = false
      if (menuItem.children && menuItem.children.includes(item))
        menuItem.active = true
      if (menuItem.children) {
        menuItem.children.filter(submenuItems => {
          if (submenuItems.children && submenuItems.children.includes(item)) {
            menuItem.active = true
            submenuItems.active = true
          }
        })
      }
    })
  }

  // Click Toggle menu
  toggletNavActive(item) {
    if (!item.active) {
      this.menuItems.forEach(a => {
        if (this.menuItems.includes(item))
          a.active = false
        if (!a.children) return false
        a.children.forEach(b => {
          if (a.children.includes(item)) {
            b.active = false
          }
        })
      });
    }
    item.active = !item.active
  }

  //Fileupload
  readUrl(event: any) {
    if (event.target.files.length === 0)
      return;
    //Image upload validation
    var mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    // Image upload
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (_event) => {
      this.url = reader.result;
    }
  }

}
