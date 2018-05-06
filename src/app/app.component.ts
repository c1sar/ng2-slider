import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  slides = [
    {
      img: "https://dynamicdevs.blob.core.windows.net/dynamicdevsweb/public-landing/home_1.jpg",
      title: "<b>TRABAJAMOS POR TI</b><br> Y TU NEGOCIO ",
      button: {
        text: "CONÓCENOS"
      }
    },
    {
      img: "https://dynamicdevs.blob.core.windows.net/dynamicdevsweb/public-landing/home_1.jpg",
      title: "<b>TRABAJAMOS POR MI</b> Y TU NEGOCIO",
      button: {
        text: "CONÓCENOS"
      }
    },
    {
      img: "https://dynamicdevs.blob.core.windows.net/dynamicdevsweb/public-landing/home_1.jpg",
      title: "TRABAJAMOS POR USTED</b> Y TU NEGOCIO ",
      button: {
        text: "CONÓCENOS"
      }
    },
    {
      img: "https://dynamicdevs.blob.core.windows.net/dynamicdevsweb/public-landing/home_1.jpg",
      title: "TRABAJAMOS?</b> Y TU NEGOCIO ",
      button: {
        text: "CONÓCENOS"
      }
    }
  ]
}
