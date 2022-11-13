import { Component, OnInit, OnDestroy, Inject, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ParameterService } from './parameter.service';
import { FormGroup, FormControl } from '@angular/forms';
import { ParameterSet } from './models/parameter-set';
import { ParameterLayout } from './models/parameter-layout';
import { Subscription } from 'rxjs';
import { ParameterEditFormStatusService } from './parameter-edit-form-status.service';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { SimulationRunComponent } from '../simulation/simulation-run/simulation-run.component';
import { ModelSetupMeta } from '../simulation/models/model-setup.model';

@Component({
  selector: 'slu-dialog-parameter-edit',
  templateUrl: 'dialog-parameter-edit.html',
})
export class DialogParameterEditComponent {

  constructor(public dialogRef: MatDialogRef<DialogParameterEditComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {}
}

@Component({
  selector: 'slu-parameters',
  templateUrl: './parameters.component.html',
  styleUrls: ['./parameters.component.scss']
})
export class ParametersComponent implements OnInit, OnDestroy {

  // Get a reference to the SimulationRun component so we can run the model
  @ViewChild('simulation', { static: false }) simulation: SimulationRunComponent;

  parameterEditForm: FormGroup;
  pars: ParameterSet;
  dialogs: ParameterLayout = null;
  valueChangedSub: Subscription;

  parameterSetId: number;
  modelSetupId: number = null;
  message = '';

  isSaving = false;
  isRunning = false;
  isSaved = true;
  isSetupComplete = false;
  isEditingLocked = true;
  currentTabIndex = 0;

  constructor(private service: ParameterService,
              private statusService: ParameterEditFormStatusService,
              public dialog: MatDialog,
              private route: ActivatedRoute,
              private changeDetect: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.parameterEditForm = new FormGroup({});
    this.parameterEditForm.addControl('notes', new FormControl({value: '', disabled: false}));
    this.parameterEditForm.addControl('linkedEditCheck', new FormControl({value: false, disabled: false}));

    // Subscribe to a service that notifies us if any of the controls in the dynamically-built
    // and -nested parameter edit dialogs has their value updated (i.e. a parameter value was changed).
    this.valueChangedSub = this.statusService.isValueChanged$.subscribe((parameterStatus) => this.onFormUpdate(parameterStatus));

    // See if a model setup ID has been passed to this page as a query param
    this.modelSetupId = +this.route.snapshot.queryParamMap.get('modelSetupId');

    // See if a parameter set ID has been passed to this page as a query param
    this.parameterSetId = +this.route.snapshot.queryParamMap.get('id');

    // If it has, then go ahead and edit the parameter set (skips parameter set selector)
    if (this.parameterSetId) {
      this.getLayout();
    }
  }

  ngOnDestroy() {
    this.valueChangedSub.unsubscribe();
  }

  // Called when the user selects a parameter set in the UI. Begins the build process
  // of the dynamically-generated parameter set edit dialog
  public onParameterSetSelect(parameterSet: any): void {
    this.dialogs = null;
    if (parameterSet) {
      this.parameterSetId = +parameterSet.id;
      this.getLayout();
    }
  }

  // Store the ID of the selected model setup
  public onModelSetupSelect(setup: ModelSetupMeta): void {
    if (setup) {
      this.modelSetupId = +setup.id;

      if (!this.parameterSetId) {
        this.parameterSetId = +setup.parameter_set_id;
        this.getLayout();
      }
    } else {
      this.modelSetupId = null;
    }
  }

  // Called when the parameter set edit form 'Save' button is clicked -
  // sends the updated parameter set to the API for storage in the database
  public onSubmit(): void {
    // Prevent multiple clicks of the 'Save' button
    this.isSaving = true;
    this.parameterEditForm.disable();

    // POST the updated parameter set
    this.service
        .update(this.pars, this.parameterSetId, this.parameterEditForm.controls.notes.value)
        .subscribe(res => {
          // If a model setup ID is stored, then run the model after saving the parameter set
          if (this.modelSetupId) {
            this.isRunning = true;
            this.simulation.onRunClick();
          } else {
            // Otherwise, let the user know that the updated parameter set was stored successfully
            this.openDialog();
          }
        });
  }

  // Catch the 'complete' event from the Simulation Run component
  // (This means that the model run has finished).
  public onRunComplete(isComplete: boolean): void {
    this.isRunning = false;
    this.resetFormStatus();
  }

  public onTabChange(index: number) {
    this.currentTabIndex = index;
    this.setLinkedEditCheckStatus();
  }

  // Called when the ParameterEditFormStatusService notifies us of a parameter value change.
  // This sets the save status of the component, which in turn de/activates the 'Save' button
  private onFormUpdate(parameterStatus: any): void {
    this.isSaved = !(parameterStatus['isChanged'] && this.isSetupComplete);

    if (
        this.parameterEditForm.controls.linkedEditCheck.value
        && parameterStatus['parameter']
        && this.dialogs.get(this.currentTabIndex).isLinkedEditAllowed
      ) {
      this.dialogs.updateAll(parameterStatus['parameter']);
    }
  }

  private setLinkedEditCheckStatus() {
    if (this.dialogs.get(this.currentTabIndex).isLinkedEditAllowed) {
      this.parameterEditForm.controls.linkedEditCheck.enable();
    } else {
      this.parameterEditForm.controls.linkedEditCheck.disable();
    }
  }

  // Fetch from the database the parameter set edit dialog layout info for
  // the correct model version (as described by the parameter set), then fetch the
  // parameter set specified by this.parameterSetId
  private getLayout(): void {
    this.message = 'Fetching parameter set layout...';
    this.service
        .getLayout(null, this.parameterSetId)
        .subscribe(res => {
          const layout = JSON.parse(res[0]['layout']);
          this.getParameterSet(layout);
        });
  }

  // Fetch from the database the parameter set identified by this.parameterSetId.
  // Build the dynamically-generated parameter set edit dialog
  private getParameterSet(layout: any): void {
    this.message = 'Fetching parameter set...';
    this.service
      .getParameterSet(this.parameterSetId, false)
      .subscribe(json => {
        this.isSaved = true;
        this.isSetupComplete = false;

        this.message = 'Building dialogs...';

        // Convert the JSON-format parameter set fetched from the database
        // into a ParameterSet object
        this.pars = ParameterSet.fromJson(JSON.parse(json[0]['json']));

        // Build the dynamically-generated parameter set edit dialog using
        // the fetched parameter set and the previously-fetched layout info
        this.buildInterface(layout);
      });
  }

  // Generate the dialog from the fetched parameter set and layout
  private buildInterface(layout: any): void {
    this.dialogs = new ParameterLayout(this.pars, layout);

    // Reset the form status
    this.isSetupComplete = true;
    this.parameterEditForm.markAsPristine();

    this.message = null;

    this.setLinkedEditCheckStatus();
  }

  // Reset the status of the parameter set edit form
  private resetFormStatus(): void {
      this.isSaved = true;
      this.isSaving = false;
      this.parameterEditForm.controls.notes.patchValue('');
      this.statusService.saved(true);
      this.parameterEditForm.enable();
  }

  // Open an Angular Material modal that lets the user know if the parameter set
  // was successfully saved or not.
  // TODO: convert this to a bottom sheet or a snackbar
  private openDialog(wasImported: boolean = true): void {
    const dialogRef = this.dialog.open(DialogParameterEditComponent, {
      width: '350px',
      data: { success: wasImported },
    });

    dialogRef.afterClosed().subscribe(result => {
      this.resetFormStatus();
    });
  }
}
