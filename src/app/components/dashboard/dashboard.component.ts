import { Component, OnInit } from '@angular/core';
import * as chartData from '../../shared/data/chart';
import { doughnutData, pieData } from '../../shared/data/chart';
import { AppAuthenticationService } from 'src/app/_services/app-authentication.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Order } from 'src/app/_models/shop';
import { addDays } from 'src/app/_models/macros';
import { Statistic } from 'src/app/_models/statistic';
import { dayToString } from 'src/app/_models/macros';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public doughnutData = doughnutData;
  public pieData = pieData;
  constructor(private appAuthService: AppAuthenticationService, private http: HttpClient) {
    Object.assign(this, { doughnutData, pieData })
  }

  // doughnut 2
  public view = chartData.view;
  public doughnutChartColorScheme = chartData.doughnutChartcolorScheme;
  public doughnutChartShowLabels = chartData.doughnutChartShowLabels;
  public doughnutChartGradient = chartData.doughnutChartGradient;
  public doughnutChartTooltip = chartData.doughnutChartTooltip;

  public chart5 = chartData.chart5;


  // lineChart
  public lineChartData = chartData.lineChartData;
  public lineChartLabels = chartData.lineChartLabels;
  public lineChartOptions = chartData.lineChartOptions;
  public lineChartColors = chartData.lineChartColors;
  public lineChartLegend = chartData.lineChartLegend;
  public lineChartType = chartData.lineChartType;

  // lineChart
  public smallLineChartData = chartData.smallLineChartData;
  public smallLineChartLabels = chartData.smallLineChartLabels;
  public smallLineChartOptions = chartData.smallLineChartOptions;
  public smallLineChartColors = chartData.smallLineChartColors;
  public smallLineChartLegend = chartData.smallLineChartLegend;
  public smallLineChartType = chartData.smallLineChartType;

  // lineChart
  public smallLine2ChartData = chartData.smallLine2ChartData;
  public smallLine2ChartLabels = chartData.smallLine2ChartLabels;
  public smallLine2ChartOptions = chartData.smallLine2ChartOptions;
  public smallLine2ChartColors = chartData.smallLine2ChartColors;
  public smallLine2ChartLegend = chartData.smallLine2ChartLegend;
  public smallLine2ChartType = chartData.smallLine2ChartType;

  // lineChart
  public smallLine3ChartData = chartData.smallLine3ChartData;
  public smallLine3ChartLabels = chartData.smallLine3ChartLabels;
  public smallLine3ChartOptions = chartData.smallLine3ChartOptions;
  public smallLine3ChartColors = chartData.smallLine3ChartColors;
  public smallLine3ChartLegend = chartData.smallLine3ChartLegend;
  public smallLine3ChartType = chartData.smallLine3ChartType;

  // lineChart
  public smallLine4ChartData = chartData.smallLine4ChartData;
  public smallLine4ChartLabels = chartData.smallLine4ChartLabels;
  public smallLine4ChartOptions = chartData.smallLine4ChartOptions;
  public smallLine4ChartColors = chartData.smallLine4ChartColors;
  public smallLine4ChartLegend = chartData.smallLine4ChartLegend;
  public smallLine4ChartType = chartData.smallLine4ChartType;

  public chart3 = chartData.chart3;

  public total_sales: number = 0;
  public net_sales: number = 0;
  public return_sales: number = 0;
  public item_count: number = 0;

  public loaded: boolean = false;

  public orders: Order[] = [];
  public statistics: Statistic[] = [];
  public dailySales: number[] = [];
  public dailyReturns: number[] = [];
  public dailyNet: number[] = [];
  public labels: string[] = [];

  // events
  public chartClicked(e: any): void {
  }
  public chartHovered(e: any): void {
  }

  ngOnInit() {

    // Token Authenticate

    this.appAuthService.tokenAuthenticate(() => { });

    // Get Statistics for this month

    let date = new Date();

    let year1 = date.getFullYear();
    let month1 = date.getMonth();
    let day1 = 1;

    let year2 = month1 <= 11 ? year1 : year1 + 1;
    let month2 = month1 <= 11 ? month1 + 1 : 1;
    let day2 = 1;

    let date1 = new Date(year1, month1, day1);
    let date2 = new Date(year2, month2, day2);

    let params = {
      start: date1,
      end: date2
    }

    let url = environment.API_URL + "/statistic/generate";

    this.http.post(url, params, {
      headers: this.appAuthService.getAuthHeader(),
      observe: 'response'
    }).subscribe(
      success => {
        let body: any = success.body;

        console.log("Statistics Successfully Fetched");
        console.log(body);

        this.total_sales = parseInt(parseFloat(body.total_sales).toFixed(0));
        this.net_sales = parseInt(parseFloat(body.total_net_sales).toFixed(0));
        this.return_sales = parseInt(parseFloat(body.total_return_sales).toFixed(0));
        this.item_count = body.total_item_count;

        this.loaded = true;

      },
      error => {
        console.log("Error fetching statistics");
        console.log(error.error);

        this.loaded = true;
      }
    );


    // Get Order Information

    let url2 = environment.API_URL + "/shopping/orders?limit=5";

    this.http.get(url2, {
      headers: this.appAuthService.getAuthHeader(),
      observe: 'response'
    }).subscribe(
      success => {
        console.log("Orders successfully retrieved");

        let body: any = success.body;

        body.forEach(element => {
          let order = Order.fromJSON(element);

          this.orders.push(order);
        });
      },
      error => {
        console.log("Error retrieving orders");

        console.log(error.error);
      }
    );

    // Generate Graph of Daily Sales

    let today = new Date();
    let stats: Statistic[] = [];
    let dailySales: number[] = [];
    let dailyReturns: number[] = [];

    for (let i = 0; i < 8; i++) {
      let day = today.getDay().toString();
      this.labels.splice(0, 0, dayToString(day));
      today = addDays(today, -1);
    }

    this.chart3.data.labels = this.labels;

    let url3 = environment.API_URL + "/statistic/retrieve?limit=8";

    this.http.get(url3, {
      headers: this.appAuthService.getAuthHeader(),
      observe: 'response'
    }).subscribe(
      success => {
        console.log("Sucessfully fetched Stats");

        let body: any = success.body;

        console.log(body);

        body.forEach(element => {
          let statistic = Statistic.fromJSON(element);

          this.statistics.push(statistic);
        });

        this.statistics.forEach(stat => {
          this.dailySales.splice(0, 0, stat.daily_sales);
          this.dailyReturns.splice(0, 0, stat.daily_return_sales);
          this.dailyNet.splice(0, 0, stat.daily_net_sales);
        });

        this.chart3.data.series = [
          this.dailyReturns,
          this.dailySales,
          this.dailyNet
        ]


      },
      error => {
        console.log("Error fetching Stats")

        console.log(error.error);
      }
    )

  }

}
