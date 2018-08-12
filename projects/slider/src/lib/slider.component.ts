// Angular
import {
  Component, OnInit, Input, ElementRef, EventEmitter,
  ViewChild, AfterViewInit, HostListener, Output
} from '@angular/core';

// Models
import { ISlide } from './models/ISlide';
import { ISliderEvent } from './models/ISliderEvent';

@Component({
  selector: 'lib-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit, AfterViewInit {

  @Input() slides: ISlide[];
  @Output() clickButton: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('sliderSection') sliderSection: ElementRef;
  sliderElement: HTMLElement;
  isDragging: boolean = false;
  posSlider: ISliderEvent = {};
  lastScrollLeft: number = 0;
  slideNumber: number = 4;
  currentSlidePos: number = 1;
  blocked: boolean = false;

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
    this.isDragging = true;
    this.posSlider.posInitX = e.clientX;
  }

  @HostListener('mousemove', ['$event']) mouseMove(e: MouseEvent) {
    if ((!this.isDragging) || (this.blocked)) {
      return;
    }

    const width = this.sliderElement.scrollWidth - this.sliderElement.clientWidth;
    const newScrollLeftPosition = this.sliderElement.scrollLeft - e.movementX;

    if ((newScrollLeftPosition >= 0) && (newScrollLeftPosition <= width)) {
      this.sliderElement.scrollLeft = newScrollLeftPosition;
    }
  }

  @HostListener('mouseout', ['$event']) onMouseOut(e: MouseEvent) {
    if ((this.blocked) || (this.validateElementBullet(e)) || (e.relatedTarget == null)
    || ((e.relatedTarget as HTMLElement).className === 'bullet-container')
    ) {
      return;
    }
    this.isDragging = false;
    this.setSlide(this.currentSlidePos);
  }

  @HostListener('mouseup', ['$event']) onMouseUp(e: MouseEvent) {
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
    this.posSlider.scrollInit = this.sliderElement.scrollLeft;
  }

  @HostListener('touchmove', ['$event']) onTouchMove(e) {
    if ((!this.isDragging) || (this.blocked)) {
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

  @HostListener('touchend', ['$event']) onTouchEnd(e) {
    if ((this.blocked) || (this.validateElementBullet(e))) {
      return;
    }
    this.isDragging = false;
    this.move();
  }

  private move() {
    const minMovement = this.sliderElement.clientWidth * 0.20;

    if (Math.abs(this.posSlider.posEndX - this.posSlider.posInitX) < minMovement) {
      this.setSlideWidthAnimation(this.currentSlidePos, this.currentSlidePos);
      return;
    }

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
    }, 5);
  }

  easeOutSine(t, b, c, d) {
    return c * Math.sin(t / d * (Math.PI / 2)) + b;
  }

  private validateElementBullet(e: Event): boolean {
    if (e.target) {
      const element = e.target as HTMLElement;
      if ((element.className === 'bullet') || (element.className === 'bullet-container')
      || (element.className === 'bullet active')) {
        return true;
      }
    }
    return false;
  }

}
