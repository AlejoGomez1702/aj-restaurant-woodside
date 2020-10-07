import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-initial',
  templateUrl: './initial.component.html',
  styleUrls: ['./initial.component.scss'],
})
export class InitialComponent implements OnInit 
{

  constructor(
    private router: Router
  ) 
  { }

  ngOnInit() 
  {}

  goToPage(page: number)
  {
    let url: string;

    // Login
    if(page == 1)
    {
      url = "/auth";
    }else if(page == 2) //Mostrar el menu
    {
      url = "/woodside/tabs/tab1"; 
    }else if(page == 3) //Galeria
    {
      url = "/woodside/tabs/tab2"
    }

    this.router.navigate([url]);
  }


}
