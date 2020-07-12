import { DataproviderService } from './../../services/dataprovider.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  searchTxt: string = "";
  startDate: any;
  endDate: any;
  totalAmount = 0;
  totalDataSubscription: any;

  constructor(private _dataProvider: DataproviderService) { 
    this.totalDataSubscription = _dataProvider.totalSource$.subscribe((totalData) => {
      this.totalAmount = totalData;
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.totalDataSubscription.unsubscribe();
  }

}
