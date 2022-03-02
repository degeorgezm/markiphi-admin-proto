import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SiteSettingsComponent } from './site/site.component';
import { ProfileComponent } from './profile/profile.component';


const routes: Routes = [
  {
    path: 'site',
    component: SiteSettingsComponent,
    data: {
      title: "Site Settings",
      breadcrumb: "Site Settings"
    }
  },
  {
    path: 'profile',
    component: ProfileComponent,
    data: {
      title: "Profile Settings",
      breadcrumb: "Profile Settings"
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
