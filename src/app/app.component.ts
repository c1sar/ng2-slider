import { Component } from '@angular/core';
import { ISlide } from 'projects/slider/src/lib/models/ISlide';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  slides: ISlide[] = [
    {
      img: 'assets/slider-1.jpg',
      title: 'Lorem ipsum dolor sit amet, consectetur.',
      html: '<i class=\'dd-desktop\'></i>',
      className: 'test-class',
      description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
      incididunt ut labore et dolore magna aliqua.`,
    },
    {
      img: 'assets/slider-2.jpg',
      title: 'Quis autem vel eum iure reprehenderit',
      description: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium',
    },
    {
      img: 'assets/slider-3.jpg',
      title: 'Ut enim ad minima veniam',
      button: {
        url: 'https://www.google.com/',
        text: 'Excepteur'
      }
    }
  ];
}
