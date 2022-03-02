import { Component, Input } from '@angular/core';

import { Product } from 'src/app/_models/product';

@Component({
    selector: 'report-losses-table',
    template: `   
    <table class="table table-striped table-hover table-bordered " style="width:100%; padding-top: 10px">
        <caption>Report Losses to Inventory</caption>
        <thead class="thead-light">
            <tr>
                <th width="20%"></th>
                <th *ngFor="let size of product.sizes" scope="col">{{size.name}}</th>
            </tr>
        </thead>
        <tbody>
            <tr *ngFor="let stock of product.stock" class="no-cell-padding">
                <th scope="row">{{stock.variant.name}}</th>
                <td *ngFor="let size of product.sizes; let i=index"><input type="number" value="0" class="form-control" style="width:60px" id="loss_{{stock.variant._id}}_{{size._id}}"></td>
            </tr>
        </tbody>                                   
    </table>
  `,
})
export class ReportLossesTableComponent {
    @Input() product: Product;
}
