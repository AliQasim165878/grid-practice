import { Component } from '@angular/core';
import { Workbook } from 'exceljs';
import { Employee, EmployeeService } from './services/employee.service';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { exportDataGrid as exportDataGridToPdf } from 'devextreme/pdf_exporter';

import saveAs from 'file-saver';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  employees: Employee[] = [];
  selectedEmployee: Employee;

  //toolbar
  expanded: Boolean = true;

  constructor(private employeeService: EmployeeService) {
    this.employees = this.employeeService.getEmployees();
  }
  title = 'grid-practice';

  selectEmployee(e) {
    this.selectedEmployee = e.selectedRowsData[0];
    console.log(this.selectedEmployee);
  }

  //toolbar
  handleExpended() {
    this.expanded = !this.expanded;
    console.log('Expended:', this.expanded);
  }
  //last section of demo
  exportGrid(e) {
    if (e.format === 'xlsx') {
      const workbook = new Workbook();
      const worksheet = workbook.addWorksheet('Main sheet');
      exportDataGrid({
        worksheet,
        component: e.component,
      }).then(function () {
        workbook.xlsx.writeBuffer().then(function (buffer) {
          saveAs(
            new Blob([buffer], { type: 'application/octet-stream' }),
            'DataGrid.xlsx'
          );
        });
      });
    } else if (e.format === 'pdf') {
      const doc = new jsPDF();
      exportDataGridToPdf({
        jsPDFDocument: doc,
        component: e.component,
      }).then(() => {
        doc.save('DataGrid.pdf');
      });
    }
  }
}
