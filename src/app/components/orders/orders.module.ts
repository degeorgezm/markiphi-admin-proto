import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { NgbPaginationModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

import { Ng2SmartTableModule } from 'ng2-smart-table';
import { OrdersRoutingModule } from './orders-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

import { OrderManageComponent } from './manage/order-manage.component';
import { OrderViewComponent } from './view/order-view.component';
import { OrderProcessComponent } from './process/order-process.component';
import { ConfirmReviewProceduresSub } from './process/order-process.component';

import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    OrderManageComponent,
    OrderViewComponent,
    OrderProcessComponent,
    ConfirmReviewProceduresSub
  ],
  imports: [
    CommonModule,
    NgbModule,
    Ng2SmartTableModule,
    ReactiveFormsModule,
    OrdersRoutingModule,
    FormsModule,
    DataTablesModule,
    SharedModule,
    NgbPaginationModule,
    NgbAlertModule
  ]
})
export class OrderModule { }
