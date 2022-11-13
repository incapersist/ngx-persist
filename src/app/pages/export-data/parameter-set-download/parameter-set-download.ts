import { js2xml } from 'xml-js';
import { ParameterService } from '../../parameters/parameter.service';
import { XML_OPTIONS } from 'src/app/app.constants';

export class ParameterSetDownload {

  constructor(private service: ParameterService) { }

  download(id: number, reference: string) {
    this.service
      .getParameterSet(id)
      .subscribe(res => {
        const object = JSON.parse(res[0]['json']);
        const parset = js2xml(object, XML_OPTIONS);

        this.downloadFile(parset, reference);
      });
  }

  // https://stackoverflow.com/questions/52154874/angular-6-downloading-file-from-rest-api
  downloadFile(xml: string, parameterSetReference: string) {
    const blob = new Blob([xml], { type: 'text/xml' });
    const data = window.URL.createObjectURL(blob);
    const link = document.createElement('a');

    let filename = parameterSetReference;
    const ext = filename.split('.').pop();
    if (ext !== 'xml') {
      filename += '.xml';
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
