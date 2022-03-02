import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { NgbPaginationModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

import { LookupUserComponent } from './lookup-user/lookup-user.component';
import { ViewUserComponent } from './view-user/view-user.component';
import { ViewItemSub } from '../../shared/components/order-box/order-box.component';

import { Ng2SmartTableModule } from 'ng2-smart-table';
import { UsersRoutingModule } from './users-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    LookupUserComponent,
    ViewUserComponent,
    ViewItemSub],
  imports: [
    CommonModule,
    NgbModule,
    Ng2SmartTableModule,
    ReactiveFormsModule,
    UsersRoutingModule,
    FormsModule,
    DataTablesModule,
    SharedModule,
    NgbPaginationModule,
    NgbAlertModule,
  ]
})
export class UsersModule { }
