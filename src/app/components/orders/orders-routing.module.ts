import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderManageComponent } from './manage/order-manage.component';
import { OrderViewComponent } from './view/order-view.component';
import { OrderProcessComponent } from './process/order-process.component'

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'manage',
        component: OrderManageComponent,
        data: {
          title: "Manage Orders",
          breadcrumb: "Manage Orders"
        }
      },
      {
        path: 'view/:orderId',
        component: OrderViewComponent,
        data: {
          title: "View Order",
          breadcrumb: "View Order"
        }
      },
      {
        path: 'process/:orderId',
        component: OrderProcessComponent,
        data: {
          title: "Process Order",
          breadcrumb: "Process Order"
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersRoutingModule { }
