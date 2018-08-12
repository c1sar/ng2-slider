# Angular Slider Library

Angular slider library 

## How to use

Navigate to the level of your package.json and type
```typescript
 npm install ng2-slider --save
```

or with yarn

```typescript
 yarn add ng2-slider
```

## Using in the angular application

Import in your module. 

```typescript
import { SliderModule } from 'ng2-slider';

@NgModule({
  imports: [
    SliderModule
  ]
})
export class AppModule { }
```

In your Html component
```typescript
<lib-slider [slides]="slides"></lib-slider>
```

In your TS component declare the object
```typescript
slides: ISlide[] = [  
   {  
      "img":"http://lorempixel.com/output/animals-q-g-640-320-10.jpg",
      "title":"<b> Some random title</b><br> example",
      "button":{  
         "text":"CLICK ON ME"
      }
   },
   {  
      "img":"http://lorempixel.com/output/animals-q-g-640-320-10.jpg",
      "title":"<b> Some random title</b><br> example",
      "button":{  
         "text":"CLICK ON ME"
      }
   },
   {  
      "img":"http://lorempixel.com/output/animals-q-g-640-320-10.jpg",
      "title":"<b> Some random title</b><br> example",
      "button":{  
         "text":"CLICK ON ME"
      }
   },
   {  
      "img":"http://lorempixel.com/output/animals-q-g-640-320-10.jpg",
      "title":"<b> Some random title</b><br> example",
      "button":{  
         "text":"CLICK ON ME"
      }
   }
]
```
You can use square bullets

```typescript
<lib-slider [slides]="slides" [squareBullets]="true"></lib-slider>
```