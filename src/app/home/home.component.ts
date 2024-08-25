import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import {DatePipe, NgForOf} from "@angular/common";
import {CommonModule} from "@angular/common";
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {MatListModule} from "@angular/material/list";
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterOutlet,
    FormsModule,
    DatePipe,
    CommonModule,
    NgForOf,
    MatCardModule,
    MatListModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  countries: any[] = [];
  randomCountries: any[] = [];
  filteredCountries: any[] = [];
  searchTerm: string = '';
  showCountriesList: boolean = false;

  constructor(private http: HttpClient, public router: Router) {
    this.router = router;
  }

  ngOnInit(): void {
    this.fetchCountries();
    this.fetchRandomCountries();
    this.filterCountries();
  }

  fetchCountries() {
    this.http.get('https://date.nager.at/api/v3/AvailableCountries')
      .subscribe((data: any) => {
        this.countries = data;
        this.filteredCountries = data;
        this.getRandomCountriesWithHoliday();
      });
  }

  filterCountries() {
    this.showCountriesList = this.searchTerm.trim() !== '';

    this.filteredCountries = this.countries.filter(country =>
      country.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  fetchRandomCountries() {
    const selectedCountries = this.countries.sort(() => 0.5 - Math.random()).slice(0, 3);
    selectedCountries.forEach(country => {
      this.http.get(`https://date.nager.at/api/v3/NextPublicHolidays/${country.countryCode}`)
        .subscribe((holidays: any) => {
          this.randomCountries.push({
            name: country.name,
            holiday: holidays[0] || { name: 'No upcoming holidays', date: null }
          });
        });
    });
  }

  getRandomCountriesWithHoliday() {
    const randomIndexes = this.getRandomIndexes(this.countries.length, 3);
    this.randomCountries = randomIndexes.map(index => this.countries[index]);

    this.randomCountries.forEach(country => {
      this.http.get(`https://date.nager.at/api/v3/NextPublicHolidays/${country.countryCode}`)
        .subscribe((holidays: any) => {
          country.holiday = holidays.length ? holidays[0] : null;
        }, error => {
          console.error('Error fetching holidays for country:', country.countryCode, error);
          country.holiday = null;
        });
    });
  }

  getRandomIndexes(arrayLength: number, count: number): number[] {
    const indexes: number[] = [];
    while (indexes.length < count) {
      const randomIndex = Math.floor(Math.random() * arrayLength);
      if (!indexes.includes(randomIndex)) {
        indexes.push(randomIndex);
      }
    }
    return indexes;
  }

  onSearch() {
    this.filteredCountries = this.countries.filter(country =>
      country.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  selectCountry(country: any) {
    this.router.navigate(['/country', country.countryCode]);
  }
}
