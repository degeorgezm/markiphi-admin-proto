import { Component, Input } from '@angular/core';

import { Product } from 'src/app/_models/product';

@Component({
    selector: 'change-inventory-table',
    template: `   
    <table class="table table-striped table-hover table-bordered " style="width:100%; padding-top: 10px">
        <caption>Add Values to Inventory</caption>
        <thead class="thead-light">
            <tr>
                <th width="20%"></th>
                <th *ngFor="let size of product.sizes" scope="col">{{size.name}}</th>
            </tr>
        </thead>
        <tbody>
            <tr *ngFor="let stock of product.stock" class="no-cell-padding">
                <th scope="row">{{stock.variant.name}}</th>
                <td *ngFor="let size of product.sizes; let i=index"><input type="number" class="form-control" style="width:60px" value="0" id="add_{{stock.variant._id}}_{{size._id}}"></td>
            </tr>
        </tbody>                                   
    </table>
  `,
})
export class ChangeInventoryTableComponent {
    @Input() product: Product;
}
