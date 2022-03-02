import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductViewComponent } from './product-view/product-view.component';
import { ProductCreateComponent } from './product-create/product-create.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductEditComponent } from './product-edit/product-edit.component';
import { ProductInventoryComponent } from './product-inventory/product-inventory.component';
import { ProductPhotosComponent } from './product-photos/product-photos.component';
import { ProductSalesComponent } from './product-sales/product-sales.component';
import { ProductSaleCreateComponent } from './product-sale-create/product-sale-create.component';
import { ProductSaleEditComponent } from './product-sale-edit/product-sale-edit.component';
import { ProductSaleViewComponent } from './product-sale-view/product-sale-view.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'product-list',
        component: ProductListComponent,
        data: {
          title: "Product List",
          breadcrumb: "Product List"
        }
      },
      {
        path: 'product-view',
        component: ProductViewComponent,
        data: {
          title: "Product View",
          breadcrumb: "Product View"
        }
      },
      {
        path: 'product-detail/:productId',
        component: ProductDetailComponent,
        data: {
          title: "Product Detail",
          breadcrumb: "Product Detail"
        }
      },
      {
        path: 'product-create',
        component: ProductCreateComponent,
        data: {
          title: "Create Product",
          breadcrumb: "Create Product"
        },
      },
      {
        path: 'product-edit/:productId',
        component: ProductEditComponent,
        data: {
          title: "Edit Product",
          breadcrumb: "Edit Product"
        }
      },
      {
        path: 'product-inventory/:productId',
        component: ProductInventoryComponent,
        data: {
          title: "Product Inventory",
          breadcrumb: "Product Inventory"
        }
      },
      {
        path: 'product-images/:productId',
        component: ProductPhotosComponent,
        data: {
          title: "Product Images",
          breadcrumb: "Product Images"
        }
      },
      {
        path: 'product-sales/:productId',
        component: ProductSalesComponent,
        data: {
          title: "Product Sales",
          breadcrumb: "Product Sales"
        }
      },
      {
        path: 'product-sales-create/:productId',
        component: ProductSaleCreateComponent,
        data: {
          title: "Create Sale",
          breadcrumb: "Create Sale"
        }
      },
      {
        path: 'product-sales-edit/:productId/sale/:salesId',
        component: ProductSaleEditComponent,
        data: {
          title: "Edit Sale",
          breadcrumb: "Edit Sale"
        }
      },
      {
        path: 'product-sales-view/:productId/sale/:salesId',
        component: ProductSaleViewComponent,
        data: {
          title: "View Sale",
          breadcrumb: "View Sale"
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
