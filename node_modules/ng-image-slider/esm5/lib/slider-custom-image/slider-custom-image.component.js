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
var youtubeRegExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
/** @type {?} */
var validFileExtensions = ['jpeg', 'jpg', 'gif', 'png'];
/** @type {?} */
var validVideoExtensions = ['mp4'];
var SliderCustomImageComponent = /** @class */ (function () {
    function SliderCustomImageComponent(imageSliderService, sanitizer, document) {
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
    SliderCustomImageComponent.prototype.ngOnChanges = /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
        if (this.imageUrl
            && this.imageUrl
            && this.imageUrl
            && typeof (this.imageUrl) === 'string'
            && ((changes.imageUrl && changes.imageUrl.firstChange)
                ||
                    (this.videoAutoPlay))) {
            this.setUrl();
        }
    };
    /**
     * @return {?}
     */
    SliderCustomImageComponent.prototype.setUrl = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var url = this.imageUrl;
        this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        this.fileExtension = url.split('.').pop().split(/\#|\?/)[0];
        if (this.imageSliderService.base64FileExtension(url)
            && (validFileExtensions.indexOf(this.imageSliderService.base64FileExtension(url).toLowerCase()) > -1
                || validVideoExtensions.indexOf(this.imageSliderService.base64FileExtension(url).toLowerCase()) > -1)) {
            this.fileExtension = this.imageSliderService.base64FileExtension(url);
        }
        // verify for youtube url
        /** @type {?} */
        var match = url.match(youtubeRegExp);
        if (match && match[2].length === 11) {
            if (this.showVideo) {
                this.type = this.YOUTUBE;
                this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl("" + 'https://www.youtube.com/embed/' + match[2] + (this.videoAutoPlay ? '?autoplay=1&enablejsapi=1' : '?autoplay=0&enablejsapi=1') + '&controls=' + this.showVideoControls);
            }
            else {
                this.type = this.IMAGE;
                this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl("https://img.youtube.com/vi/" + match[2] + "/0.jpg");
            }
        }
        else if (this.fileExtension && validFileExtensions.indexOf(this.fileExtension.toLowerCase()) > -1) {
            this.type = this.IMAGE;
        }
        else if (this.fileExtension && validVideoExtensions.indexOf(this.fileExtension.toLowerCase()) > -1) {
            this.type = this.VIDEO;
            if (this.videoAutoPlay && document.getElementById("video_" + this.imageIndex)) {
                /** @type {?} */
                var videoObj_1 = document.getElementById("video_" + this.imageIndex);
                setTimeout((/**
                 * @return {?}
                 */
                function () {
                    videoObj_1.play();
                }), this.speed * 1000);
            }
        }
    };
    /**
     * @param {?} event
     * @return {?}
     */
    SliderCustomImageComponent.prototype.videoClickHandler = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        if (event && event.srcElement && !this.showVideoControls) {
            if (event.srcElement.paused) {
                event.srcElement.play();
            }
            else {
                event.srcElement.pause();
            }
        }
    };
    SliderCustomImageComponent.decorators = [
        { type: Component, args: [{
                    selector: 'custom-img',
                    template: "<div *ngIf=\"fileUrl\" class=\"custom-image-main\">\n    <img class=\"image\"\n        [ngClass]=\"{'ratio': ratio}\"\n        *ngIf=\"type === IMAGE && fileUrl\"\n        [src]=\"fileUrl\"\n        [alt]=\"alt\"\n        [title]=\"title\">\n    <iframe class=\"youtube\"\n        *ngIf=\"type === YOUTUBE && fileUrl\"\n        [src]=\"fileUrl\"\n        frameborder=\"0\"\n        allow=\"autoplay\"\n        allowfullscreen></iframe>\n    <video class=\"video\"\n        [id]=\"'video_' + imageIndex\"\n        [ngClass]=\"{'ratio': ratio}\"\n        (click)=\"videoClickHandler($event)\"\n        [autoplay]=\"videoAutoPlay\"\n        *ngIf=\"type === VIDEO\"\n        type=\"video/mp4\"\n        [attr.controls]=\"showVideoControls ? showVideoControls : null\"\n        controlsList=\"nodownload\">\n        <source [src]=\"fileUrl\" type=\"video/mp4\">\n        Your browser does not support the video tag.\n    </video>\n    <div [dir]=\"direction\" *ngIf=\"!fileUrl\" class=\"invalid-msg\">Invalid file format</div>\n    <span *ngIf=\"type === YOUTUBE || type === VIDEO || isVideo\" class=\"youtube-icon\"></span>\n</div>"
                }] }
    ];
    /** @nocollapse */
    SliderCustomImageComponent.ctorParameters = function () { return [
        { type: NgImageSliderService },
        { type: DomSanitizer },
        { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] }
    ]; };
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
    return SliderCustomImageComponent;
}());
export { SliderCustomImageComponent };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpZGVyLWN1c3RvbS1pbWFnZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZy1pbWFnZS1zbGlkZXIvIiwic291cmNlcyI6WyJsaWIvc2xpZGVyLWN1c3RvbS1pbWFnZS9zbGlkZXItY3VzdG9tLWltYWdlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFDSCxTQUFTLEVBQ1QsS0FBSyxFQUdMLE1BQU0sRUFDVCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDM0MsT0FBTyxFQUFFLFlBQVksRUFBbUIsTUFBTSwyQkFBMkIsQ0FBQztBQUMxRSxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQzs7SUFFOUQsYUFBYSxHQUFHLHNFQUFzRTs7SUFDeEYsbUJBQW1CLEdBQUcsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUM7O0lBQ25ELG9CQUFvQixHQUFHLENBQUMsS0FBSyxDQUFDO0FBRWxDO0lBMEJJLG9DQUNXLGtCQUF3QyxFQUN2QyxTQUF1QixFQUNiLFFBQVE7UUFGbkIsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUFzQjtRQUN2QyxjQUFTLEdBQVQsU0FBUyxDQUFjO1FBdkJuQyxZQUFPLEdBQUcsU0FBUyxDQUFDO1FBQ3BCLFVBQUssR0FBRyxPQUFPLENBQUM7UUFDaEIsVUFBSyxHQUFHLE9BQU8sQ0FBQztRQUNoQixZQUFPLEdBQW9CLEVBQUUsQ0FBQztRQUM5QixrQkFBYSxHQUFHLEVBQUUsQ0FBQztRQUNuQixTQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQzs7UUFHVCxjQUFTLEdBQVksS0FBSyxDQUFDO1FBQzNCLGtCQUFhLEdBQVksS0FBSyxDQUFDO1FBQy9CLHNCQUFpQixHQUFXLENBQUMsQ0FBQztRQUc5QixVQUFLLEdBQVcsQ0FBQyxDQUFDO1FBRWxCLFlBQU8sR0FB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QUFBLEFBdkZELElBdUZDO1NBbkZZLDBCQUEwQjs7O0lBQ25DLDZDQUFvQjs7SUFDcEIsMkNBQWdCOztJQUNoQiwyQ0FBZ0I7O0lBQ2hCLDZDQUE4Qjs7SUFDOUIsbURBQW1COztJQUNuQiwwQ0FBa0I7O0lBR2xCLCtDQUFvQzs7SUFDcEMsbURBQXdDOztJQUN4Qyx1REFBdUM7O0lBQ3ZDLHVEQUFtQzs7SUFDbkMsZ0RBQTRCOztJQUM1QiwyQ0FBMkI7O0lBQzNCLDhDQUFrQjs7SUFDbEIsNkNBQXlCOztJQUN6Qix5Q0FBMEI7O0lBQzFCLDJDQUE0Qjs7SUFDNUIsK0NBQW1DOztJQUNuQywyQ0FBZ0M7O0lBRzVCLHdEQUErQzs7Ozs7SUFDL0MsK0NBQStCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgICBDb21wb25lbnQsXG4gICAgSW5wdXQsXG4gICAgT25DaGFuZ2VzLFxuICAgIFNpbXBsZUNoYW5nZXMsXG4gICAgSW5qZWN0XG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRE9DVU1FTlQgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgRG9tU2FuaXRpemVyLCBTYWZlUmVzb3VyY2VVcmwgfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJztcbmltcG9ydCB7IE5nSW1hZ2VTbGlkZXJTZXJ2aWNlIH0gZnJvbSAnLi8uLi9uZy1pbWFnZS1zbGlkZXIuc2VydmljZSc7XG5cbmNvbnN0IHlvdXR1YmVSZWdFeHAgPSAvXi4qKHlvdXR1LmJlXFwvfHZcXC98dVxcL1xcd1xcL3xlbWJlZFxcL3x3YXRjaFxcP3Y9fFxcJnY9fFxcP3Y9KShbXiNcXCZcXD9dKikuKi8sXG4gICAgdmFsaWRGaWxlRXh0ZW5zaW9ucyA9IFsnanBlZycsICdqcGcnLCAnZ2lmJywgJ3BuZyddLFxuICAgIHZhbGlkVmlkZW9FeHRlbnNpb25zID0gWydtcDQnXTtcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdjdXN0b20taW1nJyxcbiAgICB0ZW1wbGF0ZVVybDogJy4vc2xpZGVyLWN1c3RvbS1pbWFnZS5jb21wb25lbnQuaHRtbCdcbn0pXG5leHBvcnQgY2xhc3MgU2xpZGVyQ3VzdG9tSW1hZ2VDb21wb25lbnQgaW1wbGVtZW50cyBPbkNoYW5nZXMge1xuICAgIFlPVVRVQkUgPSAneW91dHViZSc7XG4gICAgSU1BR0UgPSAnaW1hZ2UnO1xuICAgIFZJREVPID0gJ3ZpZGVvJztcbiAgICBmaWxlVXJsOiBTYWZlUmVzb3VyY2VVcmwgPSAnJztcbiAgICBmaWxlRXh0ZW5zaW9uID0gJyc7XG4gICAgdHlwZSA9IHRoaXMuSU1BR0U7XG5cbiAgICAvLyBAaW5wdXRzXG4gICAgQElucHV0KCkgc2hvd1ZpZGVvOiBib29sZWFuID0gZmFsc2U7XG4gICAgQElucHV0KCkgdmlkZW9BdXRvUGxheTogYm9vbGVhbiA9IGZhbHNlO1xuICAgIEBJbnB1dCgpIHNob3dWaWRlb0NvbnRyb2xzOiBudW1iZXIgPSAxO1xuICAgIEBJbnB1dCgpIGN1cnJlbnRJbWFnZUluZGV4OiBudW1iZXI7XG4gICAgQElucHV0KCkgaW1hZ2VJbmRleDogbnVtYmVyO1xuICAgIEBJbnB1dCgpIHNwZWVkOiBudW1iZXIgPSAxO1xuICAgIEBJbnB1dCgpIGltYWdlVXJsO1xuICAgIEBJbnB1dCgpIGlzVmlkZW8gPSBmYWxzZTtcbiAgICBASW5wdXQoKSBhbHQ6IFN0cmluZyA9ICcnO1xuICAgIEBJbnB1dCgpIHRpdGxlOiBTdHJpbmcgPSAnJztcbiAgICBASW5wdXQoKSBkaXJlY3Rpb246IHN0cmluZyA9ICdsdHInO1xuICAgIEBJbnB1dCgpIHJhdGlvOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHVibGljIGltYWdlU2xpZGVyU2VydmljZTogTmdJbWFnZVNsaWRlclNlcnZpY2UsXG4gICAgICAgIHByaXZhdGUgc2FuaXRpemVyOiBEb21TYW5pdGl6ZXIsXG4gICAgICAgIEBJbmplY3QoRE9DVU1FTlQpIGRvY3VtZW50KSB7XG4gICAgfVxuXG4gICAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgICAgICBpZiAodGhpcy5pbWFnZVVybFxuICAgICAgICAgICAgJiYgdGhpcy5pbWFnZVVybFxuICAgICAgICAgICAgJiYgdGhpcy5pbWFnZVVybFxuICAgICAgICAgICAgJiYgdHlwZW9mICh0aGlzLmltYWdlVXJsKSA9PT0gJ3N0cmluZydcbiAgICAgICAgICAgICYmIChcbiAgICAgICAgICAgICAgICAoY2hhbmdlcy5pbWFnZVVybCAmJiBjaGFuZ2VzLmltYWdlVXJsLmZpcnN0Q2hhbmdlKVxuICAgICAgICAgICAgICAgIHx8XG4gICAgICAgICAgICAgICAgKHRoaXMudmlkZW9BdXRvUGxheSlcbiAgICAgICAgICAgICAgICkpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0VXJsKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRVcmwoKSB7XG4gICAgICAgIGNvbnN0IHVybCA9IHRoaXMuaW1hZ2VVcmw7XG4gICAgICAgIHRoaXMuZmlsZVVybCA9IHRoaXMuc2FuaXRpemVyLmJ5cGFzc1NlY3VyaXR5VHJ1c3RSZXNvdXJjZVVybCh1cmwpO1xuICAgICAgICB0aGlzLmZpbGVFeHRlbnNpb24gPSB1cmwuc3BsaXQoJy4nKS5wb3AoKS5zcGxpdCgvXFwjfFxcPy8pWzBdO1xuICAgICAgICBpZiAodGhpcy5pbWFnZVNsaWRlclNlcnZpY2UuYmFzZTY0RmlsZUV4dGVuc2lvbih1cmwpXG4gICAgICAgICYmICh2YWxpZEZpbGVFeHRlbnNpb25zLmluZGV4T2YodGhpcy5pbWFnZVNsaWRlclNlcnZpY2UuYmFzZTY0RmlsZUV4dGVuc2lvbih1cmwpLnRvTG93ZXJDYXNlKCkpID4gLTEgXG4gICAgICAgIHx8IHZhbGlkVmlkZW9FeHRlbnNpb25zLmluZGV4T2YodGhpcy5pbWFnZVNsaWRlclNlcnZpY2UuYmFzZTY0RmlsZUV4dGVuc2lvbih1cmwpLnRvTG93ZXJDYXNlKCkpID4gLTEpKSB7XG4gICAgICAgICAgICB0aGlzLmZpbGVFeHRlbnNpb24gPSB0aGlzLmltYWdlU2xpZGVyU2VydmljZS5iYXNlNjRGaWxlRXh0ZW5zaW9uKHVybCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gdmVyaWZ5IGZvciB5b3V0dWJlIHVybFxuICAgICAgICBjb25zdCBtYXRjaCA9IHVybC5tYXRjaCh5b3V0dWJlUmVnRXhwKTtcbiAgICAgICAgaWYgKG1hdGNoICYmIG1hdGNoWzJdLmxlbmd0aCA9PT0gMTEpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnNob3dWaWRlbykge1xuICAgICAgICAgICAgICAgIHRoaXMudHlwZSA9IHRoaXMuWU9VVFVCRTtcbiAgICAgICAgICAgICAgICB0aGlzLmZpbGVVcmwgPSB0aGlzLnNhbml0aXplci5ieXBhc3NTZWN1cml0eVRydXN0UmVzb3VyY2VVcmwoYCR7J2h0dHBzOi8vd3d3LnlvdXR1YmUuY29tL2VtYmVkLyd9JHttYXRjaFsyXX0ke3RoaXMudmlkZW9BdXRvUGxheSA/ICc/YXV0b3BsYXk9MSZlbmFibGVqc2FwaT0xJyA6ICc/YXV0b3BsYXk9MCZlbmFibGVqc2FwaT0xJ30keycmY29udHJvbHM9J30ke3RoaXMuc2hvd1ZpZGVvQ29udHJvbHN9YCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMudHlwZSA9IHRoaXMuSU1BR0U7XG4gICAgICAgICAgICAgICAgdGhpcy5maWxlVXJsID0gdGhpcy5zYW5pdGl6ZXIuYnlwYXNzU2VjdXJpdHlUcnVzdFJlc291cmNlVXJsKGBodHRwczovL2ltZy55b3V0dWJlLmNvbS92aS8ke21hdGNoWzJdfS8wLmpwZ2ApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuZmlsZUV4dGVuc2lvbiAmJiB2YWxpZEZpbGVFeHRlbnNpb25zLmluZGV4T2YodGhpcy5maWxlRXh0ZW5zaW9uLnRvTG93ZXJDYXNlKCkpID4gLTEpIHtcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IHRoaXMuSU1BR0U7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5maWxlRXh0ZW5zaW9uICYmIHZhbGlkVmlkZW9FeHRlbnNpb25zLmluZGV4T2YodGhpcy5maWxlRXh0ZW5zaW9uLnRvTG93ZXJDYXNlKCkpID4gLTEpIHtcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IHRoaXMuVklERU87XG4gICAgICAgICAgICBpZiAodGhpcy52aWRlb0F1dG9QbGF5ICYmIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGB2aWRlb18ke3RoaXMuaW1hZ2VJbmRleH1gKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHZpZGVvT2JqOmFueSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGB2aWRlb18ke3RoaXMuaW1hZ2VJbmRleH1gKTtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdmlkZW9PYmoucGxheSgpO1xuICAgICAgICAgICAgICAgIH0sIHRoaXMuc3BlZWQgKiAxMDAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZpZGVvQ2xpY2tIYW5kbGVyKGV2ZW50KSB7XG4gICAgICAgIGlmIChldmVudCAmJiBldmVudC5zcmNFbGVtZW50ICYmICF0aGlzLnNob3dWaWRlb0NvbnRyb2xzKSB7XG4gICAgICAgICAgICBpZiAoZXZlbnQuc3JjRWxlbWVudC5wYXVzZWQpIHtcbiAgICAgICAgICAgICAgICBldmVudC5zcmNFbGVtZW50LnBsYXkoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZXZlbnQuc3JjRWxlbWVudC5wYXVzZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuIl19