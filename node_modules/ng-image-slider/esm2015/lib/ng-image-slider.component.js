/**
 * @fileoverview added by tsickle
 * Generated from: lib/ng-image-slider.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { ChangeDetectorRef, Component, Input, Output, EventEmitter, ViewEncapsulation, ViewChild, HostListener, PLATFORM_ID, Inject, ElementRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NgImageSliderService } from './ng-image-slider.service';
/** @type {?} */
const NEXT_ARROW_CLICK_MESSAGE = 'next';
/** @type {?} */
const PREV_ARROW_CLICK_MESSAGE = 'previous';
export class NgImageSliderComponent {
    /**
     * @param {?} cdRef
     * @param {?} platformId
     * @param {?} imageSliderService
     * @param {?} elRef
     */
    constructor(cdRef, platformId, imageSliderService, elRef
    // @Inject(ElementRef) private _elementRef: ElementRef
    ) {
        this.cdRef = cdRef;
        this.platformId = platformId;
        this.imageSliderService = imageSliderService;
        this.elRef = elRef;
        // for slider
        this.sliderMainDivWidth = 0;
        this.imageParentDivWidth = 0;
        this.imageObj = [];
        this.ligthboxImageObj = [];
        this.totalImages = 0;
        this.leftPos = 0;
        this.effectStyle = 'all 1s ease-in-out';
        this.speed = 1; // default speed in second
        // default speed in second
        this.sliderPrevDisable = false;
        this.sliderNextDisable = false;
        this.slideImageCount = 1;
        this.sliderImageWidth = 205;
        this.sliderImageReceivedWidth = 205;
        this.sliderImageHeight = 200;
        this.sliderImageReceivedHeight = 205;
        this.sliderImageSizeWithPadding = 211;
        this.autoSlideCount = 0;
        this.stopSlideOnHover = true;
        this.showArrowButton = true;
        this.textDirection = 'ltr';
        this.imageMargin = 3;
        this.infinite = false;
        this.imagePopup = true;
        this.images = [];
        this.videoAutoPlay = false;
        this.paginationShow = false;
        this.arrowKeyMove = true;
        this.manageImageRatio = false;
        this.showVideoControls = true;
        // @Outputs
        this.imageClick = new EventEmitter();
        this.arrowClick = new EventEmitter();
        this.lightboxArrowClick = new EventEmitter();
        this.lightboxClose = new EventEmitter();
        // for lightbox
        this.ligthboxShow = false;
        this.activeImageIndex = -1;
        this.visiableImageIndex = 0;
    }
    // @inputs
    /**
     * @param {?} data
     * @return {?}
     */
    set imageSize(data) {
        if (data
            && typeof (data) === 'object') {
            if (data.hasOwnProperty('space') && typeof (data['space']) === 'number' && data['space'] > -1) {
                this.imageMargin = data['space'];
            }
            if (data.hasOwnProperty('width') && (typeof (data['width']) === 'number' || typeof (data['width']) === 'string')) {
                this.sliderImageReceivedWidth = data['width'];
                // this.sliderImageSizeWithPadding = data['width'] + (this.imageMargin * 2); // addeing padding with image width
            }
            if (data.hasOwnProperty('height') && (typeof (data['height']) === 'number' || typeof (data['height']) === 'string')) {
                this.sliderImageReceivedHeight = data['height'];
            }
        }
    }
    /**
     * @param {?} dir
     * @return {?}
     */
    set direction(dir) {
        if (dir) {
            this.textDirection = dir;
        }
    }
    /**
     * @param {?} data
     * @return {?}
     */
    set animationSpeed(data) {
        if (data
            && typeof (data) === 'number'
            && data >= 0.1
            && data <= 5) {
            this.speed = data;
            this.effectStyle = `all ${this.speed}s ease-in-out`;
        }
    }
    /**
     * @param {?} count
     * @return {?}
     */
    set slideImage(count) {
        if (count && typeof count === 'number') {
            this.slideImageCount = Math.round(count);
        }
    }
    /**
     * @param {?} count
     * @return {?}
     */
    set autoSlide(count) {
        if (count && (typeof count === 'number'
            || typeof count === 'boolean'
            || typeof count === 'object')) {
            if (typeof count === 'number' && count >= 1 && count <= 5) {
                count = Math.round(count);
            }
            else if (typeof count === 'boolean') {
                count = 1;
            }
            else if (typeof count === 'object'
                && count.hasOwnProperty('interval')
                && Math.round(count['interval'])
                && Math.round(count['interval']) >= 1
                && Math.round(count['interval']) <= 5) {
                this.stopSlideOnHover = count.hasOwnProperty('stopOnHover') ? count['stopOnHover'] : true;
                count = Math.round(count['interval']);
            }
            this.autoSlideCount = count * 1000;
        }
    }
    /**
     * @param {?} flag
     * @return {?}
     */
    set showArrow(flag) {
        if (flag !== undefined && typeof flag === 'boolean') {
            this.showArrowButton = flag;
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onResize(event) {
        this.setSliderWidth();
    }
    /**
     * @param {?} event
     * @return {?}
     */
    handleKeyboardEvent(event) {
        if (event && event.key) {
            if (event.key.toLowerCase() === 'arrowright' && !this.ligthboxShow && this.arrowKeyMove) {
                this.next();
            }
            if (event.key.toLowerCase() === 'arrowleft' && !this.ligthboxShow && this.arrowKeyMove) {
                this.prev();
            }
            if (event.key.toLowerCase() === 'escape' && this.ligthboxShow) {
                this.close();
            }
        }
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        // @TODO: for future use
        // console.log(this._elementRef)
        // for slider
        if (this.infinite) {
            this.effectStyle = 'none';
            this.leftPos = -1 * this.sliderImageSizeWithPadding * this.slideImageCount;
            for (let i = 1; i <= this.slideImageCount; i++) {
                this.imageObj.unshift(this.imageObj[this.imageObj.length - i]);
            }
        }
    }
    // for slider
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        this.setSliderWidth();
        this.cdRef.detectChanges();
        if (isPlatformBrowser(this.platformId)) {
            this.imageAutoSlide();
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
        }
        if (this.ligthboxShow === true) {
            this.close();
        }
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes.images
            && changes.images.hasOwnProperty('previousValue')
            && changes.images.hasOwnProperty('currentValue')
            && changes.images.previousValue != changes.images.currentValue) {
            this.setSliderImages(changes.images.currentValue);
        }
        if (changes && changes.imageSize) {
            /** @type {?} */
            const size = changes.imageSize;
            if (size
                && size.previousValue
                && size.currentValue
                && size.previousValue.width && size.previousValue.height
                && size.currentValue.width && size.currentValue.height
                && (size.previousValue.width !== size.currentValue.width
                    || size.previousValue.height !== size.currentValue.height)) {
                this.setSliderWidth();
            }
        }
    }
    /**
     * @return {?}
     */
    ngDoCheck() {
        if (this.images
            && this.ligthboxImageObj
            && this.images.length !== this.ligthboxImageObj.length) {
            this.setSliderImages(this.images);
        }
    }
    /**
     * @param {?} imgObj
     * @return {?}
     */
    setSliderImages(imgObj) {
        if (imgObj && imgObj instanceof Array && imgObj.length) {
            this.imageObj = imgObj.map((/**
             * @param {?} img
             * @param {?} index
             * @return {?}
             */
            (img, index) => {
                img['index'] = index;
                return img;
            }));
            this.ligthboxImageObj = [...this.imageObj];
            this.totalImages = this.imageObj.length;
            // this.imageParentDivWidth = imgObj.length * this.sliderImageSizeWithPadding;
            this.setSliderWidth();
        }
    }
    /**
     * @return {?}
     */
    setSliderWidth() {
        if (this.sliderMain
            && this.sliderMain.nativeElement
            && this.sliderMain.nativeElement.offsetWidth) {
            this.sliderMainDivWidth = this.sliderMain.nativeElement.offsetWidth;
        }
        if (this.sliderMainDivWidth
            && this.sliderImageReceivedWidth) {
            if (typeof this.sliderImageReceivedWidth === 'number') {
                this.sliderImageWidth = this.sliderImageReceivedWidth;
            }
            else if (typeof this.sliderImageReceivedWidth === 'string') {
                if (this.sliderImageReceivedWidth.indexOf('px') >= 0) {
                    this.sliderImageWidth = parseFloat(this.sliderImageReceivedWidth);
                }
                else if (this.sliderImageReceivedWidth.indexOf('%') >= 0) {
                    this.sliderImageWidth = +((this.sliderMainDivWidth * parseFloat(this.sliderImageReceivedWidth)) / 100).toFixed(2);
                }
                else if (parseFloat(this.sliderImageReceivedWidth)) {
                    this.sliderImageWidth = parseFloat(this.sliderImageReceivedWidth);
                }
            }
        }
        if (window && window.innerHeight
            && this.sliderImageReceivedHeight) {
            if (typeof this.sliderImageReceivedHeight === 'number') {
                this.sliderImageHeight = this.sliderImageReceivedHeight;
            }
            else if (typeof this.sliderImageReceivedHeight === 'string') {
                if (this.sliderImageReceivedHeight.indexOf('px') >= 0) {
                    this.sliderImageHeight = parseFloat(this.sliderImageReceivedHeight);
                }
                else if (this.sliderImageReceivedHeight.indexOf('%') >= 0) {
                    this.sliderImageHeight = +((window.innerHeight * parseFloat(this.sliderImageReceivedHeight)) / 100).toFixed(2);
                }
                else if (parseFloat(this.sliderImageReceivedHeight)) {
                    this.sliderImageHeight = parseFloat(this.sliderImageReceivedHeight);
                }
            }
        }
        this.sliderImageSizeWithPadding = this.sliderImageWidth + (this.imageMargin * 2);
        this.imageParentDivWidth = this.imageObj.length * this.sliderImageSizeWithPadding;
        if (this.imageDiv && this.imageDiv.nativeElement && this.imageDiv.nativeElement.offsetWidth) {
            this.leftPos = this.infinite ? -1 * this.sliderImageSizeWithPadding * this.slideImageCount : 0;
        }
        this.nextPrevSliderButtonDisable();
    }
    /**
     * @param {?} index
     * @return {?}
     */
    imageOnClick(index) {
        this.activeImageIndex = index;
        if (this.imagePopup) {
            this.showLightbox();
        }
        this.imageClick.emit(index);
    }
    /**
     * @return {?}
     */
    imageAutoSlide() {
        if (this.infinite && this.autoSlideCount && !this.ligthboxShow) {
            this.autoSlideInterval = setInterval((/**
             * @return {?}
             */
            () => {
                this.next();
            }), this.autoSlideCount);
        }
    }
    /**
     * @return {?}
     */
    imageMouseEnterHandler() {
        if (this.infinite && this.autoSlideCount && this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
        }
    }
    /**
     * @return {?}
     */
    prev() {
        if (!this.sliderPrevDisable) {
            if (this.infinite) {
                this.infinitePrevImg();
            }
            else {
                this.prevImg();
            }
            this.arrowClick.emit(PREV_ARROW_CLICK_MESSAGE);
            this.sliderArrowDisableTeam();
            this.getVisiableIndex();
        }
    }
    /**
     * @return {?}
     */
    next() {
        if (!this.sliderNextDisable) {
            if (this.infinite) {
                this.infiniteNextImg();
            }
            else {
                this.nextImg();
            }
            this.arrowClick.emit(NEXT_ARROW_CLICK_MESSAGE);
            this.sliderArrowDisableTeam();
            this.getVisiableIndex();
        }
    }
    /**
     * @return {?}
     */
    prevImg() {
        if (0 >= this.leftPos + (this.sliderImageSizeWithPadding * this.slideImageCount)) {
            this.leftPos += this.sliderImageSizeWithPadding * this.slideImageCount;
        }
        else {
            this.leftPos = 0;
        }
    }
    /**
     * @return {?}
     */
    nextImg() {
        if ((this.imageParentDivWidth + this.leftPos) - this.sliderMainDivWidth > this.sliderImageSizeWithPadding * this.slideImageCount) {
            this.leftPos -= this.sliderImageSizeWithPadding * this.slideImageCount;
        }
        else if ((this.imageParentDivWidth + this.leftPos) - this.sliderMainDivWidth > 0) {
            this.leftPos -= (this.imageParentDivWidth + this.leftPos) - this.sliderMainDivWidth;
        }
    }
    /**
     * @return {?}
     */
    infinitePrevImg() {
        this.effectStyle = `all ${this.speed}s ease-in-out`;
        this.leftPos = 0;
        setTimeout((/**
         * @return {?}
         */
        () => {
            this.effectStyle = 'none';
            this.leftPos = -1 * this.sliderImageSizeWithPadding * this.slideImageCount;
            for (let i = 0; i < this.slideImageCount; i++) {
                this.imageObj.unshift(this.imageObj[this.imageObj.length - this.slideImageCount - 1]);
                this.imageObj.pop();
            }
        }), this.speed * 1000);
    }
    /**
     * @return {?}
     */
    infiniteNextImg() {
        this.effectStyle = `all ${this.speed}s ease-in-out`;
        this.leftPos = -2 * this.sliderImageSizeWithPadding * this.slideImageCount;
        setTimeout((/**
         * @return {?}
         */
        () => {
            this.effectStyle = 'none';
            for (let i = 0; i < this.slideImageCount; i++) {
                this.imageObj.push(this.imageObj[this.slideImageCount]);
                this.imageObj.shift();
            }
            this.leftPos = -1 * this.sliderImageSizeWithPadding * this.slideImageCount;
        }), this.speed * 1000);
    }
    /**
     * @return {?}
     */
    getVisiableIndex() {
        /** @type {?} */
        const currentIndex = Math.round((Math.abs(this.leftPos) + this.sliderImageWidth) / this.sliderImageWidth);
        if (this.imageObj[currentIndex - 1] && this.imageObj[currentIndex - 1]['index'] !== undefined) {
            this.visiableImageIndex = this.imageObj[currentIndex - 1]['index'];
        }
    }
    /**
     * Disable slider left/right arrow when image moving
     * @return {?}
     */
    sliderArrowDisableTeam() {
        this.sliderNextDisable = true;
        this.sliderPrevDisable = true;
        setTimeout((/**
         * @return {?}
         */
        () => {
            this.nextPrevSliderButtonDisable();
        }), this.speed * 1000);
    }
    /**
     * @return {?}
     */
    nextPrevSliderButtonDisable() {
        this.sliderNextDisable = false;
        this.sliderPrevDisable = false;
        if (!this.infinite) {
            if (this.imageParentDivWidth + this.leftPos <= this.sliderMainDivWidth) {
                this.sliderNextDisable = true;
            }
            if (this.leftPos >= 0) {
                this.sliderPrevDisable = true;
            }
        }
    }
    // for lightbox
    /**
     * @return {?}
     */
    showLightbox() {
        if (this.imageObj.length) {
            this.imageMouseEnterHandler();
            this.ligthboxShow = true;
            this.elRef.nativeElement.ownerDocument.body.style.overflow = 'hidden';
        }
    }
    /**
     * @return {?}
     */
    close() {
        this.ligthboxShow = false;
        this.elRef.nativeElement.ownerDocument.body.style.overflow = '';
        this.lightboxClose.emit();
        this.imageAutoSlide();
    }
    /**
     * @param {?} event
     * @return {?}
     */
    lightboxArrowClickHandler(event) {
        this.lightboxArrowClick.emit(event);
    }
    /**
     * Swipe event handler
     * Reference from https://stackoverflow.com/a/44511007/2067646
     * @param {?} e
     * @param {?} when
     * @return {?}
     */
    swipe(e, when) {
        /** @type {?} */
        const coord = [e.changedTouches[0].pageX, e.changedTouches[0].pageY];
        /** @type {?} */
        const time = new Date().getTime();
        if (when === 'start') {
            this.swipeCoord = coord;
            this.swipeTime = time;
        }
        else if (when === 'end') {
            /** @type {?} */
            const direction = [coord[0] - this.swipeCoord[0], coord[1] - this.swipeCoord[1]];
            /** @type {?} */
            const duration = time - this.swipeTime;
            if (duration < 1000 //
                && Math.abs(direction[0]) > 30 // Long enough
                && Math.abs(direction[0]) > Math.abs(direction[1] * 3)) { // Horizontal enough
                if (direction[0] < 0) {
                    this.next();
                }
                else {
                    this.prev();
                }
            }
        }
    }
}
NgImageSliderComponent.decorators = [
    { type: Component, args: [{
                selector: 'ng-image-slider',
                template: "<div class=\"ng-image-slider\" [ngStyle]=\"{'height':sliderImageHeight+'px'}\">\n    <div class=\"ng-image-slider-container\">\n        <div class=\"main\"\n            [ngStyle]=\"{'height':sliderImageHeight+'px'}\"\n            #sliderMain>\n            <div class=\"main-inner\"\n                *ngIf=\"imageObj.length\"\n                [ngClass]=\"{'with-ng-main-pagination': paginationShow}\"\n                [ngStyle]=\"{'margin-left':leftPos+'px', 'width':imageParentDivWidth+'px', 'transition': effectStyle}\"\n                (touchstart)=\"swipe($event, 'start')\"\n                (touchend)=\"swipe($event, 'end')\">\n                <div *ngFor=\"let img of imageObj; let i = index\"\n                    [ngClass]=\"{'image-popup': imagePopup, 'selected-image': activeImageIndex == i}\"\n                    [ngStyle]=\"{'width':sliderImageWidth+'px', 'margin-left':imageMargin+'px', 'margin-right':imageMargin+'px'}\"\n                    class=\"img-div\"\n                    (click)=\"imageOnClick(img.index)\"\n                    (mouseenter)=\"stopSlideOnHover && imageMouseEnterHandler()\"\n                    (mouseleave)=\"stopSlideOnHover && imageAutoSlide()\"\n                    #imageDiv>\n                    <custom-img [imageUrl]=\"img?.thumbImage || img?.posterImage || img?.video\"\n                        [isVideo]=\"!!(img?.posterImage || img?.video)\"\n                        [alt]=\"img?.alt || img?.title || ''\"\n                        [title]=\"img?.title || img?.alt || ''\"\n                        [direction]=\"textDirection\"\n                        [ratio]=\"manageImageRatio\">\n                    </custom-img>\n                    <div [dir]=\"textDirection\" class=\"caption\" *ngIf=\"img?.title\">{{ img?.title }}</div>\n                </div>\n            </div>\n            <div class=\"ng-image-slider-error\"\n                *ngIf=\"!imageObj.length\">\n                <span class=\"ng-image-slider-loader\"></span>\n            </div>\n            <a *ngIf=\"showArrowButton && imageObj.length > 1\"\n                [ngClass]=\"{'disable': sliderPrevDisable}\"\n                class=\"prev icons prev-icon\"\n                (click)=\"prev()\"\n                (mouseenter)=\"stopSlideOnHover && imageMouseEnterHandler()\"\n                (mouseleave)=\"stopSlideOnHover && imageAutoSlide()\">&lsaquo;</a>\n            <a *ngIf=\"showArrowButton && imageObj.length > 1\"\n                [ngClass]=\"{'disable': sliderNextDisable}\"\n                class=\"next icons next-icon\"\n                (click)=\"next()\"\n                (mouseenter)=\"imageMouseEnterHandler()\"\n                (mouseleave)=\"imageAutoSlide()\">&rsaquo;</a>\n        </div>\n        <div *ngIf=\"imageObj.length && paginationShow\" class=\"ng-main-pagination\">{{visiableImageIndex + 1}} of {{totalImages}}</div>\n    </div>\n</div>\n<div *ngIf=\"ligthboxShow\">\n    <slider-lightbox\n        [paginationShow]=\"paginationShow\"\n        [showVideoControls]=\"showVideoControls\"\n        [arrowKeyMove]=\"arrowKeyMove\"\n        [images]=\"ligthboxImageObj\"\n        [infinite]=\"infinite\"\n        [animationSpeed]=\"speed\"\n        [imageIndex]=\"activeImageIndex\"\n        [show]=\"ligthboxShow\"\n        [direction]=\"textDirection\"\n        [videoAutoPlay]=\"videoAutoPlay\"\n        (prevImage)=\"lightboxArrowClickHandler($event)\"\n        (nextImage)=\"lightboxArrowClickHandler($event)\"\n        (close)=\"close()\">\n    </slider-lightbox>\n</div>",
                encapsulation: ViewEncapsulation.None,
                styles: [".ng-image-slider{display:inline-block;position:relative;width:100%}.ng-image-slider .ng-image-slider-container .main{overflow:hidden;position:absolute;height:200px;width:100%}.ng-image-slider .ng-image-slider-container .main .main-inner{width:1760px;padding:0;height:100%}.ng-image-slider .ng-image-slider-container .main .main-inner.with-ng-main-pagination{height:calc(100% - 30px)}.ng-image-slider .ng-image-slider-container .main .main-inner .full-screen{background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAAF+klEQVRoge2Yz28UyRXHv6+q50d7ftqDl42wrU1QFIXVkuAZD5pEzoYrihIhuERw2D8gl1UOKFeiaBfBIZGQIkVKGHGIQHsmspQoillgBfE4vpgQy4pFTIAdPB6Pe365u7peDsx4Z8z0/GDtS3Y+Uh+66vWr963u11X1gCFDhgz5qiEymYy5X86oW2c6nU4w8zcAxJhZaa2tZh8zK8MwLK11XAgRdF3360KIdxYWFn7VzWcqlfoJM38C4B8ASgC2WrpNZg4CgBCCAPiYeZOIfrOwsPC3Tv4Mr4GOHz8ecl13JRQKfS6ldJVSkpnJcZwQABARGYZRJiImIg4Gg/VCoTABoKsAZqZIJPKvy5cvjxQKBVEqlcJ7bUzTlOFw2ACA27dv6/n5+Z8BGEyAaZphpZR/fn7+290CavLkyZMnZ8+eVb3smNk1DEOl0+nv9uM3n89/dufOnddENvEUoJQ6YhjGFgDPhzugexkIIfxCiJ52TY4ePRoBEPDq9xTAzEoI4fY7UDAY9HUbqMVvvVwux69du/ZpIpEw4vG4b2JiInL48OF4IpEYk1L6Wu2LxeIOM5ffREBJKRXa237z5s17d+/edV6+fGmUSqVAtVoNO44TUkpFiejTXgLq9fqfiegP169f/xYRjTHzKBFpAAzAPX369L1Lly79sGlfKBRsIrK8/HUVoLWOtLY9f/786dWrV98D8DEzbwghiq7rFqWUm1LKlw8ePPhvLwHLy8s2PBJ9enr6R/fv3/9la9vm5qZi5uLAApaWlraTyaTftm3H7/f7AMC2bReAlcvlPuoV6JsghBBSyrb8KBaLmog8BYgu/jSAsmVZu9+fbdsKQN95MShEVK3Vam15VKlUGEDN6xnPN9BAK6V2f42FQqECQH6pKLuglKo015m9cXg900sAM/PuzdbW1g5eJduBIIQoa60H2mb0EtBGuVxW6PI6vyxSyrLruv7WNq01iMhz0np+Qo8ePVq3bbsOACsrK1Uiqu5DrF5sA4icOXPms3A47FarVfnixYtJZvZc4btu5qanp28Q0ffxSmgAwCYz/25xcfHX+xv3F8zMzHxPa/1NZg4IIbYBOMz8l1wuVzqoMYcMGTLkK0zXdeDkyZMTWmu/67phrXXNcZzny8vLnoeL/eDEiRM/kFJ+wMzNk6AiomWvYoGngFQq9VNm/r1hGBtSSsd1XZ9SalxKeezhw4drBxI9gGQy+dvJycnvnDt3jqWUtLGxobLZ7GypVAqurq7u7LXvdqB569ixYw9v3LjxfrMtk8msKaXGARyYACIKz87O2ufPn38feLUXymaznvbdzgOvYRiGo7Ue5JA/MMwcCoVCr30Z4+PjHWPtKoCI2hwZhmELIQ5UAIBwLBbre5fsKYCZCXv2/qZp1luS60Bg5lAikdjdUjfmkCuVysBvwBcIBNoEhMNhh5k7nZj2DSIKRCIRX8s9AFRM0+w4cZ6vioii8Xi8TQAzY5CiVD9kMhmzXq+PGoYx6rruGICo67qVVhshhLWzsxMF8Pne57t9a7FYLNaWA1NTU/ba2tovpqenf0xERSIqNkoeRQD/zuVyf0IfR85UKvUhM38IYNy27aAQoiaE2BgZGdmampp6kU6n0632Pp+vqpSKdfLVVcDo6GibgCtXrszmcrl/Pnv27O319fXRp0+futvb22RZllhZWXknmUz+PJfLfdJLADN/cPHixfVTp04FI5EIBwIBE8Bk43oNv99fq9VqgwsYGxtr6xdCiJmZmXc7GV+4cOHe48eP3+4VfAN15MiRkUOHDo33YyyldKWUHXPAM4mJqJ7P53tWm5s4jiPQ/4Gfte4/larVahTAfzr1dVuJC/l8/i3LsrZ1YzTLsqpa693CVjQaDRGRME0z2Kgc9Pv/ltlsdvvWrVvzlmV1nES/369N0wQzw7bt48zcsT7a7S/017m5uTNzc3NBAH4AFQCtNZsKgHqjzQcgxcx/7FPA35eWlhSA1Ubl2Wn4aI4tAUQbt1Vm/mhxcXG1T99vhEgmkyeTyeTXDnKQIUOG/B/yP/QEm5iXakbiAAAAAElFTkSuQmCC) 0 0/40px 40px no-repeat;position:absolute;z-index:8;display:block;height:40px;width:40px;top:4px;right:8px;opacity:.4;transition:.5s ease-in-out;cursor:pointer}.ng-image-slider .ng-image-slider-container .main .main-inner .img-div{width:205px;height:100%;margin-right:3px;margin-left:3px;position:relative;border-radius:5px;display:inline-block;box-shadow:inset 0 0 1px rgba(0,0,0,.24),0 0 2px rgba(0,0,0,.12)}.ng-image-slider .ng-image-slider-container .main .main-inner .img-div.image-popup{cursor:pointer}.ng-image-slider .ng-image-slider-container .main .main-inner .img-div img,.ng-image-slider .ng-image-slider-container .main .main-inner .img-div video{position:absolute;top:0;bottom:0;margin:auto;height:100%;width:100%;left:0;right:0;border-radius:5px}.ng-image-slider .ng-image-slider-container .main .main-inner .img-div img.ratio,.ng-image-slider .ng-image-slider-container .main .main-inner .img-div video.ratio{width:auto;height:auto;max-width:100%;max-height:100%}.ng-image-slider .ng-image-slider-container .main .main-inner .img-div .youtube-icon{background:url(data:image/png;base64,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) center center/140px 80px no-repeat;position:absolute;z-index:6;display:block;height:100%;width:100%;top:0;left:0}.ng-image-slider .ng-image-slider-container .main .main-inner .img-div .caption{position:absolute;bottom:0;padding:5px;color:#fff;background-image:linear-gradient(to right,rgba(0,0,0,.1),rgba(0,0,0,.25),rgba(0,0,0,.5),rgba(0,0,0,.25),rgba(0,0,0,.1));width:100%;text-align:center;box-sizing:border-box;border-radius:0 0 5px 5px}.ng-image-slider .ng-image-slider-container .main .main-inner:hover .full-screen{transition:.5s ease-in-out;opacity:1}.ng-image-slider .ng-image-slider-container .main .next,.ng-image-slider .ng-image-slider-container .main .prev{position:absolute;right:10px;top:50%;background-color:#fff;border-radius:50%;cursor:pointer;margin-top:-16px;outline:0;width:35px;height:35px;font-size:35px;line-height:30px;z-index:8;transition:.5s ease-in-out;text-align:center}.ng-image-slider .ng-image-slider-container .main .next:hover,.ng-image-slider .ng-image-slider-container .main .prev:hover{background-color:#d4cdcd;background-position:-192px -415px}.ng-image-slider .ng-image-slider-container .main .next.disable,.ng-image-slider .ng-image-slider-container .main .prev.disable{color:#bbb;background-color:#fff;opacity:.5;cursor:default}.ng-image-slider .ng-image-slider-container .main .prev{left:10px}.ng-image-slider .ng-image-slider-container .main .prev:hover{background-position:-194px -450px}.ng-image-slider .ng-image-slider-container .ng-main-pagination{background-color:inherit;color:inherit;position:absolute;height:30px;width:calc(100% - 6px);text-align:center;bottom:0;font-size:16px;line-height:30px;border-radius:0 0 5px 5px;margin:0 3px}.ng-image-slider .ng-image-slider-error{height:100%;position:relative;display:flex;justify-content:center;align-items:center}.ng-image-slider .ng-image-slider-error .ng-image-slider-loader{background-image:url(data:image/gif;base64,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);background-repeat:no-repeat;background-position:center center;background-size:25px 25px;width:25px;height:25px}@media (max-width:1199px){.ng-image-slider .ng-image-slider-container .main .main-inner .img-div{width:170px;max-width:100%}}@media (max-width:991px){.ng-image-slider .ng-image-slider-container .main .main-inner .img-div{width:297px;max-width:100%}}@media (max-width:768px){.ng-image-slider .ng-image-slider-container .main .main-inner .img-div{width:247px;max-width:100%}}@media (max-width:576px){.ng-image-slider .ng-image-slider-container .main .main-inner .img-div{width:350px;max-width:100%}}.ng-image-fullscreen-view{position:fixed;z-index:1031;background-color:rgba(0,0,0,.6);width:100%;height:100%;top:0;overflow:hidden;transition:.5s ease-in-out;left:0;text-align:center}.ng-image-fullscreen-view.image-fullview-hide{display:none!important}.ng-image-fullscreen-view .lightbox-wrapper{position:fixed;top:0;left:0;width:100%;height:100%;background-color:#1f1f1f;transition:.5s;display:flex;justify-content:center;align-items:center}.ng-image-fullscreen-view .lightbox-wrapper.ng-ligthbox-pagination{height:calc(100% - 30px)}.ng-image-fullscreen-view .lightbox-wrapper .lightbox-div{width:100%;height:100%;border:1px solid rgba(0,0,0,.35);position:relative;overflow:hidden}.ng-image-fullscreen-view .lightbox-wrapper .lightbox-div .pre-loader{background-color:inherit;width:100%;height:100%}.ng-image-fullscreen-view .lightbox-wrapper .lightbox-div .pre-loader .mnml-spinner{background-image:url(data:image/gif;base64,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);background-repeat:no-repeat;background-position:center center;width:100%;height:100%}.ng-image-fullscreen-view .lightbox-wrapper .lightbox-div .lightbox-image-main{display:grid;grid-template-columns:repeat(6,1fr);grid-template-rows:100%;grid-column-gap:0;height:100%}.ng-image-fullscreen-view .lightbox-wrapper .lightbox-div .lightbox-image-main .lightbox-image{width:1299px;height:100%;position:relative}.ng-image-fullscreen-view .lightbox-wrapper .lightbox-div .lightbox-image-main .lightbox-image .custom-image-main{background-image:url(data:image/gif;base64,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);background-repeat:no-repeat;background-position:center center;width:100%;height:100%}.ng-image-fullscreen-view .lightbox-wrapper .lightbox-div .lightbox-image-main .lightbox-image.ng-image-slider-show{opacity:1;display:block}.ng-image-fullscreen-view .lightbox-wrapper .lightbox-div .lightbox-image-main .lightbox-image.ng-image-slider-hide{opacity:0;display:none}.ng-image-fullscreen-view .lightbox-wrapper .lightbox-div .lightbox-image-main .lightbox-image .custom-image-main img{transition:.5s ease-in-out;width:auto;height:auto;max-height:100%;max-width:100%;position:absolute;z-index:11;top:0;bottom:0;margin:auto;left:0;right:0}.ng-image-fullscreen-view .lightbox-wrapper .lightbox-div .lightbox-image-main .lightbox-image .custom-image-main iframe,.ng-image-fullscreen-view .lightbox-wrapper .lightbox-div .lightbox-image-main .lightbox-image .custom-image-main video{top:0;left:0;right:0;bottom:0;margin:auto;width:100%;height:100%;border:0}.ng-image-fullscreen-view .lightbox-wrapper .lightbox-div .caption{position:absolute;z-index:11;top:0;margin:auto;padding:5px;color:#fff;background-color:rgba(0,0,0,.35);max-width:100%;left:0;right:0}.ng-image-fullscreen-view .lightbox-wrapper .lightbox-div .caption.show{display:block}.ng-image-fullscreen-view .lightbox-wrapper .lightbox-div .caption.hide{display:none}.ng-image-fullscreen-view .lightbox-wrapper .lightbox-div .next,.ng-image-fullscreen-view .lightbox-wrapper .lightbox-div .prev{position:absolute;right:10px;top:50%;background-color:#fff;border-radius:50%;cursor:pointer;margin-top:-16px;width:38px;height:38px;font-size:35px;z-index:12;line-height:30px;outline:0;color:#000;transition:.3s ease-in-out}.ng-image-fullscreen-view .lightbox-wrapper .lightbox-div .next:hover,.ng-image-fullscreen-view .lightbox-wrapper .lightbox-div .prev:hover{background-color:#d4cdcd}.ng-image-fullscreen-view .lightbox-wrapper .lightbox-div .next.disable,.ng-image-fullscreen-view .lightbox-wrapper .lightbox-div .prev.disable{color:#bbb;background-color:#fff}.ng-image-fullscreen-view .lightbox-wrapper .lightbox-div .prev{left:10px}.ng-image-fullscreen-view .lightbox-wrapper .close{background-image:url(data:image/png;base64,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);background-repeat:no-repeat;background-position:center center;background-size:32px;position:absolute;top:10px;right:10px;color:#000;background-color:#fff;padding:0;opacity:1;border-radius:50%;height:36px;width:36px;z-index:12;cursor:pointer;transition:.2s}.ng-image-fullscreen-view .lightbox-wrapper.error-msg{background-image:none}.ng-image-fullscreen-view .invalid-msg{color:#fff;font-size:18px;position:absolute;top:45%;left:45%}.ng-image-fullscreen-view .popup-pagination{background-color:#1f1f1f;color:#fff;position:absolute;height:30px;width:100%;text-align:center;bottom:0;font-size:16px;line-height:30px}@media (max-width:768px){.ng-image-fullscreen-view .lightbox-wrapper{width:100%;height:100%}.ng-image-fullscreen-view .lightbox-wrapper.error-msg{background-image:none}}"]
            }] }
];
/** @nocollapse */
NgImageSliderComponent.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: Object, decorators: [{ type: Inject, args: [PLATFORM_ID,] }] },
    { type: NgImageSliderService },
    { type: ElementRef }
];
NgImageSliderComponent.propDecorators = {
    sliderMain: [{ type: ViewChild, args: ['sliderMain', { static: false },] }],
    imageDiv: [{ type: ViewChild, args: ['imageDiv', { static: false },] }],
    imageSize: [{ type: Input }],
    infinite: [{ type: Input }],
    imagePopup: [{ type: Input }],
    direction: [{ type: Input }],
    animationSpeed: [{ type: Input }],
    images: [{ type: Input }],
    slideImage: [{ type: Input }],
    autoSlide: [{ type: Input }],
    showArrow: [{ type: Input }],
    videoAutoPlay: [{ type: Input }],
    paginationShow: [{ type: Input }],
    arrowKeyMove: [{ type: Input }],
    manageImageRatio: [{ type: Input }],
    showVideoControls: [{ type: Input }],
    imageClick: [{ type: Output }],
    arrowClick: [{ type: Output }],
    lightboxArrowClick: [{ type: Output }],
    lightboxClose: [{ type: Output }],
    onResize: [{ type: HostListener, args: ['window:resize', ['$event'],] }],
    handleKeyboardEvent: [{ type: HostListener, args: ['document:keyup', ['$event'],] }]
};
if (false) {
    /** @type {?} */
    NgImageSliderComponent.prototype.sliderMainDivWidth;
    /** @type {?} */
    NgImageSliderComponent.prototype.imageParentDivWidth;
    /** @type {?} */
    NgImageSliderComponent.prototype.imageObj;
    /** @type {?} */
    NgImageSliderComponent.prototype.ligthboxImageObj;
    /** @type {?} */
    NgImageSliderComponent.prototype.totalImages;
    /** @type {?} */
    NgImageSliderComponent.prototype.leftPos;
    /** @type {?} */
    NgImageSliderComponent.prototype.effectStyle;
    /** @type {?} */
    NgImageSliderComponent.prototype.speed;
    /** @type {?} */
    NgImageSliderComponent.prototype.sliderPrevDisable;
    /** @type {?} */
    NgImageSliderComponent.prototype.sliderNextDisable;
    /** @type {?} */
    NgImageSliderComponent.prototype.slideImageCount;
    /** @type {?} */
    NgImageSliderComponent.prototype.sliderImageWidth;
    /** @type {?} */
    NgImageSliderComponent.prototype.sliderImageReceivedWidth;
    /** @type {?} */
    NgImageSliderComponent.prototype.sliderImageHeight;
    /** @type {?} */
    NgImageSliderComponent.prototype.sliderImageReceivedHeight;
    /** @type {?} */
    NgImageSliderComponent.prototype.sliderImageSizeWithPadding;
    /** @type {?} */
    NgImageSliderComponent.prototype.autoSlideCount;
    /** @type {?} */
    NgImageSliderComponent.prototype.stopSlideOnHover;
    /** @type {?} */
    NgImageSliderComponent.prototype.autoSlideInterval;
    /** @type {?} */
    NgImageSliderComponent.prototype.showArrowButton;
    /** @type {?} */
    NgImageSliderComponent.prototype.textDirection;
    /** @type {?} */
    NgImageSliderComponent.prototype.imageMargin;
    /**
     * @type {?}
     * @private
     */
    NgImageSliderComponent.prototype.swipeCoord;
    /**
     * @type {?}
     * @private
     */
    NgImageSliderComponent.prototype.swipeTime;
    /** @type {?} */
    NgImageSliderComponent.prototype.sliderMain;
    /** @type {?} */
    NgImageSliderComponent.prototype.imageDiv;
    /** @type {?} */
    NgImageSliderComponent.prototype.infinite;
    /** @type {?} */
    NgImageSliderComponent.prototype.imagePopup;
    /** @type {?} */
    NgImageSliderComponent.prototype.images;
    /** @type {?} */
    NgImageSliderComponent.prototype.videoAutoPlay;
    /** @type {?} */
    NgImageSliderComponent.prototype.paginationShow;
    /** @type {?} */
    NgImageSliderComponent.prototype.arrowKeyMove;
    /** @type {?} */
    NgImageSliderComponent.prototype.manageImageRatio;
    /** @type {?} */
    NgImageSliderComponent.prototype.showVideoControls;
    /** @type {?} */
    NgImageSliderComponent.prototype.imageClick;
    /** @type {?} */
    NgImageSliderComponent.prototype.arrowClick;
    /** @type {?} */
    NgImageSliderComponent.prototype.lightboxArrowClick;
    /** @type {?} */
    NgImageSliderComponent.prototype.lightboxClose;
    /** @type {?} */
    NgImageSliderComponent.prototype.ligthboxShow;
    /** @type {?} */
    NgImageSliderComponent.prototype.activeImageIndex;
    /** @type {?} */
    NgImageSliderComponent.prototype.visiableImageIndex;
    /**
     * @type {?}
     * @private
     */
    NgImageSliderComponent.prototype.cdRef;
    /**
     * @type {?}
     * @private
     */
    NgImageSliderComponent.prototype.platformId;
    /** @type {?} */
    NgImageSliderComponent.prototype.imageSliderService;
    /**
     * @type {?}
     * @private
     */
    NgImageSliderComponent.prototype.elRef;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctaW1hZ2Utc2xpZGVyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25nLWltYWdlLXNsaWRlci8iLCJzb3VyY2VzIjpbImxpYi9uZy1pbWFnZS1zbGlkZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUNILGlCQUFpQixFQUNqQixTQUFTLEVBUVQsS0FBSyxFQUNMLE1BQU0sRUFDTixZQUFZLEVBQ1osaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxZQUFZLEVBQ1osV0FBVyxFQUNYLE1BQU0sRUFDTixVQUFVLEVBQ2IsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFFLGlCQUFpQixFQUFvQixNQUFNLGlCQUFpQixDQUFDO0FBQ3RFLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLDJCQUEyQixDQUFDOztNQUUzRCx3QkFBd0IsR0FBRyxNQUFNOztNQUNuQyx3QkFBd0IsR0FBRyxVQUFVO0FBUXpDLE1BQU0sT0FBTyxzQkFBc0I7Ozs7Ozs7SUF1SS9CLFlBQ1ksS0FBd0IsRUFDSCxVQUFrQixFQUN4QyxrQkFBd0MsRUFDdkMsS0FBaUI7SUFDekIsc0RBQXNEOztRQUo5QyxVQUFLLEdBQUwsS0FBSyxDQUFtQjtRQUNILGVBQVUsR0FBVixVQUFVLENBQVE7UUFDeEMsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUFzQjtRQUN2QyxVQUFLLEdBQUwsS0FBSyxDQUFZOztRQXpJN0IsdUJBQWtCLEdBQVcsQ0FBQyxDQUFDO1FBQy9CLHdCQUFtQixHQUFXLENBQUMsQ0FBQztRQUNoQyxhQUFRLEdBQWtCLEVBQUUsQ0FBQztRQUM3QixxQkFBZ0IsR0FBa0IsRUFBRSxDQUFDO1FBQ3JDLGdCQUFXLEdBQVcsQ0FBQyxDQUFDO1FBQ3hCLFlBQU8sR0FBVyxDQUFDLENBQUM7UUFDcEIsZ0JBQVcsR0FBVyxvQkFBb0IsQ0FBQztRQUMzQyxVQUFLLEdBQVcsQ0FBQyxDQUFDLENBQUMsMEJBQTBCOztRQUM3QyxzQkFB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QU07eUJBQ04sTUFBTTtpQ0FDTixNQUFNOzRCQUNOLE1BQU07dUJBT04sWUFBWSxTQUFDLGVBQWUsRUFBRSxDQUFDLFFBQVEsQ0FBQztrQ0FJeEMsWUFBWSxTQUFDLGdCQUFnQixFQUFFLENBQUMsUUFBUSxDQUFDOzs7O0lBcEgxQyxvREFBK0I7O0lBQy9CLHFEQUFnQzs7SUFDaEMsMENBQTZCOztJQUM3QixrREFBcUM7O0lBQ3JDLDZDQUF3Qjs7SUFDeEIseUNBQW9COztJQUNwQiw2Q0FBMkM7O0lBQzNDLHVDQUFrQjs7SUFDbEIsbURBQW1DOztJQUNuQyxtREFBbUM7O0lBQ25DLGlEQUE0Qjs7SUFDNUIsa0RBQStCOztJQUMvQiwwREFBZ0Q7O0lBQ2hELG1EQUFnQzs7SUFDaEMsMkRBQWlEOztJQUNqRCw0REFBaUM7O0lBQ2pDLGdEQUEyQjs7SUFDM0Isa0RBQWlDOztJQUNqQyxtREFBa0I7O0lBQ2xCLGlEQUFnQzs7SUFDaEMsK0NBQThCOztJQUM5Qiw2Q0FBd0I7Ozs7O0lBR3hCLDRDQUFzQzs7Ozs7SUFDdEMsMkNBQTJCOztJQUUzQiw0Q0FBdUQ7O0lBQ3ZELDBDQUFtRDs7SUFtQm5ELDBDQUFtQzs7SUFDbkMsNENBQW9DOztJQWlCcEMsd0NBQW9DOztJQThCcEMsK0NBQXdDOztJQUN4QyxnREFBeUM7O0lBQ3pDLDhDQUFzQzs7SUFDdEMsa0RBQTJDOztJQUMzQyxtREFBMkM7O0lBRzNDLDRDQUFrRDs7SUFDbEQsNENBQWtEOztJQUNsRCxvREFBMEQ7O0lBQzFELCtDQUFxRDs7SUFHckQsOENBQThCOztJQUM5QixrREFBOEI7O0lBQzlCLG9EQUErQjs7Ozs7SUF3QjNCLHVDQUFnQzs7Ozs7SUFDaEMsNENBQStDOztJQUMvQyxvREFBK0M7Ozs7O0lBQy9DLHVDQUF5QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gICAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgQ29tcG9uZW50LFxuICAgIE9uSW5pdCxcbiAgICBPbkNoYW5nZXMsXG4gICAgRG9DaGVjayxcbiAgICBTaW1wbGVDaGFuZ2VzLFxuICAgIFNpbXBsZUNoYW5nZSxcbiAgICBBZnRlclZpZXdJbml0LFxuICAgIE9uRGVzdHJveSxcbiAgICBJbnB1dCxcbiAgICBPdXRwdXQsXG4gICAgRXZlbnRFbWl0dGVyLFxuICAgIFZpZXdFbmNhcHN1bGF0aW9uLFxuICAgIFZpZXdDaGlsZCxcbiAgICBIb3N0TGlzdGVuZXIsXG4gICAgUExBVEZPUk1fSUQsXG4gICAgSW5qZWN0LFxuICAgIEVsZW1lbnRSZWZcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IGlzUGxhdGZvcm1Ccm93c2VyLCBpc1BsYXRmb3JtU2VydmVyIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IE5nSW1hZ2VTbGlkZXJTZXJ2aWNlIH0gZnJvbSAnLi9uZy1pbWFnZS1zbGlkZXIuc2VydmljZSc7XG5cbmNvbnN0IE5FWFRfQVJST1dfQ0xJQ0tfTUVTU0FHRSA9ICduZXh0JyxcbiAgICBQUkVWX0FSUk9XX0NMSUNLX01FU1NBR0UgPSAncHJldmlvdXMnO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ25nLWltYWdlLXNsaWRlcicsXG4gICAgdGVtcGxhdGVVcmw6ICcuL25nLWltYWdlLXNsaWRlci5jb21wb25lbnQuaHRtbCcsXG4gICAgc3R5bGVVcmxzOiBbJy4vbmctaW1hZ2Utc2xpZGVyLmNvbXBvbmVudC5zY3NzJ10sXG4gICAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZVxufSlcbmV4cG9ydCBjbGFzcyBOZ0ltYWdlU2xpZGVyQ29tcG9uZW50IGltcGxlbWVudHMgT25DaGFuZ2VzLCBPbkluaXQsIERvQ2hlY2ssIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSB7XG4gICAgLy8gZm9yIHNsaWRlclxuICAgIHNsaWRlck1haW5EaXZXaWR0aDogbnVtYmVyID0gMDtcbiAgICBpbWFnZVBhcmVudERpdldpZHRoOiBudW1iZXIgPSAwO1xuICAgIGltYWdlT2JqOiBBcnJheTxvYmplY3Q+ID0gW107XG4gICAgbGlndGhib3hJbWFnZU9iajogQXJyYXk8b2JqZWN0PiA9IFtdO1xuICAgIHRvdGFsSW1hZ2VzOiBudW1iZXIgPSAwO1xuICAgIGxlZnRQb3M6IG51bWJlciA9IDA7XG4gICAgZWZmZWN0U3R5bGU6IHN0cmluZyA9ICdhbGwgMXMgZWFzZS1pbi1vdXQnO1xuICAgIHNwZWVkOiBudW1iZXIgPSAxOyAvLyBkZWZhdWx0IHNwZWVkIGluIHNlY29uZFxuICAgIHNsaWRlclByZXZEaXNhYmxlOiBib29sZWFuID0gZmFsc2U7XG4gICAgc2xpZGVyTmV4dERpc2FibGU6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBzbGlkZUltYWdlQ291bnQ6IG51bWJlciA9IDE7XG4gICAgc2xpZGVySW1hZ2VXaWR0aDogbnVtYmVyID0gMjA1O1xuICAgIHNsaWRlckltYWdlUmVjZWl2ZWRXaWR0aDogbnVtYmVyIHwgc3RyaW5nID0gMjA1O1xuICAgIHNsaWRlckltYWdlSGVpZ2h0OiBudW1iZXIgPSAyMDA7XG4gICAgc2xpZGVySW1hZ2VSZWNlaXZlZEhlaWdodDogbnVtYmVyIHwgc3RyaW5nID0gMjA1O1xuICAgIHNsaWRlckltYWdlU2l6ZVdpdGhQYWRkaW5nID0gMjExO1xuICAgIGF1dG9TbGlkZUNvdW50OiBudW1iZXIgPSAwO1xuICAgIHN0b3BTbGlkZU9uSG92ZXI6IGJvb2xlYW4gPSB0cnVlO1xuICAgIGF1dG9TbGlkZUludGVydmFsO1xuICAgIHNob3dBcnJvd0J1dHRvbjogYm9vbGVhbiA9IHRydWU7XG4gICAgdGV4dERpcmVjdGlvbjogc3RyaW5nID0gJ2x0cic7XG4gICAgaW1hZ2VNYXJnaW46IG51bWJlciA9IDM7XG5cbiAgICAvLyBmb3Igc3dpcGUgZXZlbnRcbiAgICBwcml2YXRlIHN3aXBlQ29vcmQ/OiBbbnVtYmVyLCBudW1iZXJdO1xuICAgIHByaXZhdGUgc3dpcGVUaW1lPzogbnVtYmVyO1xuXG4gICAgQFZpZXdDaGlsZCgnc2xpZGVyTWFpbicsIHsgc3RhdGljOiBmYWxzZSB9KSBzbGlkZXJNYWluO1xuICAgIEBWaWV3Q2hpbGQoJ2ltYWdlRGl2JywgeyBzdGF0aWM6IGZhbHNlIH0pIGltYWdlRGl2O1xuXG4gICAgLy8gQGlucHV0c1xuICAgIEBJbnB1dCgpXG4gICAgc2V0IGltYWdlU2l6ZShkYXRhKSB7XG4gICAgICAgIGlmIChkYXRhXG4gICAgICAgICAgICAmJiB0eXBlb2YgKGRhdGEpID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgaWYgKGRhdGEuaGFzT3duUHJvcGVydHkoJ3NwYWNlJykgJiYgdHlwZW9mIChkYXRhWydzcGFjZSddKSA9PT0gJ251bWJlcicgJiYgZGF0YVsnc3BhY2UnXSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbWFnZU1hcmdpbiA9IGRhdGFbJ3NwYWNlJ107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eSgnd2lkdGgnKSAmJiAodHlwZW9mIChkYXRhWyd3aWR0aCddKSA9PT0gJ251bWJlcicgfHwgdHlwZW9mIChkYXRhWyd3aWR0aCddKSA9PT0gJ3N0cmluZycpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zbGlkZXJJbWFnZVJlY2VpdmVkV2lkdGggPSBkYXRhWyd3aWR0aCddO1xuICAgICAgICAgICAgICAgIC8vIHRoaXMuc2xpZGVySW1hZ2VTaXplV2l0aFBhZGRpbmcgPSBkYXRhWyd3aWR0aCddICsgKHRoaXMuaW1hZ2VNYXJnaW4gKiAyKTsgLy8gYWRkZWluZyBwYWRkaW5nIHdpdGggaW1hZ2Ugd2lkdGhcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChkYXRhLmhhc093blByb3BlcnR5KCdoZWlnaHQnKSAmJiAodHlwZW9mIChkYXRhWydoZWlnaHQnXSkgPT09ICdudW1iZXInIHx8IHR5cGVvZiAoZGF0YVsnaGVpZ2h0J10pID09PSAnc3RyaW5nJykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNsaWRlckltYWdlUmVjZWl2ZWRIZWlnaHQgPSBkYXRhWydoZWlnaHQnXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBASW5wdXQoKSBpbmZpbml0ZTogYm9vbGVhbiA9IGZhbHNlO1xuICAgIEBJbnB1dCgpIGltYWdlUG9wdXA6IGJvb2xlYW4gPSB0cnVlO1xuICAgIEBJbnB1dCgpXG4gICAgc2V0IGRpcmVjdGlvbihkaXI6IHN0cmluZykge1xuICAgICAgICBpZiAoZGlyKSB7XG4gICAgICAgICAgICB0aGlzLnRleHREaXJlY3Rpb24gPSBkaXI7XG4gICAgICAgIH1cbiAgICB9XG4gICAgQElucHV0KClcbiAgICBzZXQgYW5pbWF0aW9uU3BlZWQoZGF0YTogbnVtYmVyKSB7XG4gICAgICAgIGlmIChkYXRhXG4gICAgICAgICAgICAmJiB0eXBlb2YgKGRhdGEpID09PSAnbnVtYmVyJ1xuICAgICAgICAgICAgJiYgZGF0YSA+PSAwLjFcbiAgICAgICAgICAgICYmIGRhdGEgPD0gNSkge1xuICAgICAgICAgICAgdGhpcy5zcGVlZCA9IGRhdGE7XG4gICAgICAgICAgICB0aGlzLmVmZmVjdFN0eWxlID0gYGFsbCAke3RoaXMuc3BlZWR9cyBlYXNlLWluLW91dGA7XG4gICAgICAgIH1cbiAgICB9XG4gICAgQElucHV0KCkgaW1hZ2VzOiBBcnJheTxvYmplY3Q+ID0gW107XG4gICAgQElucHV0KCkgc2V0IHNsaWRlSW1hZ2UoY291bnQpIHtcbiAgICAgICAgaWYgKGNvdW50ICYmIHR5cGVvZiBjb3VudCA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIHRoaXMuc2xpZGVJbWFnZUNvdW50ID0gTWF0aC5yb3VuZChjb3VudCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgQElucHV0KCkgc2V0IGF1dG9TbGlkZShjb3VudDogYW55KSB7XG4gICAgICAgIGlmIChjb3VudCAmJiAodHlwZW9mIGNvdW50ID09PSAnbnVtYmVyJ1xuICAgICAgICAgICAgfHwgdHlwZW9mIGNvdW50ID09PSAnYm9vbGVhbidcbiAgICAgICAgICAgIHx8IHR5cGVvZiBjb3VudCA9PT0gJ29iamVjdCcpKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGNvdW50ID09PSAnbnVtYmVyJyAmJiBjb3VudCA+PSAxICYmIGNvdW50IDw9IDUpIHtcbiAgICAgICAgICAgICAgICBjb3VudCA9IE1hdGgucm91bmQoY291bnQpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgY291bnQgPT09ICdib29sZWFuJykge1xuICAgICAgICAgICAgICAgIGNvdW50ID0gMTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGNvdW50ID09PSAnb2JqZWN0J1xuICAgICAgICAgICAgICAgICYmIGNvdW50Lmhhc093blByb3BlcnR5KCdpbnRlcnZhbCcpXG4gICAgICAgICAgICAgICAgJiYgTWF0aC5yb3VuZChjb3VudFsnaW50ZXJ2YWwnXSlcbiAgICAgICAgICAgICAgICAmJiBNYXRoLnJvdW5kKGNvdW50WydpbnRlcnZhbCddKSA+PSAxXG4gICAgICAgICAgICAgICAgJiYgTWF0aC5yb3VuZChjb3VudFsnaW50ZXJ2YWwnXSkgPD0gNSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RvcFNsaWRlT25Ib3ZlciA9IGNvdW50Lmhhc093blByb3BlcnR5KCdzdG9wT25Ib3ZlcicpID8gY291bnRbJ3N0b3BPbkhvdmVyJ10gOiB0cnVlO1xuICAgICAgICAgICAgICAgIGNvdW50ID0gTWF0aC5yb3VuZChjb3VudFsnaW50ZXJ2YWwnXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmF1dG9TbGlkZUNvdW50ID0gY291bnQgKiAxMDAwO1xuICAgICAgICB9XG4gICAgfVxuICAgIEBJbnB1dCgpIHNldCBzaG93QXJyb3coZmxhZykge1xuICAgICAgICBpZiAoZmxhZyAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiBmbGFnID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICAgIHRoaXMuc2hvd0Fycm93QnV0dG9uID0gZmxhZztcbiAgICAgICAgfVxuICAgIH1cbiAgICBASW5wdXQoKSB2aWRlb0F1dG9QbGF5OiBib29sZWFuID0gZmFsc2U7XG4gICAgQElucHV0KCkgcGFnaW5hdGlvblNob3c6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBASW5wdXQoKSBhcnJvd0tleU1vdmU6IGJvb2xlYW4gPSB0cnVlO1xuICAgIEBJbnB1dCgpIG1hbmFnZUltYWdlUmF0aW86IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBASW5wdXQoKSBzaG93VmlkZW9Db250cm9sczogYm9vbGVhbiA9IHRydWU7XG5cbiAgICAvLyBAT3V0cHV0c1xuICAgIEBPdXRwdXQoKSBpbWFnZUNsaWNrID0gbmV3IEV2ZW50RW1pdHRlcjxudW1iZXI+KCk7XG4gICAgQE91dHB1dCgpIGFycm93Q2xpY2sgPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZz4oKTtcbiAgICBAT3V0cHV0KCkgbGlnaHRib3hBcnJvd0NsaWNrID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIGxpZ2h0Ym94Q2xvc2UgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcblxuICAgIC8vIGZvciBsaWdodGJveFxuICAgIGxpZ3RoYm94U2hvdzogYm9vbGVhbiA9IGZhbHNlO1xuICAgIGFjdGl2ZUltYWdlSW5kZXg6IG51bWJlciA9IC0xO1xuICAgIHZpc2lhYmxlSW1hZ2VJbmRleDogbnVtYmVyID0gMDtcblxuICAgIEBIb3N0TGlzdGVuZXIoJ3dpbmRvdzpyZXNpemUnLCBbJyRldmVudCddKVxuICAgIG9uUmVzaXplKGV2ZW50KSB7XG4gICAgICAgIHRoaXMuc2V0U2xpZGVyV2lkdGgoKTtcbiAgICB9XG4gICAgQEhvc3RMaXN0ZW5lcignZG9jdW1lbnQ6a2V5dXAnLCBbJyRldmVudCddKVxuICAgIGhhbmRsZUtleWJvYXJkRXZlbnQoZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICAgICAgaWYgKGV2ZW50ICYmIGV2ZW50LmtleSkge1xuICAgICAgICAgICAgaWYgKGV2ZW50LmtleS50b0xvd2VyQ2FzZSgpID09PSAnYXJyb3dyaWdodCcgJiYgIXRoaXMubGlndGhib3hTaG93ICYmIHRoaXMuYXJyb3dLZXlNb3ZlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChldmVudC5rZXkudG9Mb3dlckNhc2UoKSA9PT0gJ2Fycm93bGVmdCcgJiYgIXRoaXMubGlndGhib3hTaG93ICYmIHRoaXMuYXJyb3dLZXlNb3ZlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wcmV2KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChldmVudC5rZXkudG9Mb3dlckNhc2UoKSA9PT0gJ2VzY2FwZScgJiYgdGhpcy5saWd0aGJveFNob3cpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJpdmF0ZSBjZFJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgICAgIEBJbmplY3QoUExBVEZPUk1fSUQpIHByaXZhdGUgcGxhdGZvcm1JZDogT2JqZWN0LFxuICAgICAgICBwdWJsaWMgaW1hZ2VTbGlkZXJTZXJ2aWNlOiBOZ0ltYWdlU2xpZGVyU2VydmljZSxcbiAgICAgICAgcHJpdmF0ZSBlbFJlZjogRWxlbWVudFJlZlxuICAgICAgICAvLyBASW5qZWN0KEVsZW1lbnRSZWYpIHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWZcbiAgICApIHtcbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpIHtcbiAgICAgICAgLy8gQFRPRE86IGZvciBmdXR1cmUgdXNlXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuX2VsZW1lbnRSZWYpXG5cbiAgICAgICAgLy8gZm9yIHNsaWRlclxuICAgICAgICBpZiAodGhpcy5pbmZpbml0ZSkge1xuICAgICAgICAgICAgdGhpcy5lZmZlY3RTdHlsZSA9ICdub25lJztcbiAgICAgICAgICAgIHRoaXMubGVmdFBvcyA9IC0xICogdGhpcy5zbGlkZXJJbWFnZVNpemVXaXRoUGFkZGluZyAqIHRoaXMuc2xpZGVJbWFnZUNvdW50O1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gdGhpcy5zbGlkZUltYWdlQ291bnQ7IGkrKykge1xuICAgICAgICAgICAgICAgIHRoaXMuaW1hZ2VPYmoudW5zaGlmdCh0aGlzLmltYWdlT2JqW3RoaXMuaW1hZ2VPYmoubGVuZ3RoIC0gaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gZm9yIHNsaWRlclxuICAgIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICAgICAgdGhpcy5zZXRTbGlkZXJXaWR0aCgpO1xuICAgICAgICB0aGlzLmNkUmVmLmRldGVjdENoYW5nZXMoKTtcbiAgICAgICAgaWYgKGlzUGxhdGZvcm1Ccm93c2VyKHRoaXMucGxhdGZvcm1JZCkpIHtcbiAgICAgICAgICAgIHRoaXMuaW1hZ2VBdXRvU2xpZGUoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG5nT25EZXN0cm95KCkge1xuICAgICAgICBpZiAodGhpcy5hdXRvU2xpZGVJbnRlcnZhbCkge1xuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLmF1dG9TbGlkZUludGVydmFsKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5saWd0aGJveFNob3cgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICAgICAgaWYgKGNoYW5nZXMuaW1hZ2VzXG4gICAgICAgICAgICAmJiBjaGFuZ2VzLmltYWdlcy5oYXNPd25Qcm9wZXJ0eSgncHJldmlvdXNWYWx1ZScpXG4gICAgICAgICAgICAmJiBjaGFuZ2VzLmltYWdlcy5oYXNPd25Qcm9wZXJ0eSgnY3VycmVudFZhbHVlJylcbiAgICAgICAgICAgICYmIGNoYW5nZXMuaW1hZ2VzLnByZXZpb3VzVmFsdWUgIT0gY2hhbmdlcy5pbWFnZXMuY3VycmVudFZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLnNldFNsaWRlckltYWdlcyhjaGFuZ2VzLmltYWdlcy5jdXJyZW50VmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjaGFuZ2VzICYmIGNoYW5nZXMuaW1hZ2VTaXplKSB7XG4gICAgICAgICAgICBjb25zdCBzaXplOiBTaW1wbGVDaGFuZ2UgPSBjaGFuZ2VzLmltYWdlU2l6ZTtcbiAgICAgICAgICAgIGlmIChzaXplXG4gICAgICAgICAgICAgICAgJiYgc2l6ZS5wcmV2aW91c1ZhbHVlXG4gICAgICAgICAgICAgICAgJiYgc2l6ZS5jdXJyZW50VmFsdWVcbiAgICAgICAgICAgICAgICAmJiBzaXplLnByZXZpb3VzVmFsdWUud2lkdGggJiYgc2l6ZS5wcmV2aW91c1ZhbHVlLmhlaWdodFxuICAgICAgICAgICAgICAgICYmIHNpemUuY3VycmVudFZhbHVlLndpZHRoICYmIHNpemUuY3VycmVudFZhbHVlLmhlaWdodFxuICAgICAgICAgICAgICAgICYmIChzaXplLnByZXZpb3VzVmFsdWUud2lkdGggIT09IHNpemUuY3VycmVudFZhbHVlLndpZHRoXG4gICAgICAgICAgICAgICAgICAgIHx8IHNpemUucHJldmlvdXNWYWx1ZS5oZWlnaHQgIT09IHNpemUuY3VycmVudFZhbHVlLmhlaWdodCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFNsaWRlcldpZHRoKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBuZ0RvQ2hlY2soKSB7XG4gICAgICAgIGlmICh0aGlzLmltYWdlc1xuICAgICAgICAgICAgJiYgdGhpcy5saWd0aGJveEltYWdlT2JqXG4gICAgICAgICAgICAmJiB0aGlzLmltYWdlcy5sZW5ndGggIT09IHRoaXMubGlndGhib3hJbWFnZU9iai5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0U2xpZGVySW1hZ2VzKHRoaXMuaW1hZ2VzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldFNsaWRlckltYWdlcyhpbWdPYmopIHtcbiAgICAgICAgaWYgKGltZ09iaiAmJiBpbWdPYmogaW5zdGFuY2VvZiBBcnJheSAmJiBpbWdPYmoubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aGlzLmltYWdlT2JqID0gaW1nT2JqLm1hcCgoaW1nLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgIGltZ1snaW5kZXgnXSA9IGluZGV4O1xuICAgICAgICAgICAgICAgIHJldHVybiBpbWc7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMubGlndGhib3hJbWFnZU9iaiA9IFsuLi50aGlzLmltYWdlT2JqXTtcbiAgICAgICAgICAgIHRoaXMudG90YWxJbWFnZXMgPSB0aGlzLmltYWdlT2JqLmxlbmd0aDtcbiAgICAgICAgICAgIC8vIHRoaXMuaW1hZ2VQYXJlbnREaXZXaWR0aCA9IGltZ09iai5sZW5ndGggKiB0aGlzLnNsaWRlckltYWdlU2l6ZVdpdGhQYWRkaW5nO1xuICAgICAgICAgICAgdGhpcy5zZXRTbGlkZXJXaWR0aCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0U2xpZGVyV2lkdGgoKSB7XG4gICAgICAgIGlmICh0aGlzLnNsaWRlck1haW5cbiAgICAgICAgICAgICYmIHRoaXMuc2xpZGVyTWFpbi5uYXRpdmVFbGVtZW50XG4gICAgICAgICAgICAmJiB0aGlzLnNsaWRlck1haW4ubmF0aXZlRWxlbWVudC5vZmZzZXRXaWR0aCkge1xuICAgICAgICAgICAgdGhpcy5zbGlkZXJNYWluRGl2V2lkdGggPSB0aGlzLnNsaWRlck1haW4ubmF0aXZlRWxlbWVudC5vZmZzZXRXaWR0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnNsaWRlck1haW5EaXZXaWR0aFxuICAgICAgICAgICAgJiYgdGhpcy5zbGlkZXJJbWFnZVJlY2VpdmVkV2lkdGgpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5zbGlkZXJJbWFnZVJlY2VpdmVkV2lkdGggPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zbGlkZXJJbWFnZVdpZHRoID0gdGhpcy5zbGlkZXJJbWFnZVJlY2VpdmVkV2lkdGg7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiB0aGlzLnNsaWRlckltYWdlUmVjZWl2ZWRXaWR0aCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zbGlkZXJJbWFnZVJlY2VpdmVkV2lkdGguaW5kZXhPZigncHgnKSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2xpZGVySW1hZ2VXaWR0aCA9IHBhcnNlRmxvYXQodGhpcy5zbGlkZXJJbWFnZVJlY2VpdmVkV2lkdGgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5zbGlkZXJJbWFnZVJlY2VpdmVkV2lkdGguaW5kZXhPZignJScpID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zbGlkZXJJbWFnZVdpZHRoID0gKygodGhpcy5zbGlkZXJNYWluRGl2V2lkdGggKiBwYXJzZUZsb2F0KHRoaXMuc2xpZGVySW1hZ2VSZWNlaXZlZFdpZHRoKSkgLyAxMDApLnRvRml4ZWQoMik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChwYXJzZUZsb2F0KHRoaXMuc2xpZGVySW1hZ2VSZWNlaXZlZFdpZHRoKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNsaWRlckltYWdlV2lkdGggPSBwYXJzZUZsb2F0KHRoaXMuc2xpZGVySW1hZ2VSZWNlaXZlZFdpZHRoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAod2luZG93ICYmIHdpbmRvdy5pbm5lckhlaWdodFxuICAgICAgICAgICAgJiYgdGhpcy5zbGlkZXJJbWFnZVJlY2VpdmVkSGVpZ2h0KSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMuc2xpZGVySW1hZ2VSZWNlaXZlZEhlaWdodCA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNsaWRlckltYWdlSGVpZ2h0ID0gdGhpcy5zbGlkZXJJbWFnZVJlY2VpdmVkSGVpZ2h0O1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdGhpcy5zbGlkZXJJbWFnZVJlY2VpdmVkSGVpZ2h0ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnNsaWRlckltYWdlUmVjZWl2ZWRIZWlnaHQuaW5kZXhPZigncHgnKSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2xpZGVySW1hZ2VIZWlnaHQgPSBwYXJzZUZsb2F0KHRoaXMuc2xpZGVySW1hZ2VSZWNlaXZlZEhlaWdodCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnNsaWRlckltYWdlUmVjZWl2ZWRIZWlnaHQuaW5kZXhPZignJScpID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zbGlkZXJJbWFnZUhlaWdodCA9ICsoKHdpbmRvdy5pbm5lckhlaWdodCAqIHBhcnNlRmxvYXQodGhpcy5zbGlkZXJJbWFnZVJlY2VpdmVkSGVpZ2h0KSkgLyAxMDApLnRvRml4ZWQoMik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChwYXJzZUZsb2F0KHRoaXMuc2xpZGVySW1hZ2VSZWNlaXZlZEhlaWdodCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zbGlkZXJJbWFnZUhlaWdodCA9IHBhcnNlRmxvYXQodGhpcy5zbGlkZXJJbWFnZVJlY2VpdmVkSGVpZ2h0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zbGlkZXJJbWFnZVNpemVXaXRoUGFkZGluZyA9IHRoaXMuc2xpZGVySW1hZ2VXaWR0aCArICh0aGlzLmltYWdlTWFyZ2luICogMik7XG4gICAgICAgIHRoaXMuaW1hZ2VQYXJlbnREaXZXaWR0aCA9IHRoaXMuaW1hZ2VPYmoubGVuZ3RoICogdGhpcy5zbGlkZXJJbWFnZVNpemVXaXRoUGFkZGluZztcbiAgICAgICAgaWYgKHRoaXMuaW1hZ2VEaXYgJiYgdGhpcy5pbWFnZURpdi5uYXRpdmVFbGVtZW50ICYmIHRoaXMuaW1hZ2VEaXYubmF0aXZlRWxlbWVudC5vZmZzZXRXaWR0aCkge1xuICAgICAgICAgICAgdGhpcy5sZWZ0UG9zID0gdGhpcy5pbmZpbml0ZSA/IC0xICogdGhpcy5zbGlkZXJJbWFnZVNpemVXaXRoUGFkZGluZyAqIHRoaXMuc2xpZGVJbWFnZUNvdW50IDogMDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm5leHRQcmV2U2xpZGVyQnV0dG9uRGlzYWJsZSgpO1xuICAgIH1cblxuICAgIGltYWdlT25DbGljayhpbmRleCkge1xuICAgICAgICB0aGlzLmFjdGl2ZUltYWdlSW5kZXggPSBpbmRleDtcbiAgICAgICAgaWYgKHRoaXMuaW1hZ2VQb3B1cCkge1xuICAgICAgICAgICAgdGhpcy5zaG93TGlnaHRib3goKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmltYWdlQ2xpY2suZW1pdChpbmRleCk7XG4gICAgfVxuXG4gICAgaW1hZ2VBdXRvU2xpZGUoKSB7XG4gICAgICAgIGlmICh0aGlzLmluZmluaXRlICYmIHRoaXMuYXV0b1NsaWRlQ291bnQgJiYgIXRoaXMubGlndGhib3hTaG93KSB7XG4gICAgICAgICAgICB0aGlzLmF1dG9TbGlkZUludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgICAgICAgfSwgdGhpcy5hdXRvU2xpZGVDb3VudCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpbWFnZU1vdXNlRW50ZXJIYW5kbGVyKCkge1xuICAgICAgICBpZiAodGhpcy5pbmZpbml0ZSAmJiB0aGlzLmF1dG9TbGlkZUNvdW50ICYmIHRoaXMuYXV0b1NsaWRlSW50ZXJ2YWwpIHtcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5hdXRvU2xpZGVJbnRlcnZhbCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcmV2KCkge1xuICAgICAgICBpZiAoIXRoaXMuc2xpZGVyUHJldkRpc2FibGUpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmluZmluaXRlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbmZpbml0ZVByZXZJbWcoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wcmV2SW1nKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuYXJyb3dDbGljay5lbWl0KFBSRVZfQVJST1dfQ0xJQ0tfTUVTU0FHRSk7XG4gICAgICAgICAgICB0aGlzLnNsaWRlckFycm93RGlzYWJsZVRlYW0oKTtcbiAgICAgICAgICAgIHRoaXMuZ2V0VmlzaWFibGVJbmRleCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbmV4dCgpIHtcbiAgICAgICAgaWYgKCF0aGlzLnNsaWRlck5leHREaXNhYmxlKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5pbmZpbml0ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuaW5maW5pdGVOZXh0SW1nKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMubmV4dEltZygpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmFycm93Q2xpY2suZW1pdChORVhUX0FSUk9XX0NMSUNLX01FU1NBR0UpO1xuICAgICAgICAgICAgdGhpcy5zbGlkZXJBcnJvd0Rpc2FibGVUZWFtKCk7XG4gICAgICAgICAgICB0aGlzLmdldFZpc2lhYmxlSW5kZXgoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByZXZJbWcoKSB7XG4gICAgICAgIGlmICgwID49IHRoaXMubGVmdFBvcyArICh0aGlzLnNsaWRlckltYWdlU2l6ZVdpdGhQYWRkaW5nICogdGhpcy5zbGlkZUltYWdlQ291bnQpKSB7XG4gICAgICAgICAgICB0aGlzLmxlZnRQb3MgKz0gdGhpcy5zbGlkZXJJbWFnZVNpemVXaXRoUGFkZGluZyAqIHRoaXMuc2xpZGVJbWFnZUNvdW50O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5sZWZ0UG9zID0gMDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG5leHRJbWcoKSB7XG4gICAgICAgIGlmICgodGhpcy5pbWFnZVBhcmVudERpdldpZHRoICsgdGhpcy5sZWZ0UG9zKSAtIHRoaXMuc2xpZGVyTWFpbkRpdldpZHRoID4gdGhpcy5zbGlkZXJJbWFnZVNpemVXaXRoUGFkZGluZyAqIHRoaXMuc2xpZGVJbWFnZUNvdW50KSB7XG4gICAgICAgICAgICB0aGlzLmxlZnRQb3MgLT0gdGhpcy5zbGlkZXJJbWFnZVNpemVXaXRoUGFkZGluZyAqIHRoaXMuc2xpZGVJbWFnZUNvdW50O1xuICAgICAgICB9IGVsc2UgaWYgKCh0aGlzLmltYWdlUGFyZW50RGl2V2lkdGggKyB0aGlzLmxlZnRQb3MpIC0gdGhpcy5zbGlkZXJNYWluRGl2V2lkdGggPiAwKSB7XG4gICAgICAgICAgICB0aGlzLmxlZnRQb3MgLT0gKHRoaXMuaW1hZ2VQYXJlbnREaXZXaWR0aCArIHRoaXMubGVmdFBvcykgLSB0aGlzLnNsaWRlck1haW5EaXZXaWR0aDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGluZmluaXRlUHJldkltZygpIHtcbiAgICAgICAgdGhpcy5lZmZlY3RTdHlsZSA9IGBhbGwgJHt0aGlzLnNwZWVkfXMgZWFzZS1pbi1vdXRgO1xuICAgICAgICB0aGlzLmxlZnRQb3MgPSAwO1xuXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5lZmZlY3RTdHlsZSA9ICdub25lJztcbiAgICAgICAgICAgIHRoaXMubGVmdFBvcyA9IC0xICogdGhpcy5zbGlkZXJJbWFnZVNpemVXaXRoUGFkZGluZyAqIHRoaXMuc2xpZGVJbWFnZUNvdW50O1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnNsaWRlSW1hZ2VDb3VudDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbWFnZU9iai51bnNoaWZ0KHRoaXMuaW1hZ2VPYmpbdGhpcy5pbWFnZU9iai5sZW5ndGggLSB0aGlzLnNsaWRlSW1hZ2VDb3VudCAtIDFdKTtcbiAgICAgICAgICAgICAgICB0aGlzLmltYWdlT2JqLnBvcCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCB0aGlzLnNwZWVkICogMTAwMCk7XG4gICAgfVxuXG4gICAgaW5maW5pdGVOZXh0SW1nKCkge1xuICAgICAgICB0aGlzLmVmZmVjdFN0eWxlID0gYGFsbCAke3RoaXMuc3BlZWR9cyBlYXNlLWluLW91dGA7XG4gICAgICAgIHRoaXMubGVmdFBvcyA9IC0yICogdGhpcy5zbGlkZXJJbWFnZVNpemVXaXRoUGFkZGluZyAqIHRoaXMuc2xpZGVJbWFnZUNvdW50O1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZWZmZWN0U3R5bGUgPSAnbm9uZSc7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuc2xpZGVJbWFnZUNvdW50OyBpKyspIHtcbiAgICAgICAgICAgICAgICB0aGlzLmltYWdlT2JqLnB1c2godGhpcy5pbWFnZU9ialt0aGlzLnNsaWRlSW1hZ2VDb3VudF0pO1xuICAgICAgICAgICAgICAgIHRoaXMuaW1hZ2VPYmouc2hpZnQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMubGVmdFBvcyA9IC0xICogdGhpcy5zbGlkZXJJbWFnZVNpemVXaXRoUGFkZGluZyAqIHRoaXMuc2xpZGVJbWFnZUNvdW50O1xuICAgICAgICB9LCB0aGlzLnNwZWVkICogMTAwMCk7XG4gICAgfVxuXG4gICAgZ2V0VmlzaWFibGVJbmRleCgpIHtcbiAgICAgICAgY29uc3QgY3VycmVudEluZGV4ID0gTWF0aC5yb3VuZCgoTWF0aC5hYnModGhpcy5sZWZ0UG9zKSArIHRoaXMuc2xpZGVySW1hZ2VXaWR0aCkgLyB0aGlzLnNsaWRlckltYWdlV2lkdGgpO1xuICAgICAgICBpZiAodGhpcy5pbWFnZU9ialtjdXJyZW50SW5kZXggLSAxXSAmJiB0aGlzLmltYWdlT2JqW2N1cnJlbnRJbmRleCAtIDFdWydpbmRleCddICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMudmlzaWFibGVJbWFnZUluZGV4ID0gdGhpcy5pbWFnZU9ialtjdXJyZW50SW5kZXggLSAxXVsnaW5kZXgnXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERpc2FibGUgc2xpZGVyIGxlZnQvcmlnaHQgYXJyb3cgd2hlbiBpbWFnZSBtb3ZpbmdcbiAgICAgKi9cbiAgICBzbGlkZXJBcnJvd0Rpc2FibGVUZWFtKCkge1xuICAgICAgICB0aGlzLnNsaWRlck5leHREaXNhYmxlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5zbGlkZXJQcmV2RGlzYWJsZSA9IHRydWU7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5uZXh0UHJldlNsaWRlckJ1dHRvbkRpc2FibGUoKTtcbiAgICAgICAgfSwgdGhpcy5zcGVlZCAqIDEwMDApO1xuICAgIH1cblxuICAgIG5leHRQcmV2U2xpZGVyQnV0dG9uRGlzYWJsZSgpIHtcbiAgICAgICAgdGhpcy5zbGlkZXJOZXh0RGlzYWJsZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLnNsaWRlclByZXZEaXNhYmxlID0gZmFsc2U7XG4gICAgICAgIGlmICghdGhpcy5pbmZpbml0ZSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuaW1hZ2VQYXJlbnREaXZXaWR0aCArIHRoaXMubGVmdFBvcyA8PSB0aGlzLnNsaWRlck1haW5EaXZXaWR0aCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2xpZGVyTmV4dERpc2FibGUgPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5sZWZ0UG9zID49IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNsaWRlclByZXZEaXNhYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGZvciBsaWdodGJveFxuICAgIHNob3dMaWdodGJveCgpIHtcbiAgICAgICAgaWYgKHRoaXMuaW1hZ2VPYmoubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aGlzLmltYWdlTW91c2VFbnRlckhhbmRsZXIoKTtcbiAgICAgICAgICAgIHRoaXMubGlndGhib3hTaG93ID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuZWxSZWYubmF0aXZlRWxlbWVudC5vd25lckRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNsb3NlKCkge1xuICAgICAgICB0aGlzLmxpZ3RoYm94U2hvdyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmVsUmVmLm5hdGl2ZUVsZW1lbnQub3duZXJEb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gJyc7XG4gICAgICAgIHRoaXMubGlnaHRib3hDbG9zZS5lbWl0KClcbiAgICAgICAgdGhpcy5pbWFnZUF1dG9TbGlkZSgpO1xuICAgIH1cblxuICAgIGxpZ2h0Ym94QXJyb3dDbGlja0hhbmRsZXIoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5saWdodGJveEFycm93Q2xpY2suZW1pdChldmVudCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU3dpcGUgZXZlbnQgaGFuZGxlclxuICAgICAqIFJlZmVyZW5jZSBmcm9tIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS80NDUxMTAwNy8yMDY3NjQ2XG4gICAgICovXG4gICAgc3dpcGUoZTogVG91Y2hFdmVudCwgd2hlbjogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGNvb3JkOiBbbnVtYmVyLCBudW1iZXJdID0gW2UuY2hhbmdlZFRvdWNoZXNbMF0ucGFnZVgsIGUuY2hhbmdlZFRvdWNoZXNbMF0ucGFnZVldO1xuICAgICAgICBjb25zdCB0aW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5cbiAgICAgICAgaWYgKHdoZW4gPT09ICdzdGFydCcpIHtcbiAgICAgICAgICAgIHRoaXMuc3dpcGVDb29yZCA9IGNvb3JkO1xuICAgICAgICAgICAgdGhpcy5zd2lwZVRpbWUgPSB0aW1lO1xuICAgICAgICB9IGVsc2UgaWYgKHdoZW4gPT09ICdlbmQnKSB7XG4gICAgICAgICAgICBjb25zdCBkaXJlY3Rpb24gPSBbY29vcmRbMF0gLSB0aGlzLnN3aXBlQ29vcmRbMF0sIGNvb3JkWzFdIC0gdGhpcy5zd2lwZUNvb3JkWzFdXTtcbiAgICAgICAgICAgIGNvbnN0IGR1cmF0aW9uID0gdGltZSAtIHRoaXMuc3dpcGVUaW1lO1xuXG4gICAgICAgICAgICBpZiAoZHVyYXRpb24gPCAxMDAwIC8vXG4gICAgICAgICAgICAgICAgJiYgTWF0aC5hYnMoZGlyZWN0aW9uWzBdKSA+IDMwIC8vIExvbmcgZW5vdWdoXG4gICAgICAgICAgICAgICAgJiYgTWF0aC5hYnMoZGlyZWN0aW9uWzBdKSA+IE1hdGguYWJzKGRpcmVjdGlvblsxXSAqIDMpKSB7IC8vIEhvcml6b250YWwgZW5vdWdoXG4gICAgICAgICAgICAgICAgaWYgKGRpcmVjdGlvblswXSA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcmV2KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuIl19