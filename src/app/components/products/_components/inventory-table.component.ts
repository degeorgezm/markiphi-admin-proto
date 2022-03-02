import { Component, Input } from '@angular/core';

import { Product } from 'src/app/_models/product';

@Component({
    selector: 'inventory-table',
    template: `
<table class="table table-striped table-hover table-bordered " style="width:100%; padding-top: 10px">
    <caption>Current Product Inventory</caption>    
    <thead class="thead-light">
        <tr>
            <th width="20%"></th>
            <th *ngFor="let size of product.sizes" scope="col">{{size.name}}</th>
        </tr>
    </thead>
    <tbody>
        <tr *ngFor="let stock of product.stock">
            <th scope="row">{{stock.variant.name}}</th>
            <td *ngFor="let size of product.sizes; let i=index">{{stock.inventory[i]}}</td>
        </tr>
    </tbody>                                   
</table> 
  `,
})
export class InventoryTableComponent {
    @Input() product: Product;
}