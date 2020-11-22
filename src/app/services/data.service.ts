import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import xlsxFile from 'read-excel-file';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  getJSON(): Observable<any> {
    return this.http.get('./assets/zaliavos.json');
  }

}

