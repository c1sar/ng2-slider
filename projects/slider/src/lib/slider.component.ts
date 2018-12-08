// Angular
import {
  Component, Input, ElementRef, EventEmitter,
  ViewChild, AfterViewInit, HostListener, Output, OnDestroy, PLATFORM_ID, Inject
} from '@angular/core';

// Models
import { ISlide } from './models/ISlide';
import { ISliderEvent } from './models/ISliderEvent';
import { IOptions } from './models/IOptions';
import { BulletType } from './models/bullet-type.enum';
import { AnimationType } from './models/animation-type.enum';
import { isPlatformBrowser } from '@angular/common';

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
  timeBySlide: number;
  isMobile;
  isBrowser: boolean;

  bulletType = BulletType;
  animationType = AnimationType;

  movementInterval: number;

  constructor(@Inject(PLATFORM_ID) private platformId) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      this.isMobile = navigator.userAgent.match(
        /(iPhone|iPod|iPad|Android|webOS|BlackBerry|IEMobile|Opera Mini)/i);
    }
  }

  ngAfterViewInit(): void {
    this.slidesNumber = this.slides.length;
    this.timeBySlide = (!this.option.timeBySlide || (this.option.timeBySlide < 2000)) ? 5000 : this.option.timeBySlide;
    this.sliderContainerElement = this.sliderSection.nativeElement as HTMLElement;
    this.createSliderInterval();
  }

  ngOnDestroy(): void {
    clearInterval(this.movementInterval);
  }

  bulletMouseEnter(e: Event) {
    if (!this.isMobile) {
      e.stopPropagation();
      this.isOnBullet = true;
    }
  }

  bulletMouseLeave() {
    if (!this.isMobile) {
      this.isOnBullet = false;
    }
  }

  bulletTouchStart(e: Event) {
    if (this.isMobile) {
      e.stopPropagation();
      this.isOnBullet = true;
    }
  }

  bulletTouchEnd() {
    if (this.isMobile) {
      this.isOnBullet = false;
    }
  }

  bulletSetSlide(slideEnd: number) {
    if (!this.isOnAnimation) {
      this.setSlideWidthAnimation(slideEnd);
      this.createSliderInterval();
    }
  }

  clickEvent(slide: ISlide) {
    this.clickButton.emit(slide);
  }

  @HostListener('mousedown', ['$event']) onMouseDown(e: MouseEvent) {
    document.getSelection().empty();

    if ((this.isOnBullet) || (this.isOnAnimation) || (this.isMobile)) {
      return;
    }

    this.isDragEvent = true;
    this.isDragging = true;
    this.posSlider.posInitX = e.clientX;
    clearInterval(this.movementInterval);
  }

  @HostListener('mousemove', ['$event']) mouseMove(e: MouseEvent) {
    if ((!this.isDragging) || (this.isOnAnimation) || (this.isMobile)) {
      return;
    }
    const width = this.sliderContainerElement.scrollWidth - this.sliderContainerElement.clientWidth;
    const newScrollLeftPosition = this.sliderContainerElement.scrollLeft - e.movementX;

    if ((newScrollLeftPosition >= 0) && (newScrollLeftPosition <= width)) {
      this.sliderContainerElement.scrollLeft = newScrollLeftPosition;
    }
  }

  @HostListener('window:mouseup', ['$event']) onMouseUp(e: MouseEvent) {
    if ((this.isOnAnimation) || (this.isMobile)) {
      return;
    }
    this.isDragging = false;
    this.posSlider.posEndX = e.clientX;
    this.move();
    this.createSliderInterval();
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
    clearInterval(this.movementInterval);
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
    this.createSliderInterval();
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

  private createSliderInterval() {
    clearInterval(this.movementInterval);
    this.movementInterval = window.setInterval(() => {
      const newPos = (this.currentSlidePos === this.slidesNumber) ? 1 : this.currentSlidePos + 1;
      this.setSlideWidthAnimation(newPos);
    }, this.timeBySlide);
  }
}
