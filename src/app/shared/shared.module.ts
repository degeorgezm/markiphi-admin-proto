import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbPaginationModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FeatherIconsComponent } from './components/feather-icons/feather-icons.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ReturnBoxComponent } from './components/return-box/return-box.component';
import { PreviousReturnsSub } from './components/return-box/return-box.component';
import { OrderBoxComponent, ViewReturnStatusSub, ReturnSubmit2Sub, DropOrderSub, CancelOrderSub, ViewRefundStatusSub, ConfirmProcessOrderSub } from './components/order-box/order-box.component';

import { ToggleFullscreenDirective } from "./directives/fullscreen.directive";
import { ContentLayoutComponent } from './layout/content-layout/content-layout.component';
import { NavService } from './service/nav.service';
import { WINDOW_PROVIDERS } from './service/windows.service';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { RightSidebarComponent } from './components/right-sidebar/right-sidebar.component';

@NgModule({
  declarations: [
    ToggleFullscreenDirective,
    FeatherIconsComponent,
    FooterComponent,
    HeaderComponent,
    SidebarComponent,
    ContentLayoutComponent,
    BreadcrumbComponent,
    RightSidebarComponent,
    ReturnBoxComponent,
    PreviousReturnsSub,
    OrderBoxComponent,
    ViewReturnStatusSub,
    ReturnSubmit2Sub,
    DropOrderSub,
    CancelOrderSub,
    ViewRefundStatusSub,
    ConfirmProcessOrderSub
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgbPaginationModule,
    NgbAlertModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule
  ],
  providers: [NavService, WINDOW_PROVIDERS],
  exports: [
    FeatherIconsComponent,
    ToggleFullscreenDirective,
    ReturnBoxComponent,
    OrderBoxComponent
  ]
})
export class SharedModule { }
