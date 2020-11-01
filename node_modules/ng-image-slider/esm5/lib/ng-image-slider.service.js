/**
 * @fileoverview added by tsickle
 * Generated from: lib/ng-image-slider.service.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
var NgImageSliderService = /** @class */ (function () {
    function NgImageSliderService() {
    }
    /**
     * @param {?} str
     * @return {?}
     */
    NgImageSliderService.prototype.isBase64 = /**
     * @param {?} str
     * @return {?}
     */
    function (str) {
        /** @type {?} */
        var base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
        return base64regex.test(str);
    };
    /**
     * @param {?} str
     * @return {?}
     */
    NgImageSliderService.prototype.base64FileExtension = /**
     * @param {?} str
     * @return {?}
     */
    function (str) {
        return str.substring("data:image/".length, str.indexOf(";base64"));
    };
    NgImageSliderService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    NgImageSliderService.ctorParameters = function () { return []; };
    return NgImageSliderService;
}());
export { NgImageSliderService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctaW1hZ2Utc2xpZGVyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZy1pbWFnZS1zbGlkZXIvIiwic291cmNlcyI6WyJsaWIvbmctaW1hZ2Utc2xpZGVyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTNDO0lBR0k7SUFBZ0IsQ0FBQzs7Ozs7SUFFakIsdUNBQVE7Ozs7SUFBUixVQUFTLEdBQUc7O1lBQ0osV0FBVyxHQUFHLGtFQUFrRTtRQUNwRixPQUFPLFdBQVcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFFakMsQ0FBQzs7Ozs7SUFFRCxrREFBbUI7Ozs7SUFBbkIsVUFBb0IsR0FBRztRQUNuQixPQUFPLEdBQUcsQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7SUFDdkUsQ0FBQzs7Z0JBYkosVUFBVTs7OztJQWNYLDJCQUFDO0NBQUEsQUFkRCxJQWNDO1NBYlksb0JBQW9CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgTmdJbWFnZVNsaWRlclNlcnZpY2Uge1xuXG4gICAgY29uc3RydWN0b3IoKSB7IH1cblxuICAgIGlzQmFzZTY0KHN0cikge1xuICAgICAgICB2YXIgYmFzZTY0cmVnZXggPSAvXihbMC05YS16QS1aKy9dezR9KSooKFswLTlhLXpBLVorL117Mn09PSl8KFswLTlhLXpBLVorL117M309KSk/JC87XG4gICAgICAgIHJldHVybiBiYXNlNjRyZWdleC50ZXN0KHN0cik7XG5cbiAgICB9XG5cbiAgICBiYXNlNjRGaWxlRXh0ZW5zaW9uKHN0cikge1xuICAgICAgICByZXR1cm4gc3RyLnN1YnN0cmluZyhcImRhdGE6aW1hZ2UvXCIubGVuZ3RoLCBzdHIuaW5kZXhPZihcIjtiYXNlNjRcIikpO1xuICAgIH1cbn1cbiJdfQ==