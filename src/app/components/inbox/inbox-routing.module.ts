import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrdersProcessingComponent } from './orders/orders.component';
import { ReturnsProcessingComponent } from './returns/returns.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'orders',
        component: OrdersProcessingComponent,
        data: {
          title: "New Orders",
          breadcrumb: "New Orders"
        }
      },
      {
        path: 'returns',
        component: ReturnsProcessingComponent,
        data: {
          title: "New Returns",
          breadcrumb: "New Returns"
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InboxRoutingModule { }
