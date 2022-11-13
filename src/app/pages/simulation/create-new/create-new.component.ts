import { Component, OnInit, ViewChild, OnDestroy, Input, AfterViewInit } from '@angular/core';
import * as moment from 'moment';
import { SimulationService } from '../simulation.service';
import { FormGroup, Validators, FormControl, NgForm } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ReferenceValidators } from '../../shared/validators/file-reference-validator';
import { ModelSetupValidators } from '../../shared/validators/model-setup-validator';
import { InputFileService } from '../../import-data/input-file.service';
import { InputFileType } from '../../import-data/input-upload/input-type-select/input-type.model';
import { MatExpansionPanel } from '@angular/material/expansion';
import { ParameterSetMeta } from '../../parameters/models/parameter-set';
import { ParameterService } from '../../parameters/parameter.service';
import { Router } from '@angular/router';
import { StreamNetwork } from '../../shared/models/stream-network.model';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'slu-dialog-new-setup-created',
  templateUrl: 'dialog-new-setup-created.html',
})
export class DialogNewSetupCreatedComponent {

  constructor(public dialogRef: MatDialogRef<DialogNewSetupCreatedComponent>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'slu-dialog-generate-parameter-set',
  templateUrl: 'dialog-generate-parameter-set.html',
})
export class DialogGenerateParameterSetComponent {

  constructor(public dialogRef: MatDialogRef<DialogGenerateParameterSetComponent>) {}

  onDone(result: ParameterSetMeta) {
    this.dialogRef.close(result);
  }
}

@Component({
  selector: 'slu-create-new',
  templateUrl: './create-new.component.html',
  styleUrls: ['./create-new.component.scss']
})
export class CreateNewComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('mep', {static: false}) mep: MatExpansionPanel;
  @ViewChild('formDirective', { static: false }) private formDirective: NgForm;

  @Input() generate = false;

  maxTimesteps: number;
  minStartDate = moment(null);
  parameterSetId: number;
  inputFileId: number;
  effluentFileId: number;
  abstractionFileId: number;
  petFileId: number;
  observedFileId: number;
  streamNetworkId: number;
  modelSetupForm: FormGroup;
  runs: any = null;
  isSaving = false;
  optionalFileTypes: InputFileType[];
  referenceId: string = uuid();
  startDateId: string = uuid();
  timestepsId: string = uuid();
  hasDailyStepSize = true;

  constructor(private service: SimulationService,
              private validatorService: ReferenceValidators,
              private modelSetupService: ModelSetupValidators,
              private inputFileSevice: InputFileService,
              private parameterService: ParameterService,
              private router: Router,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    this.createForm();
  }

  ngOnDestroy(): void {
    this.dialog.closeAll();
  }

  ngAfterViewInit(): void {
    if (this.generate) {
      this.onGenerateClick(null);
    }
  }

  createForm() {
    this.modelSetupForm = new FormGroup({
      'reference': new FormControl(
        null, {
        validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(45),
        ],
        asyncValidators: [this.validatorService.referenceValidator(-1)],
        updateOn: 'blur'
      }),
      'startDate': new FormControl(
        this.minStartDate,
        Validators.compose([
          Validators.required
        ]),
      ),
      'startTime': new FormControl(
        null, {
        validators: [
          Validators.required
        ],
      }),
      'timesteps': new FormControl(
        this.maxTimesteps,
        Validators.compose([
          Validators.required,
          Validators.min(1),
        ]),
      )
    }, {validators: null, asyncValidators: this.modelSetupService.modelSetupValidator(), updateOn: 'blur'}
    );
  }

  get timesteps() { return this.modelSetupForm.controls.timesteps.value; }
  get startDate() { return this.modelSetupForm.controls.startDate.value; }

  onParameterSetSelect(parameterSet: any) {
    this.parameterSetId = +parameterSet.id;

    this.hasDailyStepSize = ((parameterSet.stepSize % 86400) === 0);

    this.getOptionalFileTypeInfo();

    this.maxTimesteps = +parameterSet.timesteps;
    this.modelSetupForm.controls.timesteps.setValue(this.maxTimesteps);
    this.modelSetupForm.controls.timesteps.setValidators(Validators.max(this.maxTimesteps));

    this.minStartDate = moment(parameterSet.startDate, 'YYYY-MM-DD HH:mm:ss');
    this.modelSetupForm.controls.startDate.setValue(this.minStartDate);

    this.modelSetupForm.controls.startTime.setValue(this.minStartDate.format('hh:mm a'));
  }

  getOptionalFileTypeInfo() {
    this.inputFileSevice
        .getOptionalFileTypeInfo(this.parameterSetId)
        .subscribe(res => this.optionalFileTypes = res);
  }

  onInputDataSelect(inputData: any) {
    this.inputFileId = +inputData.id;
  }

  setOptionalFileId(event, fileTypeId: number) {
    switch (+fileTypeId) {
      case 2: this.observedFileId = +event.id; break;
      case 3: this.effluentFileId = +event.id; break;
      case 4: this.abstractionFileId = +event.id; break;
      case 6: this.petFileId = +event.id; break;
    }
  }

  setStreamNetwork(streamNetwork: StreamNetwork) {
    this.streamNetworkId = +streamNetwork.id;
  }

  getReferenceError() {
    return (
      this.modelSetupForm.controls.reference.hasError('required') ? 'You must enter a reference' :
      this.modelSetupForm.controls.reference.hasError('minlength') ? 'The reference is too short' :
      this.modelSetupForm.controls.reference.hasError('maxlength') ? 'The reference is too long' :
      this.modelSetupForm.controls.reference.hasError('referenceExists') ? 'A setup with this reference already exists' :
      ''
    );
  }

  getError() {
    return 'This model setup already exists';
  }

  onSubmit() {
    this.isSaving = true;

    const newStartDate = this.modelSetupForm.value.startDate.format('YYYY-MM-DD');
    const newStartTime = this.modelSetupForm.value.startTime;
    const startDate = moment(`${newStartDate} ${newStartTime}`, 'YYYY-MM-DD hh:mm a');

    const postData = {};
    postData['reference'] = this.modelSetupForm.value.reference;
    postData['startDate'] = startDate.format('YYYY-MM-DD HH:mm:ss');
    postData['timesteps'] = this.modelSetupForm.value.timesteps;
    postData['parameterSetId'] = this.parameterSetId;
    postData['inputFileId'] = this.inputFileId;
    postData['effluentFileId'] = this.effluentFileId;
    postData['abstractionFileId'] = this.abstractionFileId;
    postData['petFileId'] = this.petFileId;
    postData['observedFileId'] = this.observedFileId;
    postData['streamNetworkId'] = this.streamNetworkId;

    this.service
        .postModelRun(postData)
        .subscribe(res => {
          this.service.emitNewModelSetup(res);
          this.openDialog();
        });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogNewSetupCreatedComponent, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.resetForm();
    });
  }

  onGenerateClick(e) {
    if (e) {
      e.preventDefault();
    }

    const dialogRef = this.dialog.open(DialogGenerateParameterSetComponent, {
      width: '950px',
      maxHeight: '90vh' // https://stackoverflow.com/questions/49651320/how-to-use-scrollstrategy-in-matdialog
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.parameterService.emitNewParameterSetMeta(result.meta, true);
        if (result.isEdit) {
          this.router.navigate(['/pages/parameters'], { queryParams: { id: result.meta.id } });
        }
      }
    });
  }

  resetForm() {
    this.formDirective.resetForm();

    if (this.mep) { this.mep.close(); }
    this.optionalFileTypes = [];

    this.isSaving = false;
    this.parameterSetId = null;
  }
}
