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

const isMobile = navigator.userAgent.match(
  /(iPhone|iPod|iPad|Android|webOS|BlackBerry|IEMobile|Opera Mini)/i);

@Component({
  selector: 'lib-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements AfterViewInit, OnDestroy {

  @Input() slides: ISlide[];
  @Input() option: IOptions = { animationType: null, bulletType: BulletType.CIRCLE };
  @Output() clickButton: EventEmitter<ISlide> = new EventEmitter<ISlide>();

  @ViewChild('sliderSection') sliderSection: ElementRef;

  sliderContainerElement: HTMLElement;
  posSlider: ISliderEvent = {};

  slidesNumber: number;
  currentSlidePos: number = 1;
  isOnBullet: boolean = false;
  isOnAnimation: boolean = false;
  isDragEvent: boolean = true;
  isDragging: boolean = false;

  bulletType = BulletType;

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

  bulletMouseEnter(e: Event) {
    if (!isMobile) {
      e.stopPropagation();
      this.isOnBullet = true;
    }
  }

  bulletMouseLeave() {
    if (!isMobile) {
      this.isOnBullet = false;
    }
  }

  bulletTouchStart(e: Event) {
    if (isMobile) {
      e.stopPropagation();
      this.isOnBullet = true;
    }
  }

  bulletTouchEnd() {
    if (isMobile) {
      this.isOnBullet = false;
    }
  }

  bulletSetSlide(slideEnd: number) {
    if (!this.isOnAnimation) {
      this.setSlideWidthAnimation(slideEnd);
    }
  }

  clickEvent(slide: ISlide) {
    this.clickButton.emit(slide);
  }

  @HostListener('mousedown', ['$event']) onMouseDown(e: MouseEvent) {
    document.getSelection().empty();

    if ((this.isOnBullet) || (this.isOnAnimation) || (isMobile)) {
      return;
    }

    this.isDragEvent = true;
    this.isDragging = true;
    this.posSlider.posInitX = e.clientX;
  }

  @HostListener('mousemove', ['$event']) mouseMove(e: MouseEvent) {
    if ((!this.isDragging) || (this.isOnAnimation) || (isMobile)) {
      return;
    }
    const width = this.sliderContainerElement.scrollWidth - this.sliderContainerElement.clientWidth;
    const newScrollLeftPosition = this.sliderContainerElement.scrollLeft - e.movementX;

    if ((newScrollLeftPosition >= 0) && (newScrollLeftPosition <= width)) {
      this.sliderContainerElement.scrollLeft = newScrollLeftPosition;
    }
  }

  @HostListener('window:mouseup', ['$event']) onMouseUp(e: MouseEvent) {
    if ((this.isOnAnimation) || (isMobile)) {
      return;
    }
    this.isDragging = false;
    this.posSlider.posEndX = e.clientX;
    this.move();
  }


  @HostListener('touchstart', ['$event']) onTouchStart(e) {
    document.getSelection().empty();
    if ((this.isOnBullet) || (this.isOnAnimation)) {
      return;
    }

    this.isDragEvent = true;
    this.isDragging = true;
    this.posSlider.posInitX = e.touches[0].clientX;
    this.posSlider.scrollInit = this.sliderContainerElement.scrollLeft;
  }

  @HostListener('touchmove', ['$event']) onTouchMove(e) {
    if ((!this.isDragging) || (this.isOnAnimation)) {
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

  @HostListener('touchend', ['$event']) onTouchEnd(e) {
    if (this.isOnAnimation) {
      return;
    }
    this.isDragging = false;
    this.move();
  }

  private move() {
    if ((!this.isDragEvent) || (this.isOnAnimation)) {
      return;
    }

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
    this.isOnAnimation = true;
    let t = 0;
    const posInit = this.sliderContainerElement.scrollLeft;
    const posEnd = this.sliderContainerElement.clientWidth * (slideEnd - 1);
    const c = posEnd - posInit;
    let position = 0;
    const interval = setInterval(() => {
      if (t > 380) {
        this.sliderContainerElement.scrollLeft = posEnd;
        this.currentSlidePos = slideEnd;
        this.isOnAnimation = false;
        this.isDragEvent = false;
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

}
