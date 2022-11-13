import { Component, OnInit, Inject, ViewEncapsulation, ChangeDetectionStrategy, ViewChild, AfterViewInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder, NgForm} from '@angular/forms';
import { SignupService } from './signup.service';
import { Signup, Country, PrimaryRole } from './signup.model';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatPasswordStrengthComponent } from '@angular-material-extensions/password-strength';

@Component({
  selector: 'slu-dialog-signup',
  templateUrl: 'dialog-signup.html',
})
export class DialogSignupComponent {
  constructor(public dialogRef: MatDialogRef<DialogSignupComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {}
}

@Component({
  selector: 'slu-dialog-terms-conditions',
  templateUrl: 'dialog-terms-conditions.html',
})
export class DialogTermsAndConditionsComponent {

  constructor(public dialogRef: MatDialogRef<DialogTermsAndConditionsComponent>) {}
}

@Component({
  selector: 'slu-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignupComponent implements OnInit, AfterViewInit {

  @ViewChild('passwordComponent', {static: false}) passwordComponent: MatPasswordStrengthComponent;
  @ViewChild('formDirective', {static: false}) private formDirective: NgForm;

  registrationForm: FormGroup;
  isUploading = false;
  agreeTandC = false;
  country: Country;
  primaryRole: PrimaryRole;

  constructor(private fb: FormBuilder,
              private signupService: SignupService,
              public dialog: MatDialog,
              public router: Router) { }

  ngOnInit() {

    this.registrationForm = this.fb.group({
      'name': [
        null,
        Validators.compose([
          Validators.required,
        ]),
      ],
      'email': [
        null,
        Validators.compose([
          Validators.required,
          Validators.email
        ]),
      ],
      'reason': [
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(255),
        ]),
      ],
      'agreement': [false, Validators.pattern('true')],
    });
  }

  ngAfterViewInit() {
    // child is set
    this.registrationForm.addControl('password', this.passwordComponent.passwordFormControl);
    this.registrationForm.addControl('confirm', this.passwordComponent.passwordConfirmationFormControl);
    this.registrationForm.setValidators(this.checkPasswords);
  }

  onCountrySelect(country: Country) {
    this.country = country;
  }

  onPrimaryRoleSelect(primaryRole: PrimaryRole) {
    this.primaryRole = primaryRole;
  }

  onTermsClick(e) {
    const dialogRef = this.dialog.open(DialogTermsAndConditionsComponent, {
      width: '400px'
    });

    return false;
  }

  checkPasswords(group: FormGroup) {
    const password = group.controls.password.value;
    const confirmPassword = group.controls.confirm.value;

    return password === confirmPassword ? null : { notSame: true };
  }

  getNameError() {
    return this.registrationForm.controls.name.hasError('required') ? 'You must enter your name' :
            '';
  }

  getEmailError() {
    return this.registrationForm.controls.email.hasError('required') ? 'You must enter a valid email address' :
        this.registrationForm.controls.email.hasError('email') ? 'Not a valid email address' :
            '';
  }

  getCompanyError() {
    return this.registrationForm.controls.company.hasError('required') ? 'You must enter your company name' :
            '';
  }

  getReasonError() {
    return (
      this.registrationForm.controls.reason.hasError('required') ? 'You must enter an intended use' :
      this.registrationForm.controls.reason.hasError('minlength') ? 'The explanation is too short' :
      this.registrationForm.controls.reason.hasError('maxlength') ? 'The explanation is too long' :
      ''
    );
  }

  onSubmit() {
    this.isUploading = true;

    const signup: Signup = {
      'name': this.registrationForm.value.name,
      'email': this.registrationForm.value.email,
      'password': this.registrationForm.value.password,
      'country': this.country.name,
      'reason': this.registrationForm.value.reason,
      'signupRole': this.primaryRole.name,
      'userRole': 'User',
      'status': 'PENDING',
    };

    this.signupService
        .auth0Signup(signup)
        .subscribe(auth0Res => {
            this.populateBackend(auth0Res);
          },
          err => {
            if (err.error.code === 'user_exists') {
              this.openDialog(0);
            }
          }
        );
  }

  populateBackend(auth0Res) {
    this.signupService
        .register(auth0Res)
        .subscribe(res => {
          this.openDialog(res);
        });
  }

  openDialog(statusCode: any): void {
    const dialogRef = this.dialog.open(DialogSignupComponent, {
      width: '350px',
      data: { statusCode: statusCode },
    });

    dialogRef.afterClosed().subscribe(result => {
      this.resetForm();
    });
  }

  resetForm() {
    this.formDirective.resetForm();
    this.isUploading = false;
    this.router.navigate(['/home']);
  }
}
