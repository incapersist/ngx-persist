import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { Reach, Stream } from 'src/app/pages/import-data/structure-upload/models/Stream';
import { ReachStructure } from 'src/app/pages/import-data/structure-upload/models/ReachStructure';
import { GraphStructure } from '../stream-network-graph.component';
import { MatCheckboxChange } from '@angular/material/checkbox';

export function ValidateStream(existingStreamNames: Set<string>): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (existingStreamNames.has(control.value)) {
      return { streamNameExists: true };
    }
    return null;
  };
}

@Component({
  selector: 'slu-add-reach-node',
  templateUrl: './add-reach-node.component.html',
  styleUrls: ['./add-reach-node.component.scss']
})
export class AddReachNodeComponent implements OnInit, OnChanges {

  @Input() parentForm: FormGroup;
  @Input() availableReaches: Reach[];
  @Input() originalStructure: ReachStructure;
  @Input() currentStructure: GraphStructure;
  @Input() databaseStreamNames: Set<string>;

  @Output() selection = new EventEmitter<any>();

  upstreamReaches: Reach[];
  downstreamReaches: Reach[];
  usedStreams: Stream[];

  existingStreamNames: Set<string> = new Set<string>();

  addReach: Reach = null;
  upstreamReach: Reach = null;
  downstreamReach: Reach = null;
  isNewStream = false;
  forceStream = false;

