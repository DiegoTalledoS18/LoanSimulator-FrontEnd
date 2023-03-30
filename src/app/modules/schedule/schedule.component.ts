import {Component, ElementRef} from '@angular/core';

export interface static_data {
  anio: number;
  cuota: number;
  capital_am: number;
  interes: number;
  amortizacion_ac: number;
  capital_pen: number;
}

const ELEMENT_DATA: static_data[] = [
  {anio: 1, cuota: 1000, capital_am: 1000, interes: 1000, amortizacion_ac: 1000, capital_pen: 1000},
  {anio: 2, cuota: 1000, capital_am: 1000, interes: 1000, amortizacion_ac: 1000, capital_pen: 1000},
  {anio: 3, cuota: 1000, capital_am: 1000, interes: 1000, amortizacion_ac: 1000, capital_pen: 1000},
  {anio: 4, cuota: 1000, capital_am: 1000, interes: 1000, amortizacion_ac: 1000, capital_pen: 1000},
  {anio: 5, cuota: 1000, capital_am: 1000, interes: 1000, amortizacion_ac: 1000, capital_pen: 1000},
  {anio: 6, cuota: 1000, capital_am: 1000, interes: 1000, amortizacion_ac: 1000, capital_pen: 1000},
  {anio: 7, cuota: 1000, capital_am: 1000, interes: 1000, amortizacion_ac: 1000, capital_pen: 1000},
  {anio: 8, cuota: 1000, capital_am: 1000, interes: 1000, amortizacion_ac: 1000, capital_pen: 1000},
  {anio: 9, cuota: 1000, capital_am: 1000, interes: 1000, amortizacion_ac: 1000, capital_pen: 1000},
  {anio: 10, cuota: 1000, capital_am: 1000, interes: 1000, amortizacion_ac: 1000, capital_pen: 1000},

];

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent {
  displayedColumns: string[] = ['anio', 'cuota', 'capital_am', 'interes', 'amortizacion_ac', 'capital_pen'];
  dataSource = ELEMENT_DATA;

  constructor(private elementRef: ElementRef) { }

  ngAfterViewInit() {
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '#ffffff';
  }
}
