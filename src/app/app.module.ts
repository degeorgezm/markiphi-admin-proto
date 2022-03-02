import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppAuthenticationService } from 'src/app/_services/app-authentication.service';
import { HttpClientModule } from '@angular/common/http';
import { DataTablesModule } from 'angular-datatables';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardModule } from './components/dashboard/dashboard.module';
import { SharedModule } from './shared/shared.module';
import { ProductsModule } from './components/products/products.module';
import { SkusModule } from './components/skus/skus.module';
import { SalesModule } from './components/sales/sales.module';
import { CouponsModule } from './components/coupons/coupons.module';
import { PagesModule } from './components/pages/pages.module';
import { BsModalService } from 'ngx-bootstrap/modal';
import { MediaModule } from './components/media/media.module';
import { MenusModule } from './components/menus/menus.module';
import { VendorsModule } from './components/vendors/vendors.module';
import { UsersModule } from './components/users/users.module';
import { LocalizationModule } from './components/localization/localization.module';
import { InvoiceModule } from './components/invoice/invoice.module';
import { SettingsModule } from './components/settings/settings.module';
import { ReportsModule } from './components/reports/reports.module';
import { AuthModule } from './components/auth/auth.module';
import { TagInputModule } from 'ngx-chips';
import { EditorModule } from '@tinymce/tinymce-angular';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ReturnSubmitSub } from 'src/app/shared/components/return-box/return-box.component';
import { ViewItemSub } from 'src/app/shared/components/order-box/order-box.component';
import { PreviousReturnsSub } from 'src/app/shared/components/return-box/return-box.component';
import { StartProcessingOrderSub } from 'src/app/components/inbox/_components/processing-box/processing-box.component';
import { ViewPricecChangeSub } from 'src/app/components/products/product-sales/product-sales.component';
import { ViewReturnStatusSub, ReturnSubmit2Sub, DropOrderSub, CancelOrderSub, ViewRefundStatusSub, ConfirmProcessOrderSub } from 'src/app/shared/components/order-box/order-box.component';
import { ConfirmReviewProceduresSub } from 'src/app/components/orders/process/order-process.component';

TagInputModule.withDefaults({
  tagInput: {
    placeholder: 'Add new',
    // add here other default values for tag-input
  }
});

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    DashboardModule,
    EditorModule,
    InvoiceModule,
    SettingsModule,
    ReportsModule,
    NgbModule,
    AuthModule,
    SharedModule,
    LocalizationModule,
    ProductsModule,
    SkusModule,
    SalesModule,
    VendorsModule,
    CouponsModule,
    PagesModule,
    MediaModule,
    MenusModule,
    UsersModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    DataTablesModule,
    ToastrModule.forRoot({
      timeOut: 2000,
      progressBar: false,
      enableHtml: true,
    }),
    TagInputModule,
    MatNativeDateModule,
    MatDatepickerModule,
    HammerModule
  ],
  providers: [
    AppAuthenticationService,
    MatDatepickerModule,
    BsModalService],
  bootstrap: [AppComponent],
  entryComponents: [
    ReturnSubmitSub,
    ViewItemSub,
    PreviousReturnsSub,
    StartProcessingOrderSub,
    ViewPricecChangeSub,
    ViewReturnStatusSub,
    ReturnSubmit2Sub,
    DropOrderSub,
    CancelOrderSub,
    ViewRefundStatusSub,
    ConfirmProcessOrderSub,
    ConfirmReviewProceduresSub
  ]
})
export class AppModule { }