  latitude: number = undefined;
  longitude: number = undefined;

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['nodes'] && changes['nodes'].currentValue) {
      if (this.originalStructure) {
        this.usedStreams = Array.from(new Set(this.currentStructure.nodes.map(x => x.stream).concat(this.originalStructure.streams)));
      } else {
        this.usedStreams = Array.from(new Set(this.currentStructure.nodes.map(x => x.stream)));
      }
    }

    if (changes['databaseStreamNames']) {
      this.existingStreamNames.clear();
    }

    this.reset();
  }

  ngOnInit() {
    this.formSetup();
  }

  reset() {
    this.upstreamReaches = [];
    this.downstreamReaches = [];

    this.addReach = null;
    this.upstreamReach = null;
    this.downstreamReach = null;
    this.isNewStream = false;
    this.forceStream = false;

    for (const name of this.databaseStreamNames) {
      this.existingStreamNames.add(name);
    }

     if (this.parentForm) {
      if (this.parentForm.contains('newStreamName')) { this.parentForm.controls['newStreamName'].patchValue({}); }
      if (this.parentForm.contains('addNodeSelect')) { this.parentForm.controls['addNodeSelect'].patchValue({}); }
      if (this.parentForm.contains('downstreamSelect')) { this.parentForm.controls['downstreamSelect'].patchValue({}); }
      if (this.parentForm.contains('upstreamSelect')) { this.parentForm.controls['upstreamSelect'].patchValue({}); }
      if (this.parentForm.contains('newStreamCheck')) {
        this.parentForm.controls['newStreamCheck'].patchValue({});
        this.parentForm.controls.newStreamCheck.disable();
      }
    }

    this.parentForm.reset();
    this.parentForm.updateValueAndValidity();
  }

  formSetup() {
    this.parentForm.removeControl('newStreamName');
    this.parentForm.addControl('newStreamName', new FormControl({
        value: '',
        disabled: true
      },
      {
        validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(45),
          ValidateStream(this.existingStreamNames)
        ],
      }));

    this.parentForm.removeControl('newStreamCheck');
    this.parentForm.addControl('newStreamCheck', new FormControl({value: false, disabled: true}));

    this.parentForm.removeControl('latitude');
    this.parentForm.addControl('latitude', new FormControl(''));

    this.parentForm.removeControl('longitude');
    this.parentForm.addControl('longitude', new FormControl(''));
  }

  onReachSelect(reach: Reach) {
    if (reach) {
      this.upstreamReaches = this.currentStructure.nodes.map(x => x.reach).filter(x => x.name !== reach.name.replace(/ /g, '_'));
      this.downstreamReaches = this.currentStructure.nodes.map(x => x.reach).filter(x => x.name !== reach.name.replace(/ /g, '_'));

      this.addReach = reach;
    } else {
      this.addReach = null;
    }

    this.resetStreamControls();
  }

  resetStreamControls() {
    if (this.addReach) {
      this.parentForm.controls.newStreamCheck.enable();
      this.parentForm.controls.latitude.patchValue(this.addReach.lower_latitude);
      this.parentForm.controls.longitude.patchValue(this.addReach.lower_longitude);
    } else {
      this.parentForm.controls.newStreamCheck.disable();
      this.parentForm.controls.latitude.patchValue({});
      this.parentForm.controls.longitude.patchValue({});
    }

    this.parentForm.controls.newStreamCheck.patchValue(false);
    this.parentForm.controls.newStreamName.patchValue('');
    this.parentForm.controls.newStreamName.markAsUntouched();

    this.forceNewStream(this.currentStructure.nodes.length === 0);
  }

  onUpstreamReachSelect(reach: Reach) {
    this.upstreamReach = reach;
  }

  onDownstreamReachSelect(reach: Reach) {

    if (reach) {
      if (this.currentStructure) {
        this.upstreamReaches = this.currentStructure.edges
                                  .filter(edge => edge.source === reach.name.replace(/ /g, '_')).map(edge => edge.upstreamReach);
      }

      this.upstreamReaches = this.upstreamReaches.filter(x => x.id !== reach.id);

      const needsNewStream = (this.upstreamReaches.length > 0 && !this.upstreamReach);
      this.forceNewStream(needsNewStream);

      this.downstreamReach = reach;
    } else {
      this.downstreamReach = null;
    }
  }

  forceNewStream(shouldForce: boolean) {
    this.forceStream = shouldForce;

    if (shouldForce) {
      this.parentForm.controls.newStreamCheck.patchValue(true);
      this.parentForm.controls.newStreamCheck.disable();
      this.parentForm.controls.newStreamName.enable();
      this.isNewStream = true;
    } else {
      this.parentForm.controls.newStreamCheck.patchValue(false);
      this.parentForm.controls.newStreamCheck.enable();
      this.parentForm.controls.newStreamName.disable();
      this.isNewStream = false;
    }
  }

  onAddReach() {
    this.upstreamReaches = [];
    this.downstreamReaches = [];
  }

  onAddClick() {
    let stream: Stream = null;

    if (this.isNewStream) {
      stream = new Stream();
      stream.name = this.parentForm.controls['newStreamName'].value;
      this.existingStreamNames.add(stream.name);
    } else {
      if (this.downstreamReach) {
        stream = this.currentStructure.nodes.find(node => node.id === this.downstreamReach.id.replace(/ /g, '_')).stream;
      }
    }

    this.addReach.lower_latitude = +this.parentForm.controls.latitude.value;
    this.addReach.lower_longitude = +this.parentForm.controls.longitude.value;

    this.selection.emit({
      'add': this.addReach,
      'downstream': this.downstreamReach,
      'upstream': this.upstreamReach,
      'isNewStream': this.isNewStream,
      'stream': stream,
    });

    this.reset();
  }

  onCheckChange(e: MatCheckboxChange) {
    this.isNewStream = e.checked;

    if (e.checked) {
      this.parentForm.controls.newStreamName.enable();
    } else {
      this.parentForm.controls.newStreamName.disable();
    }
  }

  isAddButtonDisabled(): boolean {
    if (!this.addReach) { return true; }
    if (this.parentForm.controls.newStreamName.invalid) { return true; }
    if (this.currentStructure.nodes.length > 0 && !this.downstreamReach) { return true; }

    return false;
  }

  getStreamNameError() {
    return (
      this.parentForm.controls.newStreamName.hasError('required') ? 'You must enter a stream name' :
      this.parentForm.controls.newStreamName.hasError('minlength') ? 'The stream name is too short' :
      this.parentForm.controls.newStreamName.hasError('maxlength') ? 'The stream name is too long' :
      this.parentForm.controls.newStreamName.hasError('streamNameExists') ? 'A stream with this name already exists' :
      ''
    );
  }
}
