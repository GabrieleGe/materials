import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-materials',
  templateUrl: './materials.component.html',
  styleUrls: ['./materials.component.scss']
})
export class MaterialsComponent implements OnInit {
  materialsList: string[] = [];
  materialForm: FormGroup;
  allData: any;
  temperature = 0;
  time = 0;

  constructor(private dataService: DataService, private fb: FormBuilder) { }

  ngOnInit(): void {
    // creates form
    this.materialForm = this.fb.group({
      materials: this.fb.array([this.createMaterialFormGroup()])
    });
    this.getMaterials();
  }

  // takes materials from file
  getMaterials(): void {
    this.dataService.getJSON().subscribe(result => {
      this.allData = result;
      this.allData.forEach(material => {
        const key = 'Žaliava';
        this.materialsList.push(material[key]);
      });
    });
  }

  // calculates values on submit
  onSubmit(): void {
    const materialKey = 'Žaliava';
    const timeKey = 'Džiovinimo laikas, val.';
    const temperatureKey = 'Džiovinimo temp, C°';
    const max = this.materialForm.get('materials').value
      .reduce((prev, current) => (prev.materialQuantity > current.materialQuantity) ? prev : current);

    if (max.materialQuantity < 50) {
      const timeArray = [];
      this.materialForm.get('materials').value.forEach(element => {
        let elementTime = this.allData.find(m => m[materialKey] === element.materialName)[timeKey];
        elementTime = typeof elementTime === 'string' ? elementTime.replace(',', '.') : elementTime;
        timeArray.push(elementTime ? +elementTime : 0);
      });
      const sum = timeArray.reduce((a, b) => a + b, 0);
      this.time = (sum / timeArray.length) || 0;
      this.temperature = this.allData.find(m => m[materialKey] === max.materialName)[temperatureKey];
    } else {
      const temperatureArray = [];

      this.materialForm.get('materials').value.forEach(element => {
        const selectedElement = this.allData.find(m => m[materialKey] === element.materialName);
        const elementTemperature = selectedElement[temperatureKey] ? selectedElement[temperatureKey] : 0;
        temperatureArray.push(elementTemperature);
      });
      const sum = temperatureArray.reduce((a, b) => a + b, 0);
      this.temperature = (sum / temperatureArray.length);

      const maxTime = (this.allData.find(m => m[materialKey] === max.materialName)[timeKey]) || 0;

      this.time = typeof maxTime === 'string' ? maxTime.replace(',', '.') : maxTime;
    }
  }

  // calculates sum of "kiekis" fields
  getSumOfQuantity(): number {
    let sum = 0;
    this.materialForm.get('materials').value.forEach(element => {
      sum = sum + element.materialQuantity;
    });
    return sum;
  }

  addMaterialFormGroup(): void {
    const materials = this.materialForm.get('materials') as FormArray;
    materials.push(this.createMaterialFormGroup());
  }

  removeOrClearEmail(i: number): void {
    const materials = this.materialForm.get('materials') as FormArray;
    if (materials.length > 1) {
      materials.removeAt(i);
    } else {
      materials.reset();
    }
  }

  convertNumToTime(num: number): string {
    // Separate the int from the decimal part
    const hour = Math.floor(num);
    let decpart = num - hour;

    const min = 1 / 60;
    // Round to nearest minute
    decpart = min * Math.round(decpart / min);

    let minute = Math.floor(decpart * 60) + '';

    // Add padding if need
    if (minute.length < 2) {
      minute = '0' + minute;
    }

    return hour + ':' + minute;
  }

  private createMaterialFormGroup(): FormGroup {
    return new FormGroup({
      materialName: new FormControl(''),
      materialQuantity: new FormControl('')
    });
  }
}
