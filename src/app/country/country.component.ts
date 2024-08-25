import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {DatePipe, NgForOf} from "@angular/common";
import {CommonModule} from "@angular/common";
import {ChangeDetectorRef} from "@angular/core";
import {MatCardModule} from "@angular/material/card";
import {MatListModule} from "@angular/material/list";
import {MatButtonModule} from "@angular/material/button";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";


@Component({
  selector: 'app-country',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    NgForOf,
    MatCardModule,
    MatListModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './country.component.html',
  styleUrl: './country.component.scss'
})
export class CountryComponent implements OnInit {
  countryCode: string = '';
  countryName: string = '';
  holidays: any[] = [];
  currentYear: number = new Date().getFullYear();
  country: { name: string; code: string } = { name: '', code: '' };


  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    public router: Router
  ) {
    this.router = router;
  }

  ngOnInit(): void {
    this.countryCode = this.route.snapshot.paramMap.get('code')!;
    this.country.name = this.getCountryName(this.countryCode);
    this.country = { name: this.country.name, code: this.countryCode };
    this.fetchHolidays();
    this.fetchCountryName(this.countryCode);
  }

  getCountryName(countryCode: string): string {
    const countryMap: { [key: string]: string } = {
      'US': 'United States',
      'GB': 'Great Britain',
    };
    return countryMap[countryCode] || 'Unknown Country';
  }


  fetchCountryName(countryCode: string) {
    this.http.get(`https://restcountries.com/v3.1/alpha/${countryCode}`)
      .subscribe((data: any) => {
        this.countryName = data[0].name.common;
        this.cdr.detectChanges();
      }, error => {
        console.error('Error fetching country name:', error);
        this.countryName = 'Unknown Country';
      });
  }

  fetchHolidays() {
    if (!this.countryCode) {
      return;
    }

    this.http.get(`https://date.nager.at/api/v3/PublicHolidays/${this.currentYear}/${this.countryCode}`)
      .subscribe((data: any) => {
        this.holidays = data;
        this.cdr.detectChanges()
        });
  }

  changeYear(year: number) {
    this.currentYear = year;
    this.fetchHolidays();
  }

  goHome() {
    this.router.navigate(['']);
  }

}
