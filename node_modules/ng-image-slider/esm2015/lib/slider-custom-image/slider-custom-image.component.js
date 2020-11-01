/**
 * @fileoverview added by tsickle
 * Generated from: lib/slider-custom-image/slider-custom-image.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { NgImageSliderService } from './../ng-image-slider.service';
/** @type {?} */
const youtubeRegExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
/** @type {?} */
const validFileExtensions = ['jpeg', 'jpg', 'gif', 'png'];
/** @type {?} */
const validVideoExtensions = ['mp4'];
export class SliderCustomImageComponent {
    /**
     * @param {?} imageSliderService
     * @param {?} sanitizer
     * @param {?} document
     */
    constructor(imageSliderService, sanitizer, document) {
        this.imageSliderService = imageSliderService;
        this.sanitizer = sanitizer;
        this.YOUTUBE = 'youtube';
        this.IMAGE = 'image';
        this.VIDEO = 'video';
        this.fileUrl = '';
        this.fileExtension = '';
        this.type = this.IMAGE;
        // @inputs
        this.showVideo = false;
        this.videoAutoPlay = false;
        this.showVideoControls = 1;
        this.speed = 1;
        this.isVideo = false;
        this.alt = '';
        this.title = '';
        this.direction = 'ltr';
        this.ratio = false;
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (this.imageUrl
            && this.imageUrl
            && this.imageUrl
            && typeof (this.imageUrl) === 'string'
            && ((changes.imageUrl && changes.imageUrl.firstChange)
                ||
                    (this.videoAutoPlay))) {
            this.setUrl();
        }
    }
    /**
     * @return {?}
     */
    setUrl() {
        /** @type {?} */
        const url = this.imageUrl;
        this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        this.fileExtension = url.split('.').pop().split(/\#|\?/)[0];
        if (this.imageSliderService.base64FileExtension(url)
            && (validFileExtensions.indexOf(this.imageSliderService.base64FileExtension(url).toLowerCase()) > -1
                || validVideoExtensions.indexOf(this.imageSliderService.base64FileExtension(url).toLowerCase()) > -1)) {
            this.fileExtension = this.imageSliderService.base64FileExtension(url);
        }
        // verify for youtube url
        /** @type {?} */
        const match = url.match(youtubeRegExp);
        if (match && match[2].length === 11) {
            if (this.showVideo) {
                this.type = this.YOUTUBE;
                this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`${'https://www.youtube.com/embed/'}${match[2]}${this.videoAutoPlay ? '?autoplay=1&enablejsapi=1' : '?autoplay=0&enablejsapi=1'}${'&controls='}${this.showVideoControls}`);
            }
            else {
                this.type = this.IMAGE;
                this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`https://img.youtube.com/vi/${match[2]}/0.jpg`);
            }
        }
        else if (this.fileExtension && validFileExtensions.indexOf(this.fileExtension.toLowerCase()) > -1) {
            this.type = this.IMAGE;
        }
        else if (this.fileExtension && validVideoExtensions.indexOf(this.fileExtension.toLowerCase()) > -1) {
            this.type = this.VIDEO;
            if (this.videoAutoPlay && document.getElementById(`video_${this.imageIndex}`)) {
                /** @type {?} */
                const videoObj = document.getElementById(`video_${this.imageIndex}`);
                setTimeout((/**
                 * @return {?}
                 */
                () => {
                    videoObj.play();
                }), this.speed * 1000);
            }
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    videoClickHandler(event) {
        if (event && event.srcElement && !this.showVideoControls) {
            if (event.srcElement.paused) {
                event.srcElement.play();
            }
            else {
                event.srcElement.pause();
            }
        }
    }
}
SliderCustomImageComponent.decorators = [
    { type: Component, args: [{
                selector: 'custom-img',
                template: "<div *ngIf=\"fileUrl\" class=\"custom-image-main\">\n    <img class=\"image\"\n        [ngClass]=\"{'ratio': ratio}\"\n        *ngIf=\"type === IMAGE && fileUrl\"\n        [src]=\"fileUrl\"\n        [alt]=\"alt\"\n        [title]=\"title\">\n    <iframe class=\"youtube\"\n        *ngIf=\"type === YOUTUBE && fileUrl\"\n        [src]=\"fileUrl\"\n        frameborder=\"0\"\n        allow=\"autoplay\"\n        allowfullscreen></iframe>\n    <video class=\"video\"\n        [id]=\"'video_' + imageIndex\"\n        [ngClass]=\"{'ratio': ratio}\"\n        (click)=\"videoClickHandler($event)\"\n        [autoplay]=\"videoAutoPlay\"\n        *ngIf=\"type === VIDEO\"\n        type=\"video/mp4\"\n        [attr.controls]=\"showVideoControls ? showVideoControls : null\"\n        controlsList=\"nodownload\">\n        <source [src]=\"fileUrl\" type=\"video/mp4\">\n        Your browser does not support the video tag.\n    </video>\n    <div [dir]=\"direction\" *ngIf=\"!fileUrl\" class=\"invalid-msg\">Invalid file format</div>\n    <span *ngIf=\"type === YOUTUBE || type === VIDEO || isVideo\" class=\"youtube-icon\"></span>\n</div>"
            }] }
];
/** @nocollapse */
SliderCustomImageComponent.ctorParameters = () => [
    { type: NgImageSliderService },
    { type: DomSanitizer },
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] }
];
SliderCustomImageComponent.propDecorators = {
    showVideo: [{ type: Input }],
    videoAutoPlay: [{ type: Input }],
    showVideoControls: [{ type: Input }],
    currentImageIndex: [{ type: Input }],
    imageIndex: [{ type: Input }],
    speed: [{ type: Input }],
    imageUrl: [{ type: Input }],
    isVideo: [{ type: Input }],
    alt: [{ type: Input }],
    title: [{ type: Input }],
    direction: [{ type: Input }],
    ratio: [{ type: Input }]
};
if (false) {
    /** @type {?} */
    SliderCustomImageComponent.prototype.YOUTUBE;
    /** @type {?} */
    SliderCustomImageComponent.prototype.IMAGE;
    /** @type {?} */
    SliderCustomImageComponent.prototype.VIDEO;
    /** @type {?} */
    SliderCustomImageComponent.prototype.fileUrl;
    /** @type {?} */
    SliderCustomImageComponent.prototype.fileExtension;
    /** @type {?} */
    SliderCustomImageComponent.prototype.type;
    /** @type {?} */
    SliderCustomImageComponent.prototype.showVideo;
    /** @type {?} */
    SliderCustomImageComponent.prototype.videoAutoPlay;
    /** @type {?} */
    SliderCustomImageComponent.prototype.showVideoControls;
    /** @type {?} */
    SliderCustomImageComponent.prototype.currentImageIndex;
    /** @type {?} */
    SliderCustomImageComponent.prototype.imageIndex;
    /** @type {?} */
    SliderCustomImageComponent.prototype.speed;
    /** @type {?} */
    SliderCustomImageComponent.prototype.imageUrl;
    /** @type {?} */
    SliderCustomImageComponent.prototype.isVideo;
    /** @type {?} */
    SliderCustomImageComponent.prototype.alt;
    /** @type {?} */
    SliderCustomImageComponent.prototype.title;
    /** @type {?} */
    SliderCustomImageComponent.prototype.direction;
    /** @type {?} */
    SliderCustomImageComponent.prototype.ratio;
    /** @type {?} */
    SliderCustomImageComponent.prototype.imageSliderService;
    /**
     * @type {?}
     * @private
     */
    SliderCustomImageComponent.prototype.sanitizer;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpZGVyLWN1c3RvbS1pbWFnZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZy1pbWFnZS1zbGlkZXIvIiwic291cmNlcyI6WyJsaWIvc2xpZGVyLWN1c3RvbS1pbWFnZS9zbGlkZXItY3VzdG9tLWltYWdlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFDSCxTQUFTLEVBQ1QsS0FBSyxFQUdMLE1BQU0sRUFDVCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDM0MsT0FBTyxFQUFFLFlBQVksRUFBbUIsTUFBTSwyQkFBMkIsQ0FBQztBQUMxRSxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQzs7TUFFOUQsYUFBYSxHQUFHLHNFQUFzRTs7TUFDeEYsbUJBQW1CLEdBQUcsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUM7O01BQ25ELG9CQUFvQixHQUFHLENBQUMsS0FBSyxDQUFDO0FBTWxDLE1BQU0sT0FBTywwQkFBMEI7Ozs7OztJQXNCbkMsWUFDVyxrQkFBd0MsRUFDdkMsU0FBdUIsRUFDYixRQUFRO1FBRm5CLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBc0I7UUFDdkMsY0FBUyxHQUFULFNBQVMsQ0FBYztRQXZCbkMsWUFBTyxHQUFHLFNBQVMsQ0FBQztRQUNwQixVQUFLLEdBQUcsT0FBTyxDQUFDO1FBQ2hCLFVBQUssR0FBRyxPQUFPLENBQUM7UUFDaEIsWUFBTyxHQUFvQixFQUFFLENBQUM7UUFDOUIsa0JBQWEsR0FBRyxFQUFFLENBQUM7UUFDbkIsU0FBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7O1FBR1QsY0FBUyxHQUFZLEtBQUssQ0FBQztRQUMzQixrQkFBYSxHQUFZLEtBQUssQ0FBQztRQUMvQixzQkFBaUIsR0FBVyxDQUFDLENBQUM7UUFHOUIsVUFBSyxHQUFXLENB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QUs7Ozs7SUFuQk4sNkNBQW9COztJQUNwQiwyQ0FBZ0I7O0lBQ2hCLDJDQUFnQjs7SUFDaEIsNkNBQThCOztJQUM5QixtREFBbUI7O0lBQ25CLDBDQUFrQjs7SUFHbEIsK0NBQW9DOztJQUNwQyxtREFBd0M7O0lBQ3hDLHVEQUF1Qzs7SUFDdkMsdURBQW1DOztJQUNuQyxnREFBNEI7O0lBQzVCLDJDQUEyQjs7SUFDM0IsOENBQWtCOztJQUNsQiw2Q0FBeUI7O0lBQ3pCLHlDQUEwQjs7SUFDMUIsMkNBQTRCOztJQUM1QiwrQ0FBbUM7O0lBQ25DLDJDQUFnQzs7SUFHNUIsd0RBQStDOzs7OztJQUMvQywrQ0FBK0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICAgIENvbXBvbmVudCxcbiAgICBJbnB1dCxcbiAgICBPbkNoYW5nZXMsXG4gICAgU2ltcGxlQ2hhbmdlcyxcbiAgICBJbmplY3Rcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBET0NVTUVOVCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBEb21TYW5pdGl6ZXIsIFNhZmVSZXNvdXJjZVVybCB9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInO1xuaW1wb3J0IHsgTmdJbWFnZVNsaWRlclNlcnZpY2UgfSBmcm9tICcuLy4uL25nLWltYWdlLXNsaWRlci5zZXJ2aWNlJztcblxuY29uc3QgeW91dHViZVJlZ0V4cCA9IC9eLiooeW91dHUuYmVcXC98dlxcL3x1XFwvXFx3XFwvfGVtYmVkXFwvfHdhdGNoXFw/dj18XFwmdj18XFw/dj0pKFteI1xcJlxcP10qKS4qLyxcbiAgICB2YWxpZEZpbGVFeHRlbnNpb25zID0gWydqcGVnJywgJ2pwZycsICdnaWYnLCAncG5nJ10sXG4gICAgdmFsaWRWaWRlb0V4dGVuc2lvbnMgPSBbJ21wNCddO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ2N1c3RvbS1pbWcnLFxuICAgIHRlbXBsYXRlVXJsOiAnLi9zbGlkZXItY3VzdG9tLWltYWdlLmNvbXBvbmVudC5odG1sJ1xufSlcbmV4cG9ydCBjbGFzcyBTbGlkZXJDdXN0b21JbWFnZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uQ2hhbmdlcyB7XG4gICAgWU9VVFVCRSA9ICd5b3V0dWJlJztcbiAgICBJTUFHRSA9ICdpbWFnZSc7XG4gICAgVklERU8gPSAndmlkZW8nO1xuICAgIGZpbGVVcmw6IFNhZmVSZXNvdXJjZVVybCA9ICcnO1xuICAgIGZpbGVFeHRlbnNpb24gPSAnJztcbiAgICB0eXBlID0gdGhpcy5JTUFHRTtcblxuICAgIC8vIEBpbnB1dHNcbiAgICBASW5wdXQoKSBzaG93VmlkZW86IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBASW5wdXQoKSB2aWRlb0F1dG9QbGF5OiBib29sZWFuID0gZmFsc2U7XG4gICAgQElucHV0KCkgc2hvd1ZpZGVvQ29udHJvbHM6IG51bWJlciA9IDE7XG4gICAgQElucHV0KCkgY3VycmVudEltYWdlSW5kZXg6IG51bWJlcjtcbiAgICBASW5wdXQoKSBpbWFnZUluZGV4OiBudW1iZXI7XG4gICAgQElucHV0KCkgc3BlZWQ6IG51bWJlciA9IDE7XG4gICAgQElucHV0KCkgaW1hZ2VVcmw7XG4gICAgQElucHV0KCkgaXNWaWRlbyA9IGZhbHNlO1xuICAgIEBJbnB1dCgpIGFsdDogU3RyaW5nID0gJyc7XG4gICAgQElucHV0KCkgdGl0bGU6IFN0cmluZyA9ICcnO1xuICAgIEBJbnB1dCgpIGRpcmVjdGlvbjogc3RyaW5nID0gJ2x0cic7XG4gICAgQElucHV0KCkgcmF0aW86IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwdWJsaWMgaW1hZ2VTbGlkZXJTZXJ2aWNlOiBOZ0ltYWdlU2xpZGVyU2VydmljZSxcbiAgICAgICAgcHJpdmF0ZSBzYW5pdGl6ZXI6IERvbVNhbml0aXplcixcbiAgICAgICAgQEluamVjdChET0NVTUVOVCkgZG9jdW1lbnQpIHtcbiAgICB9XG5cbiAgICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgICAgIGlmICh0aGlzLmltYWdlVXJsXG4gICAgICAgICAgICAmJiB0aGlzLmltYWdlVXJsXG4gICAgICAgICAgICAmJiB0aGlzLmltYWdlVXJsXG4gICAgICAgICAgICAmJiB0eXBlb2YgKHRoaXMuaW1hZ2VVcmwpID09PSAnc3RyaW5nJ1xuICAgICAgICAgICAgJiYgKFxuICAgICAgICAgICAgICAgIChjaGFuZ2VzLmltYWdlVXJsICYmIGNoYW5nZXMuaW1hZ2VVcmwuZmlyc3RDaGFuZ2UpXG4gICAgICAgICAgICAgICAgfHxcbiAgICAgICAgICAgICAgICAodGhpcy52aWRlb0F1dG9QbGF5KVxuICAgICAgICAgICAgICAgKSkge1xuICAgICAgICAgICAgdGhpcy5zZXRVcmwoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldFVybCgpIHtcbiAgICAgICAgY29uc3QgdXJsID0gdGhpcy5pbWFnZVVybDtcbiAgICAgICAgdGhpcy5maWxlVXJsID0gdGhpcy5zYW5pdGl6ZXIuYnlwYXNzU2VjdXJpdHlUcnVzdFJlc291cmNlVXJsKHVybCk7XG4gICAgICAgIHRoaXMuZmlsZUV4dGVuc2lvbiA9IHVybC5zcGxpdCgnLicpLnBvcCgpLnNwbGl0KC9cXCN8XFw/LylbMF07XG4gICAgICAgIGlmICh0aGlzLmltYWdlU2xpZGVyU2VydmljZS5iYXNlNjRGaWxlRXh0ZW5zaW9uKHVybClcbiAgICAgICAgJiYgKHZhbGlkRmlsZUV4dGVuc2lvbnMuaW5kZXhPZih0aGlzLmltYWdlU2xpZGVyU2VydmljZS5iYXNlNjRGaWxlRXh0ZW5zaW9uKHVybCkudG9Mb3dlckNhc2UoKSkgPiAtMSBcbiAgICAgICAgfHwgdmFsaWRWaWRlb0V4dGVuc2lvbnMuaW5kZXhPZih0aGlzLmltYWdlU2xpZGVyU2VydmljZS5iYXNlNjRGaWxlRXh0ZW5zaW9uKHVybCkudG9Mb3dlckNhc2UoKSkgPiAtMSkpIHtcbiAgICAgICAgICAgIHRoaXMuZmlsZUV4dGVuc2lvbiA9IHRoaXMuaW1hZ2VTbGlkZXJTZXJ2aWNlLmJhc2U2NEZpbGVFeHRlbnNpb24odXJsKTtcbiAgICAgICAgfVxuICAgICAgICAvLyB2ZXJpZnkgZm9yIHlvdXR1YmUgdXJsXG4gICAgICAgIGNvbnN0IG1hdGNoID0gdXJsLm1hdGNoKHlvdXR1YmVSZWdFeHApO1xuICAgICAgICBpZiAobWF0Y2ggJiYgbWF0Y2hbMl0ubGVuZ3RoID09PSAxMSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuc2hvd1ZpZGVvKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50eXBlID0gdGhpcy5ZT1VUVUJFO1xuICAgICAgICAgICAgICAgIHRoaXMuZmlsZVVybCA9IHRoaXMuc2FuaXRpemVyLmJ5cGFzc1NlY3VyaXR5VHJ1c3RSZXNvdXJjZVVybChgJHsnaHR0cHM6Ly93d3cueW91dHViZS5jb20vZW1iZWQvJ30ke21hdGNoWzJdfSR7dGhpcy52aWRlb0F1dG9QbGF5ID8gJz9hdXRvcGxheT0xJmVuYWJsZWpzYXBpPTEnIDogJz9hdXRvcGxheT0wJmVuYWJsZWpzYXBpPTEnfSR7JyZjb250cm9scz0nfSR7dGhpcy5zaG93VmlkZW9Db250cm9sc31gKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy50eXBlID0gdGhpcy5JTUFHRTtcbiAgICAgICAgICAgICAgICB0aGlzLmZpbGVVcmwgPSB0aGlzLnNhbml0aXplci5ieXBhc3NTZWN1cml0eVRydXN0UmVzb3VyY2VVcmwoYGh0dHBzOi8vaW1nLnlvdXR1YmUuY29tL3ZpLyR7bWF0Y2hbMl19LzAuanBnYCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5maWxlRXh0ZW5zaW9uICYmIHZhbGlkRmlsZUV4dGVuc2lvbnMuaW5kZXhPZih0aGlzLmZpbGVFeHRlbnNpb24udG9Mb3dlckNhc2UoKSkgPiAtMSkge1xuICAgICAgICAgICAgdGhpcy50eXBlID0gdGhpcy5JTUFHRTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmZpbGVFeHRlbnNpb24gJiYgdmFsaWRWaWRlb0V4dGVuc2lvbnMuaW5kZXhPZih0aGlzLmZpbGVFeHRlbnNpb24udG9Mb3dlckNhc2UoKSkgPiAtMSkge1xuICAgICAgICAgICAgdGhpcy50eXBlID0gdGhpcy5WSURFTztcbiAgICAgICAgICAgIGlmICh0aGlzLnZpZGVvQXV0b1BsYXkgJiYgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYHZpZGVvXyR7dGhpcy5pbWFnZUluZGV4fWApKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdmlkZW9PYmo6YW55ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYHZpZGVvXyR7dGhpcy5pbWFnZUluZGV4fWApO1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB2aWRlb09iai5wbGF5KCk7XG4gICAgICAgICAgICAgICAgfSwgdGhpcy5zcGVlZCAqIDEwMDApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmlkZW9DbGlja0hhbmRsZXIoZXZlbnQpIHtcbiAgICAgICAgaWYgKGV2ZW50ICYmIGV2ZW50LnNyY0VsZW1lbnQgJiYgIXRoaXMuc2hvd1ZpZGVvQ29udHJvbHMpIHtcbiAgICAgICAgICAgIGlmIChldmVudC5zcmNFbGVtZW50LnBhdXNlZCkge1xuICAgICAgICAgICAgICAgIGV2ZW50LnNyY0VsZW1lbnQucGxheSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBldmVudC5zcmNFbGVtZW50LnBhdXNlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=