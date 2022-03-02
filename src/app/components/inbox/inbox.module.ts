import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { NgbPaginationModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

import { Ng2SmartTableModule } from 'ng2-smart-table';
import { InboxRoutingModule } from './inbox-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

import { OrdersProcessingComponent } from './orders/orders.component';
import { ReturnsProcessingComponent } from './returns/returns.component';
import { ProcessingBoxComponent } from './_components/processing-box/processing-box.component';
import { ReturnSubmitSub } from '../../shared/components/return-box/return-box.component';
import { StartProcessingOrderSub } from './_components/processing-box/processing-box.component';

import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    OrdersProcessingComponent,
    ProcessingBoxComponent,
    ReturnsProcessingComponent,
    ReturnSubmitSub,
    StartProcessingOrderSub
  ],
  imports: [
    CommonModule,
    NgbModule,
    Ng2SmartTableModule,
    ReactiveFormsModule,
    InboxRoutingModule,
    FormsModule,
    DataTablesModule,
    SharedModule,
    NgbPaginationModule,
    NgbAlertModule,
  ]
})
export class InboxModule { }
