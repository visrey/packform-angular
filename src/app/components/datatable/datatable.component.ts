import { MainData } from './../../models/main-data';
import { DataproviderService } from './../../services/dataprovider.service';
import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { Page } from './../../models/page';
import { CurrencyPipe, DatePipe } from '@angular/common';


@Component({
  selector: 'app-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.scss']
})

export class DatatableComponent implements OnInit, OnChanges {
  @Input() searchQuery: string;
  @Input() startDate: string;
  @Input() endDate: string;

  page = new Page()
  rows = new Array<MainData>();
  columns = [
    { name: 'Order name', prop: 'order_name', sortable: false },
    { name: 'Customer Company', prop: 'companyname', sortable: false },
    { name: 'Customer name', prop: 'customername', sortable: false },
    // { name: 'Order date', prop: 'created', sortable: true, pipe: new DatePipe('en-US').transform(date, format) },
    { name: 'Order date', prop: 'created', sortable: true },
    { name: 'Delivered Amount', prop: 'deliveredamount', sortable: false, pipe: new CurrencyPipe('en-US')},
    { name: 'Total Amount', prop: 'totalamount', sortable: false, pipe: new CurrencyPipe('en-US') }
  ];
  loading = false;
  sorted = false;

  customers: any;
  companies: any;

  constructor(private _dataProvider: DataproviderService) {
    this.page.offset = 0;
    this.page.limit = 5;
  }

  ngOnInit(): void {
    this.loading = true;
    this._dataProvider.getTotalOrders(this.searchQuery,this.startDate,this.endDate).subscribe((total)=>{
      this.page.totalElements = total;
      let quotient = Math.floor(this.page.totalElements/5);
      let remainder = this.page.totalElements % 5;
      if(remainder > 0) {
        quotient++;
      }
      this.page.totalPages = quotient;
      this._dataProvider.getCompanies().subscribe((companies)=>{
        this._dataProvider.getCustomers().subscribe((customers)=>{
          this.companies = companies;
          this.customers = customers;
          this.setPage({ offset: 0 });
        });
      });
    });
  }

  setPage(pageInfo){
    this.page.offset = pageInfo.offset;
    this._dataProvider.getOrders(this.page.offset * 5,this.page.limit,this.sorted,this.searchQuery,this.startDate,this.endDate).subscribe(orderData => {
      this.confgureTableData(orderData);
    });
  }
  confgureTableData(ordersData) {
    let completeOrders = new Array<MainData>();
    ordersData.forEach(order => {
      let customer = this.customers.filter((customerel)=> {
        return customerel.userid == order.customer_id
      })
      let companies = this.companies.filter((companyel)=> {
        return companyel.companyid == customer[0].company_id
      })
      let createdMillis = Date.parse(order.created);
      let formatted = new DatePipe('en-us').transform(createdMillis, 'MMM dd, h:m a');
      let orderData = new MainData(order.order_name, formatted, order.totalamount, order.deliveredamount,customer[0].name,companies[0].companyname);
      completeOrders.push(orderData);
    });    
    this.rows = completeOrders;
    this.loading = false;
    this._dataProvider.getTotalAmount(this.searchQuery,this.startDate,this.endDate).subscribe(totalAmount => {
      this._dataProvider.publishTotalAmountData(totalAmount);
    })
  }

  onSort(event) {
    this.loading = true;
    this.sorted = !this.sorted;
    this.page.offset = 0;
    this._dataProvider.getOrders(this.page.offset * 5,this.page.limit,this.sorted,this.searchQuery,this.startDate,this.endDate).subscribe(orderData => {
      this.confgureTableData(orderData);
      this.loading = false;
    });
  }

  ngOnChanges(changes: SimpleChanges){
    if((changes.searchQuery != undefined) && (changes.searchQuery.currentValue != changes.searchQuery.previousValue) && (!changes.searchQuery.firstChange)) {
      this.searchQuery = changes.searchQuery.currentValue;
      this._dataProvider.getTotalOrders(this.searchQuery,this.startDate,this.endDate).subscribe((total)=>{
        this.page.totalElements = total;
        let quotient = Math.floor(this.page.totalElements/5);
        let remainder = this.page.totalElements % 5;
        if(remainder > 0) {
          quotient++;
        }
        this.page.totalPages = quotient;
        this.setPage({ offset: 0 })
      });
    }
    if(changes.startDate != undefined && (changes.startDate.currentValue != changes.startDate.previousValue) && !changes.startDate.firstChange) {
      this.startDate = changes.startDate.currentValue;
      let createdMillis = Date.parse(this.startDate);
      let formatted = new DatePipe('en-us').transform(createdMillis, 'y-MM-dd');
      this.startDate = formatted;
    }
    if(changes.endDate != undefined && (changes.endDate.currentValue != changes.endDate.previousValue) && !changes.endDate.firstChange) {
      this.endDate = changes.endDate.currentValue;
      let createdMillis = Date.parse(this.endDate);
      let formatted = new DatePipe('en-us').transform(createdMillis, 'y-MM-dd');
      this.endDate = formatted;
      this._dataProvider.getTotalOrders(this.searchQuery,this.startDate,this.endDate).subscribe((total)=>{
        this.page.totalElements = total;
        let quotient = Math.floor(this.page.totalElements/5);
        let remainder = this.page.totalElements % 5;
        if(remainder > 0) {
          quotient++;
        }
        this.page.totalPages = quotient;
        this.setPage({ offset: 0 })
      });
    }
  }

}
