import { Component, OnInit, Output, EventEmitter, ViewChild, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ReferenceValidators } from '../../shared/validators/file-reference-validator';
import { ModelVersion } from '../models/model-setup.model';
import { ParameterService } from '../../parameters/parameter.service';
import { ParameterSetMeta } from '../../parameters/models/parameter-set';
import { IndexerName, Index } from '../models/indexer';
import { SimulationService } from '../simulation.service';
import { MatStepper } from '@angular/material/stepper';
import { inputFileTypeEnum } from '../../import-data/input-upload/driving-data.model';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { ReachStructure } from '../../import-data/structure-upload/models/ReachStructure';

@Component({
  selector: 'slu-generate-parameter-set',
  templateUrl: './generate-parameter-set.component.html',
  styleUrls: ['./generate-parameter-set.component.scss']
})
export class GenerateParameterSetComponent implements OnInit, AfterViewChecked {

  @ViewChild('stepper', {static: false}) stepper: MatStepper;
  @Output() done = new EventEmitter<any>();

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  maxTimesteps: number;
  minStartDate = moment(null);

  isSaving = false;
  modelVersionId: number;
  parameterSetMeta: ParameterSetMeta;
  indexers: IndexerName[];
  indexes = new Array<Array<Index>>([]);
  isEnoughIndexes = false;
  goToEdit = true;
  hasVariableStepSize = false;
  network: ReachStructure = null;
  newReachStructure: ReachStructure = null;
  isNetworkEdited = false;

  constructor(private validatorService: ReferenceValidators,
              private parameterService: ParameterService,
              private simulationService: SimulationService,
              private changeDetect: ChangeDetectorRef) { }

  ngOnInit() {
    this.createForm();
  }

  ngAfterViewChecked(): void {
    this.changeDetect.detectChanges();
  }

  createForm() {
    this.secondFormGroup = new FormGroup({});
    this.secondFormGroup.addControl('goToEditCheck', new FormControl({value: true, disabled: false}));

    this.firstFormGroup = new FormGroup({
      'reference': new FormControl(
        null, {
        validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(45),
        ],
        asyncValidators: [this.validatorService.referenceValidator(inputFileTypeEnum.PARAMETER)],
        updateOn: 'blur'
      }),
      'startDate': new FormControl(
        this.minStartDate,
        Validators.compose([
          Validators.required
        ]),
      ),
      'startTime': new FormControl(
        '12:00 pm', {
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
      ),
      'stepSize': new FormControl(
        86400,
        Validators.compose([
          Validators.min(1),
        ]),
      )
    }
    );
  }

  get timesteps() { return this.firstFormGroup.controls.timesteps.value; }
  get startDate() { return this.firstFormGroup.controls.startDate.value; }

  getReferenceError() {
    return (
      this.firstFormGroup.controls.reference.hasError('required') ? 'You must enter a reference' :
      this.firstFormGroup.controls.reference.hasError('minlength') ? 'The reference is too short' :
      this.firstFormGroup.controls.reference.hasError('maxlength') ? 'The reference is too long' :
      this.firstFormGroup.controls.reference.hasError('referenceExists') ? 'A setup with this reference already exists' :
      ''
    );
  }

  onPageChange(e: StepperSelectionEvent) {
    if (e.selectedIndex === 4) {
      this.network = new ReachStructure();
      this.network.name = this.firstFormGroup.value.reference;
      this.network.buildDefault(this.indexes[2], this.firstFormGroup.value.reference);
    }
  }

  onModelVersionSelect(version: ModelVersion) {
    this.modelVersionId = +version.id;
    this.hasVariableStepSize = (+version.hasVariableStepSize === 1);
    this.getIndexers();
  }

  onSubmit() {
    this.postParameterSetMeta();
  }

  onStructureChange(structure: ReachStructure) {
    this.newReachStructure = structure;
  }

  postParameterSetMeta() {
    this.isSaving = true;

    const newStartDate = this.firstFormGroup.value.startDate.format('YYYY-MM-DD');
    const newStartTime = this.firstFormGroup.value.startTime;
    const startDate = moment(`${newStartDate} ${newStartTime}`, 'YYYY-MM-DD hh:mm a');

    const postData = {};
    postData['reference'] = this.firstFormGroup.value.reference;
    postData['startDate'] = startDate.format('YYYY-MM-DD HH:mm:ss');
    postData['timesteps'] = this.firstFormGroup.value.timesteps;
    postData['modelVersionId'] = this.modelVersionId;
    postData['indexers'] = this.indexers;
    postData['indexes'] = this.indexes;
    postData['stepSize'] = this.firstFormGroup.value.stepSize;
    postData['structure'] = this.newReachStructure || this.network;

    this.parameterService
        .postMeta(postData)
        .subscribe(parameterSetMeta => {
          this.isSaving = false;
          this.done.emit({meta: parameterSetMeta[0], isEdit: this.secondFormGroup.controls.goToEditCheck.value});
        });
  }

  getIndexers() {
    this.simulationService
        .getModelIndexers(this.modelVersionId)
        .subscribe(indexers => {
          this.indexers = [];
          this.indexes = [];
          for (const indexer of indexers) {
            this.indexers.push(new IndexerName(indexer.name, +indexer.id));
            this.indexes.push(new Array<Index>());
          }
        });
  }

  onIndexListChange(indexes: Index[], i: number) {
    this.indexes[i] = indexes;
    this.isEnoughIndexes = this.checkIndexCount();
  }

  onCancelClick(e) {
    this.done.emit();
  }

  checkIndexCount(): boolean {
    for (const list of this.indexes) {
      if (!list || list.length === 0) {
        return false;
      }
    }

    return true;
  }
}
