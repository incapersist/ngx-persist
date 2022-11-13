import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'slu-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {

  @ViewChild('inputFile', { static: true }) inputFile: ElementRef;

  @Input() parentForm: FormGroup;
  @Input() extension = '*';
  @Input() label = 'Choose file';
  @Input() allowMultiple = false;
  @Input() errorMessage = 'You must select a file to upload';

  @Output() contents = new EventEmitter<any>();

  fileSelectorId: string = uuid();
  fileInputId: string = uuid();

  constructor() {
  }

  ngOnInit() {
    this.parentForm.addControl('filename', new FormControl('', Validators.required));
  }

  reset() {
    this.inputFile.nativeElement.value = '';
  }

  bringFileSelector(): boolean {
    this.inputFile.nativeElement.click();
    return false;
  }

  getError() {
    return this.parentForm.controls.filename.hasError('required') ? this.errorMessage :
            '';
  }

  onFileInputChange(files: FileList) {
    if (this.allowMultiple) {
      for (let i = 0; i < files.length; i++) {
        this.readFile(files.item(i));
      }
    } else {
      this.readFile(files.item(0));
    }
  }

  // https://stackoverflow.com/questions/40843218/getting-data-from-filereader-in-angular-2
  readFile(file: File): void {
      this.parentForm.controls.filename.setValue(file.name);
    const fileReader: FileReader = new FileReader();

    fileReader.onloadend = (e) => {
      const fileContents: any = {};
      fileContents['contents'] = (fileReader.result instanceof ArrayBuffer)
                                    ? this.arrayBufferToString(fileReader.result)
                                    : fileReader.result;
      fileContents['filename'] = file.name;

      this.contents.emit(fileContents);

      this.reset();
    };

    fileReader.readAsText(file);
  }

  // https://developers.google.com/web/updates/2012/06/How-to-convert-ArrayBuffer-to-and-from-String
  arrayBufferToString(buf: ArrayBuffer): string {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
  }

}
