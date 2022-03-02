import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LookupUserComponent } from './lookup-user/lookup-user.component';
import { ViewUserComponent } from './view-user/view-user.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'lookup-user',
        component: LookupUserComponent,
        data: {
          title: "Lookup User",
          breadcrumb: "Lookup User"
        }
      },
      {
        path: 'view-user/:userId',
        component: ViewUserComponent,
        data: {
          title: "View User",
          breadcrumb: "View User"
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
