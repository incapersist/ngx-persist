import { Component, OnInit, Input, SimpleChanges, OnChanges, Inject, EventEmitter, Output } from '@angular/core';
import { StreamNetwork } from '../../../models/stream-network.model';
import { ParameterService } from 'src/app/pages/parameters/parameter.service';
import { Stream, Reach } from 'src/app/pages/import-data/structure-upload/models/Stream';
import { ReachStructure } from 'src/app/pages/import-data/structure-upload/models/ReachStructure';
import { Subject } from 'rxjs/internal/Subject';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { StreamNetworkDownload } from 'src/app/pages/export-data/stream-network-download/stream-network-download';
import { SimulationService } from 'src/app/pages/simulation/simulation.service';

export interface NodeData {
  id: string;
  index_id: number;
  label: string;
  reach: Reach;
  stream: Stream;
  width: number;
  height: number;
}

export interface EdgeData {
  id: string;
  index_id: number;
  source: string;
  target: string;
  upstreamReach: Reach;
}

export interface GraphStructure {
  nodes: NodeData[];
  edges: EdgeData[];
}

@Component({
  selector: 'slu-confirm-upstream-node-delete',
  templateUrl: './dialogs/dialog-confirm-upstream-node-delete.html',
})
export class DialogConfirmUpstreamNodeDeleteComponent {

  constructor(public dialogRef: MatDialogRef<DialogConfirmUpstreamNodeDeleteComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'slu-stream-network-graph',
  templateUrl: './stream-network-graph.component.html',
  styleUrls: ['./stream-network-graph.component.scss']
})
export class StreamNetworkGraphComponent implements OnInit, OnChanges {

  @Input() originalStructure: ReachStructure = null;
  @Input() parentForm: FormGroup;

  @Output() structure = new EventEmitter<ReachStructure>();
  @Output() editStatus = new EventEmitter<boolean>();

  currentStructure: GraphStructure = null;
  availableReachList: Reach[] = [];
  unconnectedNodeList: NodeData[] = [];
  deleteReachList: Reach[];
  existingStreamNames: Set<string> = new Set<string>();
  isEdited = false;

  zoomToFit$: Subject<boolean> = new Subject();
  update$: Subject<boolean> = new Subject();
  center$: Subject<boolean> = new Subject();
  autoZoom = true;

  private boxHeight = 25;
  private boxWidth = 75;

