import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { PrimaryRole } from '../signup.model';
import { SignupService } from '../signup.service';

@Component({
  selector: 'slu-primary-role-select',
  templateUrl: './primary-role-select.component.html',
  styleUrls: ['./primary-role-select.component.scss']
})
export class PrimaryRoleSelectComponent implements OnInit {

  @Input() required = false;
  @Output() primaryRole = new EventEmitter<PrimaryRole>();

  primaryRoles: PrimaryRole[] = null;
  selectedPrimaryRole: PrimaryRole = null;

  constructor(private signupService: SignupService) { }

  ngOnInit() {
    this.getPrimaryRoles();
  }

  getPrimaryRoles() {
    this.signupService
        .getPrimaryRoles()
        .subscribe(res => {
          this.primaryRoles = res;
        });
  }

  onPrimaryRoleSelect(e: MatSelectChange) {
    const id: number = +e.value;
    this.selectedPrimaryRole = this.primaryRoles.find(x => +x.id === id);
    this.primaryRole.emit(this.selectedPrimaryRole);
  }
}
