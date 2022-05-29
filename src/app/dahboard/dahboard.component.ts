import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ColDef } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';

@Component({
  selector: 'app-dahboard',
  templateUrl: './dahboard.component.html',
  styleUrls: ['./dahboard.component.scss']
})

export class DahboardComponent implements OnInit {

  columnDefs: any = [{ field: 'Code' },
  { field: 'Name' },
  { field: 'Batch' },
  { field: 'Stock' },
  { field: 'Deal' },
  { field: 'Free' },
  { field: 'Mrp' },
  { field: 'Rate' },
  { field: 'Exp' },
  { field: 'Company' }];
  rowData!: any[];
  userArray: any = [];
  flag = false;
  page = 1;
  pageSize = 11;
  collectionSize: any;
  shortData: any;
  searchTerm: any;
  value = '';
  searchArr: any = [];
  toggle = false;
  aggregateArr: any = [];
  constructor() {

  }

  ngOnInit(): void {

  }

  upload(fileInput: any) {
    let files = fileInput.target.files;
    let file: File = files.item(0);
    let reader: FileReader = new FileReader();
    reader.readAsText(file);
    reader.onload = (e) => {
      let data = reader.result as string;
      let csvToRowArray = data.split("\n");
      for (let index = 1; index < csvToRowArray.length - 1; index++) {
        let row = csvToRowArray[index].split(",");
        this.userArray.push({ code: row[0], name: row[1], bath: row[2], stock: row[3], deal: row[4], free: row[5], mrp: row[6], rate: row[7], exp: row[8], company: row[9] });
      }
      this.rowData = this.userArray;
      this.collectionSize = this.rowData.length;
      this.refreshPage();
      this.flag = true;
    }

  }

  refreshPage() {
    if (this.value) {
      this.shortData = this.sortData(this.searchArr);
    } else {
      this.shortData = this.sortData(this.rowData);
    }
  }

  search(data: any) {
    let averageArr: any = [];
    let stockSum = 0;
    let deal: any = [];
    let free: any = [];
    let mrp: any = [];
    let rate: any = [];
    let exp : any = [];
    this.value = data.target.value;
    if (!this.value) {
      averageArr = [];
      this.toggle = false;
      this.aggregateArr = [];
      this.refreshPage();
    } else {
      this.searchArr = this.rowData.filter((val) => val.name.includes(this.value.toUpperCase()));
      this.shortData = this.sortData(this.searchArr);
      this.shortData.forEach((data: any) => {
        if (data.name !== this.value) {
          return
        } else {
          this.aggregateArr.push(data);
          stockSum += Number(data.stock);
          mrp.push(data.mrp);
          rate.push(Number(data.rate));
          if (free == 0) {
            deal.push(0);
            free.push(0);
          } else {
            deal.push(Number(data.deal) / Number(data.free));
            free.push(Number(data.deal) / Number(data.free));
          }
          exp.push(data.exp);
        }
      });
      this.collectionSize = this.rowData.length;
      if (this.aggregateArr.length > 1) {
        var temp = exp.map((d:any) => Math.abs(new Date(d).getTime() + new Date().getTime()));
        var id = temp.indexOf(Math.min(...temp));
        console.log('this', this.aggregateArr)
        this.toggle = true;
        averageArr.push({ code: this.aggregateArr[0].code, name: this.aggregateArr[0].name, bath: 'All', stock: stockSum, deal: Math.min(...deal), free: Math.min(...free), mrp: Math.max(...mrp), rate: Math.max(...rate), exp: exp[id] });
        this.shortData = this.sortData(averageArr);
      }
     
    }

  }

  batchInput(data:any){
    console.log('data', data);
    this.shortData = this.sortData([data]);
  }

  sortData(arr: any) {
    return arr.map((data: any, i: any) => ({ id: i + 1, ...data }))
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }


}
