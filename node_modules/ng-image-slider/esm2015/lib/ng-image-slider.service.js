/**
 * @fileoverview added by tsickle
 * Generated from: lib/ng-image-slider.service.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
export class NgImageSliderService {
    constructor() { }
    /**
     * @param {?} str
     * @return {?}
     */
    isBase64(str) {
        /** @type {?} */
        var base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
        return base64regex.test(str);
    }
    /**
     * @param {?} str
     * @return {?}
     */
    base64FileExtension(str) {
        return str.substring("data:image/".length, str.indexOf(";base64"));
    }
}
NgImageSliderService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
NgImageSliderService.ctorParameters = () => [];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctaW1hZ2Utc2xpZGVyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZy1pbWFnZS1zbGlkZXIvIiwic291cmNlcyI6WyJsaWIvbmctaW1hZ2Utc2xpZGVyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRzNDLE1BQU0sT0FBTyxvQkFBb0I7SUFFN0IsZ0JBQWdCLENBQUM7Ozs7O0lBRWpCLFFBQVEsQ0FBQyxHQUFHOztZQUNKLFdBQVcsR0FBRyxrRUFBa0U7UUFDcEYsT0FBTyxXQUFXLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBRWpDLENBQUM7Ozs7O0lBRUQsbUJBQW1CLENBQUMsR0FBRztRQUNuQixPQUFPLEdBQUcsQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7SUFDdkUsQ0FBQzs7O1lBYkosVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIE5nSW1hZ2VTbGlkZXJTZXJ2aWNlIHtcblxuICAgIGNvbnN0cnVjdG9yKCkgeyB9XG5cbiAgICBpc0Jhc2U2NChzdHIpIHtcbiAgICAgICAgdmFyIGJhc2U2NHJlZ2V4ID0gL14oWzAtOWEtekEtWisvXXs0fSkqKChbMC05YS16QS1aKy9dezJ9PT0pfChbMC05YS16QS1aKy9dezN9PSkpPyQvO1xuICAgICAgICByZXR1cm4gYmFzZTY0cmVnZXgudGVzdChzdHIpO1xuXG4gICAgfVxuXG4gICAgYmFzZTY0RmlsZUV4dGVuc2lvbihzdHIpIHtcbiAgICAgICAgcmV0dXJuIHN0ci5zdWJzdHJpbmcoXCJkYXRhOmltYWdlL1wiLmxlbmd0aCwgc3RyLmluZGV4T2YoXCI7YmFzZTY0XCIpKTtcbiAgICB9XG59XG4iXX0=