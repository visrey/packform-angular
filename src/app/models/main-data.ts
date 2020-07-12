export class MainData {
    // id: number;
    order_name: string;
    created: string;
    totalamount: number;
    deliveredamount: number;
    companyname: string;
    customername: string;
    constructor(name: string, created: string, total: number,delivered: number, company: string, customer: string) {
        this.order_name = name;
        this.created = created;
        this.totalamount = total;
        this.deliveredamount = delivered;
        this.companyname = company;
        this.customername = customer;
    }
}