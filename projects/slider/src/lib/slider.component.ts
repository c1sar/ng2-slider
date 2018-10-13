// Angular
import {
  Component, Input, ElementRef, EventEmitter,
  ViewChild, AfterViewInit, HostListener, Output, OnDestroy
} from '@angular/core';

// Models
import { ISlide } from './models/ISlide';
import { ISliderEvent } from './models/ISliderEvent';
import { IOptions } from './models/IOptions';
import { BulletType } from './models/bullet-type.enum';

@Component({
  selector: 'lib-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements AfterViewInit, OnDestroy {

  @Input() slides: ISlide[];
  @Input() squareBullets: boolean;
  @Input() option: IOptions = { animationType: null, bulletType: BulletType.CIRCLE };
  @Output() clickButton: EventEmitter<ISlide> = new EventEmitter<ISlide>();

  @ViewChild('sliderSection') sliderSection: ElementRef;

  sliderContainerElement: HTMLElement;
  isDragging: boolean = false;
  posSlider: ISliderEvent = {};
  lastScrollLeft: number = 0;
  slidesNumber: number = 4;
  currentSlidePos: number = 1;
  blocked: boolean = false;

  movementInterval: number;

  constructor() { }

  ngAfterViewInit(): void {
    this.slidesNumber = this.slides.length;
    this.sliderContainerElement = this.sliderSection.nativeElement as HTMLElement;
    this.movementInterval = window.setInterval(() => {
      
    }, 500);
  }

  ngOnDestroy() {
    clearInterval(this.movementInterval);
  }

  setSlide(numberSlide: number) {
    const width = this.sliderContainerElement.clientWidth;
    this.sliderContainerElement.scrollLeft = width * (numberSlide - 1);
    this.currentSlidePos = numberSlide;
    setTimeout(() => {
      this.blocked = false;
    }, 200);
  }

  clickEvent(slide: ISlide) {
    this.clickButton.emit(slide);
  }

  @HostListener('mousedown', ['$event']) onMouseDown(e: MouseEvent) {
    document.getSelection().empty();
    if (this.validateElementBullet(e)) {
      e.preventDefault();
      this.blocked = true;
      return;
    }
    this.blocked = false;
    this.isDragging = true;
    this.posSlider.posInitX = e.clientX;
  }

  @HostListener('mousemove', ['$event']) mouseMove(e: MouseEvent) {
    if ((!this.isDragging) || (this.blocked)) {
      return;
    }

    const width = this.sliderContainerElement.scrollWidth - this.sliderContainerElement.clientWidth;
    const newScrollLeftPosition = this.sliderContainerElement.scrollLeft - e.movementX;

    if ((newScrollLeftPosition >= 0) && (newScrollLeftPosition <= width)) {
      this.sliderContainerElement.scrollLeft = newScrollLeftPosition;
    }
  }

  @HostListener('window:mouseup', ['$event']) onMouseUp(e: MouseEvent) {
    if (this.blocked) {
      return;
    }
    this.isDragging = false;
    this.posSlider.posEndX = e.clientX;
    this.move();
  }


  @HostListener('touchstart', ['$event']) onTouchStart(e) {
    document.getSelection().empty();
    if (this.blocked) {
      return;
    }
    this.isDragging = true;
    this.posSlider.posInitX = e.touches[0].clientX;
    this.posSlider.scrollInit = this.sliderContainerElement.scrollLeft;
  }

  @HostListener('touchmove', ['$event']) onTouchMove(e) {
    if ((!this.isDragging) || (this.blocked)) {
      return;
    }

    const width = this.sliderContainerElement.scrollWidth - this.sliderContainerElement.clientWidth;
    const dif = e.touches[0].clientX - this.posSlider.posInitX;
    this.posSlider.posEndX = e.touches[0].clientX;
    const newScrollLeftPosition = this.posSlider.scrollInit - dif;

    if ((newScrollLeftPosition >= 0) && (newScrollLeftPosition <= width)) {
      this.sliderContainerElement.scrollLeft = newScrollLeftPosition;
    }
  }

  @HostListener('window:touchend', ['$event']) onTouchEnd(e) {
    if ((this.blocked) || (this.validateElementBullet(e))) {
      return;
    }
    this.isDragging = false;
    this.move();
  }

  private move() {
    const minMovement = this.sliderContainerElement.clientWidth * 0.18;

    if (Math.abs(this.posSlider.posEndX - this.posSlider.posInitX) < minMovement) {
      this.setSlideWidthAnimation(this.currentSlidePos);
      return;
    }

    if ((this.posSlider.posEndX < this.posSlider.posInitX) && (this.currentSlidePos < this.slidesNumber)) {
      this.setSlideWidthAnimation(this.currentSlidePos + 1);
    } else if ((this.currentSlidePos > 1) && (this.posSlider.posEndX > this.posSlider.posInitX)) {
      this.setSlideWidthAnimation(this.currentSlidePos - 1);
    }
  }

  setSlideWidthAnimation(slideEnd) {
    let t = 0;
    const posInit = this.sliderContainerElement.scrollLeft;
    const posEnd = this.sliderContainerElement.clientWidth * (slideEnd - 1);
    const c = posEnd - posInit;
    let position = 0;
    const interval = setInterval(() => {
      if (t > 380) {
        this.sliderContainerElement.scrollLeft = posEnd;
        this.currentSlidePos = slideEnd;
        this.blocked = false;
        clearInterval(interval);
      }
      position = this.easeOutSine(t, posInit, c, 380);
      this.sliderContainerElement.scrollLeft = position;
      t = t + 5;
    }, 5);
  }

  easeOutSine(t: number, b: number, c: number, d: number): number {
    return c * Math.sin(t / d * (Math.PI / 2)) + b;
  }

  private validateElementBullet(e: Event): boolean {
    if (e.target) {
      const element = e.target as HTMLElement;
      if ((element.className === 'bullet') || (element.className === 'bullet-container')
        || (element.className === 'bullet active') || (element.className === 'bullet square')
        || (element.className === 'bullet square active')) {
        return true;
      }
    }
    return false;
  }

}
