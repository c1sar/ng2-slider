import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  // slides = [
  //   {
  //     img: "https://dynamicdevs.blob.core.windows.net/dynamicdevsweb/public-landing/home_1.jpg",
  //     title: "<b>TRABAJAMOS POR TI</b><br> Y TU NEGOCIO ",
  //     button: {
  //       text: "CONÓCENOS"
  //     }
  //   },
  //   {
  //     img: "https://dynamicdevs.blob.core.windows.net/dynamicdevsweb/public-landing/home_1.jpg",
  //     title: "<b>TRABAJAMOS POR MI</b> Y TU NEGOCIO",
  //     button: {
  //       text: "CONÓCENOS"
  //     }
  //   },
  //   {
  //     img: "https://dynamicdevs.blob.core.windows.net/dynamicdevsweb/public-landing/home_1.jpg",
  //     title: "TRABAJAMOS POR USTED</b> Y TU NEGOCIO ",
  //     button: {
  //       text: "CONÓCENOS"
  //     }
  //   },
  //   {
  //     img: "https://dynamicdevs.blob.core.windows.net/dynamicdevsweb/public-landing/home_1.jpg",
  //     title: "TRABAJAMOS?</b> Y TU NEGOCIO ",
  //     button: {
  //       text: "CONÓCENOS"
  //     }
  //   }
  // ]

  slides = [
    {
      img: "https://dynamicdevs.blob.core.windows.net/dynamicdevsweb/public-landing/service_1.jpg",
      title: "<b>DESARROLLO WEB</b><br> Y APLICACIONES",
      html: "<i class='dd-desktop'></i>",
      description: "Desarrollamos páginas web y aplicaciones a la medida de tu empresa. Analizamos la industria en la que te desenvuelves y a tu compentencia",
    },
    {
      img: "https://dynamicdevs.blob.core.windows.net/dynamicdevsweb/public-landing/service_2.jpg",
      title: "<b>CONSULTORÍA Y</b> <br> SISTEMAS",
      description: "Desarrollamos páginas web y aplicaciones a la medida de tu empresa. Analizamos la industria en la que te desenvuelves y a tu compentencia",
    },
    {
      img: "https://dynamicdevs.blob.core.windows.net/dynamicdevsweb/public-landing/service_3.jpg",
      title: "<b> SERVICIOS EN </b> <br>LA NUBE",
      description: "Desarrollamos páginas web y aplicaciones a la medida de tu empresa. Analizamos la industria en la que te desenvuelves y a tu compentencia",
    }
  ]
}
