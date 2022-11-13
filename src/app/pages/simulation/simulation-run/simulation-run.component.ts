import { Component, OnInit, OnDestroy, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { SimulationService } from '../simulation.service';
import { Subscription } from 'rxjs';
import { ProgressAnimationEnd } from '@angular/material/progress-bar';
import { ResultsService } from '../../results/results.service';
import { Router } from '@angular/router';
import { ModelSetupMeta } from '../models/model-setup.model';

/**
 * Component that allows the user to run a model, after selecting a model setup and
 * (optionally) a results output size.
 *
 * The template includes dropdowns for model setup selection, results output size selection and,
 * if not in compact mode {isCompact}, a 'Run' button and a checkbox which optionally redirects
 * to the parameter edit page after the model run is complete.
 *
 * Shows text messages and run/results storage progress bars.
 */
@Component({
  selector: 'slu-simulation-run',
  templateUrl: './simulation-run.component.html',
  styleUrls: ['./simulation-run.component.scss']
})
export class SimulationRunComponent implements OnInit, OnDestroy, OnChanges {

  // If this is non-null, auto-select this model setup in the dropdown
  @Input() modelSetupId: number = null;
  // If this is non-null, in the model setup dropdown, only show model setups
  // that include this parameter set ID
  @Input() parameterSetId: number = null;
  // Whether to display the whole component or not
  @Input() isCompact = false;
  // Whether to show a 'none' option in the model setup dropdown
  @Input() showNoneOption = false;

  // Emits a selected model setup ID
  @Output() selected = new EventEmitter<number>();
  // Send a notification when the model run is complete
  @Output() complete = new EventEmitter<boolean>();
  // Distribute a selected model setup
  @Output() setup = new EventEmitter<ModelSetupMeta>();

  message = '';
  runId: number = null;
  showChart = false;
  outputSize = 'small';
  isRunning = false;
  showPerformanceStatistics = false;
  goToEdit = true;
  hasObserved = false;
  modelSetupCount = 0;

  // For model run progress polling
  private runProgressSub: Subscription;
  runProgress: number;
  showRunProgress = false;

  // For model results storage progress polling
  private saveProgressSub: Subscription;
  saveProgress: number;
  showSaveProgress = false;

  // For model results storage progress polling
  private archiveProgressSub: Subscription;
  archiveProgress: number;
  showArchiveProgress = false;

  constructor(private simulationService: SimulationService,
              private resultsService: ResultsService,
              private router: Router) {}

  ngOnInit() {
    // Subscribe to model run progress polling observable
    // When the API reports that model run progress has changesd store the progress percentage
    this.runProgressSub = this.simulationService.runProgressSubject.subscribe(progress => this.runProgress = progress);
    // Subscribe to results storage progress polling observable
    // When the API reports that the results storage progress has changed, store the progress percentage
    this.saveProgressSub = this.simulationService.saveProgressSubject.subscribe(progress => this.saveProgress = progress);
    // Subscribe to results archive storage progress polling observable
    // When the API reports that the results archive storage progress has changed, store the progress percentage
    this.archiveProgressSub = this.simulationService.archiveProgressSubject.subscribe(progress => this.archiveProgress = progress);
  }

  ngOnDestroy() {
    this.runProgressSub.unsubscribe();
    this.saveProgressSub.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['modelSetupId']) {
      this.onRunSetupIdSelect(this.modelSetupId);
    }
  }

  /**
   * Begin the model run
   */
  public onRunClick(): void {
    if (this.runId) {
      // Disables the 'Run' button to prevent multiple clicks
      this.isRunning = true;

      // Get started
      this.initializeModelRun();
    }
  }

  /**
   * Called when the user selects a model setup
   * @param run The model setup that was chosen
   */
  public onRunSetupSelect(run: ModelSetupMeta): void {
    if (run) {
      this.hasObserved = run.observed_input_file_id ? true : false;
      this.onRunSetupIdSelect(+run.id);
      this.setup.emit(run);
    } else {
      this.setup.emit(null);
      this.hasObserved = false;
    }
  }

  onModelSetupCount(count: number) {
    this.modelSetupCount = +count;
  }

  /**
   * Called when the user selects a model setup by ID
   * @param runId The ID of the model setup that was selected
   */
  public onRunSetupIdSelect(runId: number): void {
    this.runId = runId;
    this.message = '';
    this.selected.emit(this.runId);
  }

  /**
   * Called when the user selects a results output size
   * @param size The name of the model results output size that was selected
   */
  public onOutputSizeSelect(size: string): void {
    this.outputSize = size;
  }

  /**
   * Called when the performance statistics bottom sheet is closed
   */
  public onClosed() {
    this.showPerformanceStatistics = false;
    // If the user checked the box to edit parameters after running, go there now
    if (this.goToEdit) {
      this.router.navigate(['/pages/parameters'], { queryParams: { modelSetupId: this.runId } });
    }
  }

  /**
   * Called when the Angular Material model run progress bar has completed its animation
   * @param e The event from MatProgressBar
   */
  public onRunProgressAnimationEnd(e: ProgressAnimationEnd): void {
    // If the model run is completed...
    if (this.runProgress > 99) {
      // Hide the model run progress bar
      this.showRunProgress = false;
      // Let the user know what's happening
      this.message = 'Storing results...';
      // Stop polling the API for model run progress
      this.simulationService.stopRunProgressPolling();

      // Show the results storage progress bar
      this.saveProgress = 0;
      this.showSaveProgress = true;
      // Begin polling the API for results storgage progress
      this.simulationService.startSaveProgressPolling(this.runId);
    }
  }

  /**
   * Called when the Angular Material results storage progress bas has completed its animation
   * @param e The event from MatProgressBar
   */
  public onSaveProgressAnimationEnd(e: ProgressAnimationEnd): void {
    // If the results storage is completed...
    if (this.saveProgress > 99) {
      // Hide the results storage progress bar
      this.showSaveProgress = false;
      // Let the user know
      this.message = 'Model run complete';
    }
  }

  // The model run is started from here
  private initializeModelRun(): void {
    // First, delete any existing results for this model setup
    this.message = 'Archiving previous results...';
    // Begin polling the API for previous result archive progress
    this.archiveProgress = 0;
    this.showArchiveProgress = true;
    this.simulationService.startArchiveProgressPolling(this.runId);

    this.resultsService
        .deleteResultsSet(this.runId)
        .subscribe(res => {
          this.showArchiveProgress = false;
          this.simulationService.stopArchiveProgressPolling();
          // ...then actually run the model
          this.startModelRun();
        });
  }

  private startModelRun(): void {
    this.message = 'Running model...';

    // Show the model run progress bar
    this.runProgress = 0;
    this.showRunProgress = true;
    // Begin polling the API for model run progress
    this.simulationService.startRunProgressPolling(this.runId);

    // Tell the API to run the model using the selected model setup
    this.simulationService
        .run(this.runId, this.outputSize)
        .subscribe(
          (success: number) => this.runComplete(),
          () => this.isRunning = false
        );
  }

  // Do this when the model run has finished
  private runComplete(): void {
    this.isRunning = false;
    this.complete.emit(true);
    this.showPerformanceStatistics = this.hasObserved;
    // Stop polling the API for results storage progress
    this.simulationService.stopSaveProgressPolling();
    this.simulationService.runComplete(this.runId);

    // If the user checked the box to edit parameters after running, go there now
    if (this.goToEdit) {
      this.router.navigate(['/pages/parameters'], { queryParams: { modelSetupId: this.runId } });
    }
  }
}
