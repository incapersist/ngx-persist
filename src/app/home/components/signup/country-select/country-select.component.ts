import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { Country } from '../signup.model';
import { SignupService } from '../signup.service';

@Component({
  selector: 'slu-country-select',
  templateUrl: './country-select.component.html',
  styleUrls: ['./country-select.component.scss']
})
export class CountrySelectComponent implements OnInit {

  @Input() required = false;
  @Output() country = new EventEmitter<Country>();

  countries: Country[] = null;
  selectedCountry: Country = null;

  constructor(private signupService: SignupService) { }

  ngOnInit() {
    this.getCountries();
  }

  getCountries() {
    this.signupService
        .getCountries()
        .subscribe(res => {
          this.countries = res;
        });
  }

  onCountrySelect(e: MatSelectChange) {
    const id: number = +e.value;
    this.selectedCountry = this.countries.find(x => +x.id === id);
    this.country.emit(this.selectedCountry);
  }
}
