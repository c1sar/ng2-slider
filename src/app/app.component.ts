import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  slides = [
    {
      img: "http://via.placeholder.com/1200x900",
      title: "Lorem ipsum dolor sit amet, consectetur.",
      html: "<i class='dd-desktop'></i>",
      className: 'test-class',
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      img: "http://via.placeholder.com/1200x900",
      title: "Quis autem vel eum iure reprehenderit",
      description: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium",
    },
    {
      img: "http://via.placeholder.com/1200x900",
      title: "Ut enim ad minima veniam",
      button: {
        text: "Excepteur"
      }
    }
  ]
}
