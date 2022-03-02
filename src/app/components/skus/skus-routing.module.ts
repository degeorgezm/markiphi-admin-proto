import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
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

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'manage-skus',
                component: ManageSkusComponent,
                data: {
                    title: "Manage Skus",
                    breadcrumb: "Manage SKUs"
                }
            },
            {
                path: 'brand-view/:brandId',
                component: BrandViewComponent,
                data: {
                    title: "View Brand",
                    breadcrumb: "View Brand"
                }
            },
            {
                path: 'brand-edit/:brandId',
                component: BrandEditComponent,
                data: {
                    title: "Edit Brand",
                    breadcrumb: "Edit Brand"
                }
            },
            {
                path: 'type-edit/:typeId',
                component: TypeEditComponent,
                data: {
                    title: "Edit Type",
                    breadcrumb: "Edit Type"
                }
            },
            {
                path: 'type-view/:typeId',
                component: TypeViewComponent,
                data: {
                    title: "View Type",
                    breadcrumb: "View Type"
                }
            },
            {
                path: 'group-view/:groupId',
                component: GroupViewComponent,
                data: {
                    title: "View Group",
                    breadcrumb: "View Group"
                }
            },
            {
                path: 'group-edit/:groupId',
                component: GroupEditComponent,
                data: {
                    title: "Edit Group",
                    breadcrumb: "Edit Group"
                }
            },
            {
                path: 'size-view/:sizeId',
                component: SizeViewComponent,
                data: {
                    title: "View Size",
                    breadcrumb: "View Size"
                }
            },
            {
                path: 'size-edit/:sizeId',
                component: SizeEditComponent,
                data: {
                    title: "Edit Size",
                    breadcrumb: "Edit Size"
                }
            },
            {
                path: 'variant-view/:variantId',
                component: VariantViewComponent,
                data: {
                    title: "View Variant",
                    breadcrumb: "View Variant"
                }
            },
            {
                path: 'variant-edit/:variantId',
                component: VariantEditComponent,
                data: {
                    title: "Edit Variant",
                    breadcrumb: "Edit Variant"
                }
            },
            {
                path: 'department-view/:departmentId',
                component: DepartmentViewComponent,
                data: {
                    title: "View Department",
                    breadcrumb: "View Department"
                }
            },
            {
                path: 'department-edit/:departmentId',
                component: DepartmentEditComponent,
                data: {
                    title: "Edit Department",
                    breadcrumb: "Edit Department"
                }
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SkusRoutingModule { }