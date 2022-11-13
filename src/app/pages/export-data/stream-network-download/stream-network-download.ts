import { ParameterService } from '../../parameters/parameter.service';
import { ReachStructure } from '../../import-data/structure-upload/models/ReachStructure';

export class StreamNetworkDownload {

  constructor(private service: ParameterService = null) { }

  download(id: number, reference: string) {
    this.service
      .getStreamNetwork(id)
      .subscribe(res => {
        const structure = new ReachStructure(res[0]['json']);
        this.downloadFile(structure.toFileString(), reference);
      });
  }

  // https://stackoverflow.com/questions/52154874/angular-6-downloading-file-from-rest-api
  downloadFile(fileString: string, networkReference: string) {
    const blob = new Blob([fileString], { type: 'text/plain' });
    const data = window.URL.createObjectURL(blob);
    const link = document.createElement('a');

    let filename = networkReference;
    const ext = filename.split('.').pop();
    if (ext !== 'ssf') {
      filename += '.ssf';
    }

    link.href = data;
    link.download = filename;
    // this is necessary as link.click() does not work on the latest firefox
    link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));

    setTimeout(function () {
        // For Firefox it is necessary to delay revoking the ObjectURL
        window.URL.revokeObjectURL(data);
        link.remove();
    }, 100);
  }
}
