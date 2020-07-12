import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
  providedIn: 'root'
})
export class DataproviderService {

  totalAmount = 0;
  private totalSource = new Subject<any>();
  totalSource$ = this.totalSource.asObservable();

  constructor(private http: HttpClient) { }

  publishTotalAmountData(newTotalData: any) {
    this.totalSource.next(newTotalData);
  }

  getTotalOrders(search: string,startDate: string,endDate: string): Observable<any> {
    if(startDate == null) {
      startDate = ""
    }
    if(endDate == null) {
      endDate = ""
    } 
    return this.http.get('http://localhost:8010/total?search='+search+'&sdate='+startDate+'&edate='+endDate);
  }
  getOrders(offset: number,limit: number,sort: boolean,search: string,startDate: string,endDate: string): Observable<any> {
    if(startDate == null) {
      startDate = ""
    }
    if(endDate == null) {
      endDate = ""
    } 
    return this.http.get('http://localhost:8010/orders?start='+offset.toString()+'&count='+limit.toString()+'&sort='+String(sort)+'&search='+search+'&sdate='+startDate+'&edate='+endDate);
  }
  getTotalAmount(search: string,startDate: string,endDate: string): Observable<any> {
    if(startDate == null) {
      startDate = ""
    }
    if(endDate == null) {
      endDate = ""
    } 
    return this.http.get('http://localhost:8010/totalamount?search='+search+'&sdate='+startDate+'&edate='+endDate);
  }
  getCustomers(): Observable<any> {
    return this.http.get('http://localhost:8010/customers');
  }
  getCompanies(): Observable<any> {
    return this.http.get('http://localhost:8010/companies');
  }
}