  constructor(private service: ParameterService,
              private simulationService: SimulationService,
              public dialog: MatDialog) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['originalStructure'] && changes['originalStructure'].currentValue) {
      this.currentStructure = this.buildGraph();
      this.availableReachList = [];
    }
  }

  ngOnInit() {
    this.parentForm.addControl('saveButton', new FormControl({disabled: true}));

    this.getExistingStreamIndexes();
  }

  fitGraph() {
    this.zoomToFit$.next(true);
  }

  updateGraph() {
    this.update$.next(true);
  }

  centerGraph() {
    this.center$.next(true);
  }

  getExistingStreamIndexes() {
    this.simulationService
        .getIndexes(null, 4)
        .subscribe(res => {
          this.existingStreamNames = new Set(res.map(index => index.reference));
        });
  }

  // Add a new node to the network.
  // Called when an event is emitted from AddReachNodeComponent
  onAddNode(selection: any) {
    // Check that the reach name sent from AddReachNodeComponent is available to add
    const reachToAdd = this.availableReachList.find(x => x.name === selection.add.name);
    if (reachToAdd) {
      reachToAdd.inputs = [];

      // If the user chose a downstream reach to connect this added reach to...
      if (selection.downstream) {
        // Add the connection
        this.addReachAsEdge(this.currentStructure.edges, selection.downstream, reachToAdd);
      }

      // Now we can add the reach to the current stream network
      this.addReachAsNode(this.currentStructure.nodes, reachToAdd, selection.stream);

      // The added reach is no longer available to add, so remove it from the list...
      this.availableReachList = this.availableReachList.filter(x => x.id !== reachToAdd.id);
      // and add it to the list of nodes that can be removed from the structure
      this.deleteReachList.push(reachToAdd);

      // If the user chose to connect the new node to an upstream reach...
      if (selection.upstream) {
        // If the new node's upstream reach was already connected to a downstream node,
        // remove that connection
        this.currentStructure.edges = this.currentStructure.edges.filter(x => x.target !== selection.upstream.name.replace(/ /g, '_'));
        // And add the new connection
        this.addReachAsEdge(this.currentStructure.edges, reachToAdd, selection.upstream);
      }

      this.checkConnections();

      // Finally, force the graph to update
      this.update$.next(true);

      if (this.isEdited && this.availableReachList.length === 0) {
        const structure = this.buildNewStructure();
        this.structure.emit(structure);
      }
    }
  }

  // Add the supplied reach to the supplied node structure
  addReachAsNode(nodes: NodeData[], reach: Reach, stream: Stream = null) {
    // If no stream name was supplied, try to find the reach in the original structure
    // and use the stream name from there
    if (!stream && this.originalStructure) {
      stream = this.originalStructure.findStreamByReachName(reach.name);
    }

    nodes.push({
      'id': reach.id ? reach.id.replace(/ /g, '_') : null,
      'index_id': reach.index_id,
      'label': reach.name,
      'reach': reach,
      'stream': stream,
      'width': this.boxWidth,
      'height': this.boxHeight
    });
  }

  addReachAsEdge(edges: EdgeData[], source: Reach, target: Reach) {
    edges.push({
      'id': source ? source.id.replace(/ /g, '_') : null,
      'index_id': target.index_id,
      'source': source.name.replace(/ /g, '_'),
      'target': target ? target.name.replace(/ /g, '_') : null,
      'upstreamReach': target,
    });
  }

  onRemoveNode(reach: Reach) {
    // Check if this reach has inputs
    const hasUpstream = this.currentStructure.edges.find(x => x.source === reach.name.replace(/ /g, '_'));
    if (hasUpstream) {
      this.openDeleteConfirmDialog(reach);
    } else {
      this.removeReach(reach);
    }

    this.parentForm.controls['removeNodeSelect'].patchValue({});
    this.setEditStatus(true);

    this.checkConnections();
  }

  setEditStatus(isEdited: boolean) {
    this.isEdited = isEdited;
    this.editStatus.emit(this.isEdited);
  }

  removeReach(reach: Reach) {
    const inputs = this.currentStructure.edges.filter(edge => edge.source === reach.name.replace(/ /g, '_'));
    for (const input of inputs) {
      this.removeReach(input.upstreamReach);
    }

    this.currentStructure.edges = this.currentStructure.edges.filter(edge => edge.target !== reach.name.replace(/ /g, '_'));
    this.currentStructure.edges = this.currentStructure.edges.filter(edge => edge.source !== reach.name.replace(/ /g, '_'));
    this.currentStructure.nodes = this.currentStructure.nodes.filter(node => node.reach.name !== reach.name);

    this.availableReachList.push(reach);
    this.deleteReachList = this.deleteReachList.filter(x => x.name !== reach.name);
  }

  openDeleteConfirmDialog(reach: Reach): void {
    const dialogRef = this.dialog.open(DialogConfirmUpstreamNodeDeleteComponent, {
      width: '350px',
      data: {reach}
    });

    dialogRef.afterClosed().subscribe(isDeleteConfirmed => {
      if (isDeleteConfirmed) {
          this.removeReach(reach);
      }
    });
  }

  buildGraph(isDefault: boolean = false): GraphStructure {
    const nodes: NodeData[] = [];
    const edges: EdgeData[] = [];

    this.deleteReachList = [];
    let lastReach: Reach = null;

    const streams = this.originalStructure.streams.map(x => Object.assign(new Stream, x));
    streams.sort((a, b) => (b.order - a.order));

    for (const stream of streams) {
      for (const reach of stream.reaches) {
        this.addReachAsNode(nodes, reach, stream);

        if (isDefault) {
          if (lastReach) {
            this.addReachAsEdge(edges, reach, lastReach);
          }
        } else {
          for (const input of reach.inputs) {
            const inputReach = this.originalStructure.findReachbyName(input['reference'] || input['_id']);
            this.addReachAsEdge(edges, reach, inputReach);
          }
        }

        this.deleteReachList.push(reach);
        lastReach = reach;
      }
    }

    return { nodes, edges };
  }

  resetToOriginal() {
    this.currentStructure = this.buildGraph();
    this.fitGraph();
    this.setEditStatus(false);
  }

  resetToDefault() {
    this.currentStructure = this.buildGraph(true);
    this.fitGraph();
    this.setEditStatus(true);
  }

  resetGraph() {
    this.availableReachList = [];
    this.deleteReachList = [];
    this.unconnectedNodeList = [];

    this.currentStructure = {'nodes': [], 'edges': []};
    this.existingStreamNames = new Set(this.existingStreamNames);

    for (const stream of this.originalStructure.streams) {
      for (const reach of stream.reaches) {
        this.availableReachList.push(reach);
      }
    }

    this.setEditStatus(true);
    this.structure.emit(null);
  }

  checkConnections() {
    const edgeTargets = this.currentStructure.edges.map(edge => edge.target);
    const edgeSources = this.currentStructure.edges.map(edge => edge.source);
    const edgeReaches = new Set(edgeTargets.concat(edgeSources));

    this.unconnectedNodeList = this.currentStructure.nodes.filter(node => !edgeReaches.has(node.id));
  }

  saveNetwork() {
    const structure = this.buildNewStructure();

 //   structure.parameterSetId = this.streamNetworkMeta.parameterSetId;

    this.service
        .postStreamNetwork(structure)
        .subscribe(res => {
          const psd = new StreamNetworkDownload();
          psd.downloadFile(structure.toFileString(), structure.name);
        });
   }

  buildNewStructure(): ReachStructure {
    const structure = new ReachStructure();
    structure.name = this.originalStructure.name + '_generated';
    structure.id = this.originalStructure.id;

    // Create a Set of streams in the structure
    const streams = Array.from(new Set(this.currentStructure.nodes.map(node => node.stream)));

    for (const s of streams) {
      const stream = new Stream();
      stream.name = s.name;

      // Make an array of reaches in the current stream
      const reaches = this.currentStructure.nodes.filter(node => node.stream.name === stream.name).map(node => node.reach);

      for (const reach of reaches) {
        // Extract names of reaches that are inputs to this reach, from the edges array 'target' attribute
        reach.inputs = this.currentStructure.edges.filter(edge => edge.source === reach.name)
                                                  .map(edge => ({_index_id: edge.index_id, reference: edge.target}));
        stream.addReach(reach);
      }

      structure.addStream(stream);
    }

    this.calculateStreamOrder(structure);

    return structure;
  }

  calculateStreamOrder(structure: ReachStructure) {
    // Find the outflow reach. As the outflow reach will have no downstream reach,
    // there will be no edge that has the outflow reach as a target.
    //
    // First, get a Set of edges
    const targets = new Set(this.currentStructure.edges.map(edge => edge.target));
    // And a Set of reaches
    const reaches = new Set(this.currentStructure.nodes.map(node => node.reach.name));
    // The outflow reach should be the difference between these two Sets
    const outflow = Array.from(new Set([...reaches].filter(x => !targets.has(x))));

    if (outflow.length !== 1) {
      // ERROR
    } else {
      for (const s of structure.streams) {
        s.order = -1;
      }

      const stream = structure.findStreamByReachName(outflow[0]);
      this.setStreamOrder(structure, stream, 0);
    }

    // https://stackoverflow.com/questions/34749987/how-do-i-use-math-max-with-an-array-of-objects
    const maxOrder = Math.max.apply(Math, structure.streams.map(s => s.order));
    structure.streams.forEach(stream => stream.order = (maxOrder - stream.order));
  }

  setStreamOrder(structure: ReachStructure, stream: Stream, order: number) {
    stream.order = order;

    for (const reach of stream.reaches) {
      for (const input of reach.inputs) {
        const s = structure.findStreamByReachName(input['reference']);
        if (s.name !== stream.name) {
          this.setStreamOrder(structure, s, (order + 1));
        }
      }
    }
  }
}
