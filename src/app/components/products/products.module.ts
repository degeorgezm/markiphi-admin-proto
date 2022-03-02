import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { CKEditorModule } from 'ngx-ckeditor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProductsRoutingModule } from './products-routing.module';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductViewComponent } from './product-view/product-view.component';
import { ProductCreateComponent } from './product-create/product-create.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductEditComponent } from './product-edit/product-edit.component';
import { GalleryModule } from '@ks89/angular-modal-gallery';
import { EditorModule } from '@tinymce/tinymce-angular';
import { ProductInventoryComponent } from './product-inventory/product-inventory.component';
import { ChangeInventoryTableComponent } from './_components/change-inventory-table.component';
import { SoldTableComponent } from './_components/sold-table.component';
import { SKUsTableComponent } from './_components/skus-table.component';
import { InventoryTableComponent } from './_components/inventory-table.component';
import { OverwriteInventoryTable } from './_components/overwrite-inventory-table.component';
import { ReportLossesTableComponent } from './_components/report-losses-table.component';
import { LossTableComponent } from './_components/lost-table.component';
import { CarouselModule, WavesModule } from 'angular-bootstrap-md';
import { ProductPhotosComponent } from './product-photos/product-photos.component';
import { ProductSalesComponent } from './product-sales/product-sales.component';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule, NgxMatNativeDateModule } from '@angular-material-components/datetime-picker';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { ProductSaleCreateComponent } from './product-sale-create/product-sale-create.component';
import { ProductSaleEditComponent } from './product-sale-edit/product-sale-edit.component';
import { ProductSaleViewComponent } from './product-sale-view/product-sale-view.component';
import { ViewPricecChangeSub } from './product-sales/product-sales.component';

import 'hammerjs';
import 'mousetrap';

import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DROPZONE_CONFIG } from 'ngx-dropzone-wrapper';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';


const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
  maxFilesize: 50,
  url: 'https://httpbin.org/post',
};



@NgModule({
  declarations: [
    ProductListComponent,
    ProductViewComponent,
    ProductCreateComponent,
    ProductDetailComponent,
    ProductPhotosComponent,
    InventoryTableComponent,
    SoldTableComponent,
    SKUsTableComponent,
    ChangeInventoryTableComponent,
    ProductEditComponent,
    ProductInventoryComponent,
    OverwriteInventoryTable,
    ReportLossesTableComponent,
    LossTableComponent,
    ProductSalesComponent,
    ProductSaleCreateComponent,
    ProductSaleEditComponent,
    ProductSaleViewComponent,
    ViewPricecChangeSub
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CKEditorModule,
    ProductsRoutingModule,
    Ng2SmartTableModule,
    NgbModule,
    DropzoneModule,
    DataTablesModule,
    EditorModule,
    CarouselModule,
    WavesModule,
    GalleryModule.forRoot(),
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    MatRadioModule,
    MatSelectModule,
    MatCheckboxModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatDatepickerModule,
    MatInputModule
  ],
  providers: [
    {
      provide: DROPZONE_CONFIG,
      useValue: DEFAULT_DROPZONE_CONFIG
    },
    NgbActiveModal
  ]
})
export class ProductsModule { }
