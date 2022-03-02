import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PromotionsCreateComponent } from './promotions-create/promotions-create.component';
import { PromotionsListComponent } from './promotions-list/promotions-list.component';
import { PromotionsViewComponent } from './promotions-view/promotions-view.component';
import { PromotionsEditComponent } from './promotions-edit/promotions-edit.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'promotions-create',
        component: PromotionsCreateComponent,
        data: {
          title: "Promotion Create",
          breadcrumb: "Promotion Create"
        }
      },
      {
        path: 'promotions-list',
        component: PromotionsListComponent,
        data: {
          title: "Promotions List",
          breadcrumb: "Promotions List"
        }
      },
      {
        path: 'promotions-view/:promotionId',
        component: PromotionsViewComponent,
        data: {
          title: "Promotion View",
          breadcrumb: "Promotion View"
        }
      },
      {
        path: 'promotions-edit/:promotionId',
        component: PromotionsEditComponent,
        data: {
          title: "Promotion Edit",
          breadcrumb: "Promotion Edit"
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PromotionsRoutingModule { }
