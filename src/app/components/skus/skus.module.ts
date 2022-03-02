import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';;
import { EditorModule } from '@tinymce/tinymce-angular';
import { CarouselModule, WavesModule } from 'angular-bootstrap-md';
import { SkusRoutingModule } from './skus-routing.module';
import { ManageSkusComponent } from './manage-skus/manage-skus.component';
import { BrandViewComponent } from './brand-view/brand-view.component';
import { BrandEditComponent } from './brand-edit/brand-edit.component';
import { TypeEditComponent } from './type-edit/type-edit.component';
import { TypeViewComponent } from './type-view/type-view.component';
import { GroupViewComponent } from './group-view/group-view.component';
import { GroupEditComponent } from './group-edit/group-edit.component';
import { SizeEditComponent } from './size-edit/size-edit.component';
import { SizeViewComponent } from './size-view/size-view.component';
import { VariantViewComponent } from './variant-view/variant-view.component';
import { VariantEditComponent } from './variant-edit/variant-edit.component';
import { DepartmentEditComponent } from './department-edit/department-edit.component';
import { DepartmentViewComponent } from './department-view/department-view.component';

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
        ManageSkusComponent,
        BrandViewComponent,
        BrandEditComponent,
        TypeEditComponent,
        TypeViewComponent,
        GroupViewComponent,
        GroupEditComponent,
        SizeEditComponent,
        SizeViewComponent,
        VariantEditComponent,
        VariantViewComponent,
        DepartmentEditComponent,
        DepartmentViewComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SkusRoutingModule,
        NgbModule,
        DropzoneModule,
        DataTablesModule,
        EditorModule,
        CarouselModule,
        WavesModule
    ],
    providers: [
        {
            provide: DROPZONE_CONFIG,
            useValue: DEFAULT_DROPZONE_CONFIG
        },
        NgbActiveModal
    ]
})
export class SkusModule { }
