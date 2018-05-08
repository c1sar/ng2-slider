import {
  Component, OnInit, Input, ElementRef, EventEmitter,
  ViewChild, AfterViewInit, HostListener, Output
} from '@angular/core';
import { Slide } from './models/slide';
import { ISliderEvent } from './models/ISliderEvent';

@Component({
  selector: 'lib-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit, AfterViewInit {

  @Input() slides: Slide[];
  @Output() clickButton: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('sliderSection') sliderSection: ElementRef;
  sliderElement: HTMLElement;
  isDragging: boolean = false;
  posSlider: ISliderEvent = {};
  lastScrollLeft: number = 0;
  slideNumber: number = 4;
  currentSlidePos: number = 1;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.slideNumber = this.slides.length;
    this.sliderElement = this.sliderSection.nativeElement as HTMLElement;
  }

  setSlide(numberSlide: number) {
    const width = this.sliderElement.clientWidth;
    this.sliderElement.scrollLeft = width * (numberSlide - 1);
    this.currentSlidePos = numberSlide;
  }

  clickEvent(slide: Slide) {
    this.clickButton.emit(slide);
  }

  @HostListener('mousedown', ['$event']) onMouseDown(e: MouseEvent) {
    this.isDragging = true;
    this.posSlider.posInitX = e.clientX;
  }

  @HostListener('mousemove', ['$event']) mouseMove(e: MouseEvent) {

    if (!this.isDragging) {
      return;
    }

    const width = this.sliderElement.scrollWidth - this.sliderElement.clientWidth;
    const newScrollLeftPosition = this.sliderElement.scrollLeft - e.movementX;

    if ((newScrollLeftPosition >= 0) && (newScrollLeftPosition <= width)) {
      this.sliderElement.scrollLeft = newScrollLeftPosition;
    }
  }

  @HostListener('mouseout', ['$event']) onMouseOut(e: MouseEvent) {
    this.isDragging = false;
    this.setSlide(this.currentSlidePos);
  }

  @HostListener('mouseup', ['$event']) onMouseUp(e: MouseEvent) {
    this.isDragging = false;
    this.posSlider.posEndX = e.clientX;
    this.move();
  }


  @HostListener('touchstart', ['$event']) onTouchStart(e: TouchEvent) {
    this.isDragging = true;
    this.posSlider.posInitX = e.touches[0].clientX;
    this.posSlider.scrollInit = this.sliderElement.scrollLeft;
  }

  @HostListener('touchmove', ['$event']) onTouchMove(e: TouchEvent) {

    if (!this.isDragging) {
      return;
    }

    const width = this.sliderElement.scrollWidth - this.sliderElement.clientWidth;
    const dif = e.touches[0].clientX - this.posSlider.posInitX;
    this.posSlider.posEndX = e.touches[0].clientX;
    const newScrollLeftPosition = this.posSlider.scrollInit - dif;

    if ((newScrollLeftPosition >= 0) && (newScrollLeftPosition <= width)) {
      this.sliderElement.scrollLeft = newScrollLeftPosition;
    }
  }

  @HostListener('touchend', ['$event']) onTouchEnd(e: TouchEvent) {
    this.isDragging = false;
    this.move();
  }

  private move() {
    if ((this.posSlider.posEndX < this.posSlider.posInitX) && (this.currentSlidePos < this.slideNumber)) {
      this.setSlideWidthAnimation(this.currentSlidePos, this.currentSlidePos + 1);
    } else if ((this.currentSlidePos > 1) && (this.posSlider.posEndX > this.posSlider.posInitX)) {
      this.setSlideWidthAnimation(this.currentSlidePos, this.currentSlidePos - 1);
    }
  }

  setSlideWidthAnimation(slideInit, slideEnd) {
    let t = 0;
    const posInit = this.sliderElement.scrollLeft;
    const posEnd = this.sliderElement.clientWidth * (slideEnd - 1);
    const c = posEnd - posInit;
    let position = 0;
    const interval = setInterval(() => {
      if (t > 380) {
        this.sliderElement.scrollLeft = posEnd;
        this.currentSlidePos = slideEnd;
        clearInterval(interval);
      }
      position = this.easeOutSine(t, posInit, c, 380);
      this.sliderElement.scrollLeft = position;
      t = t + 5;
    }, 5)
  }

  easeOutSine(t, b, c, d) {
    return c * Math.sin(t / d * (Math.PI / 2)) + b;
  }

}
