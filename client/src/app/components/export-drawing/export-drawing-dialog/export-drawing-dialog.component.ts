import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { BLUR_CONVERSION, HUE_CONVERSION, MAX_PREVIEW_SIZE } from '@app/constants/constants.ts';
import { ExportFilterType } from '@app/enums/export-filter.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { EmailService } from '@app/services/email/email.service';
import { Email } from '@common/communication/email';

@Component({
    selector: 'app-export-drawing-dialog',
    templateUrl: './export-drawing-dialog.component.html',
    styleUrls: ['./export-drawing-dialog.component.scss'],
})
export class ExportDrawingDialogComponent implements AfterViewInit {
    @ViewChild('drawingImageContainer') drawingImageContainer: ElementRef;
    @ViewChild('previewCanvas') previewCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('exportCanvas') exportCanvas: ElementRef<HTMLCanvasElement>;

    selectedFormat: string = 'jpeg';
    selectedFilter: ExportFilterType = ExportFilterType.None;
    typeExportFilter: typeof ExportFilterType = ExportFilterType;
    drawingTitle: string = '';
    previewCtx: CanvasRenderingContext2D;
    exportCtx: CanvasRenderingContext2D;
    private exportFilter: string = 'none';

    percentage: number = 1;
    sliderIsVisible: boolean = false;
    titleForm: FormControl = new FormControl('', Validators.required);
    emailForm: FormControl = new FormControl('', [Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i), Validators.required]);

    constructor(
        public dialogRef: MatDialogRef<ExportDrawingDialogComponent>,
        public drawingService: DrawingService,
        public emailService: EmailService,
    ) {
        this.titleForm.markAsDirty();
    }

    ngAfterViewInit(): void {
        this.previewCtx = this.previewCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.exportCtx = this.exportCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;

        this.setInitialCanvasSize();

        this.setWhiteBackground(this.previewCtx);
        this.setWhiteBackground(this.exportCtx);

        this.setPreviewFilter();
        this.setImageUrl();
    }

    private setInitialCanvasSize(): void {
        this.setPreviewSize();
        this.setExportSize();
    }

    private setExportSize(): void {
        this.exportCanvas.nativeElement.width = this.drawingService.canvas.width;
        this.exportCanvas.nativeElement.height = this.drawingService.canvas.height;
    }

    private setPreviewSize(): void {
        const ratio = this.drawingService.canvas.height / this.drawingService.canvas.width;

        if (ratio > 1) {
            this.previewCanvas.nativeElement.height = Math.min(this.drawingService.canvas.height, MAX_PREVIEW_SIZE);
            this.previewCanvas.nativeElement.width = this.previewCanvas.nativeElement.height / ratio;
        } else {
            this.previewCanvas.nativeElement.width = Math.min(this.drawingService.canvas.width, MAX_PREVIEW_SIZE);
            this.previewCanvas.nativeElement.height = this.previewCanvas.nativeElement.width * ratio;
        }
    }

    private setWhiteBackground(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillStyle = '#000000';
    }

    setFilterPercentage(value: number): void {
        this.percentage = value;
        this.setPreviewFilter();
    }

    setPreviewFilter(): void {
        this.sliderIsVisible = true;

        switch (this.selectedFilter) {
            case ExportFilterType.None:
                this.previewCtx.filter = 'none';
                this.sliderIsVisible = false;
                break;
            case ExportFilterType.Blur:
                this.previewCtx.filter = 'blur(' + this.percentage * BLUR_CONVERSION + 'px)';
                break;
            case ExportFilterType.Brightness:
                this.previewCtx.filter = 'brightness(' + this.percentage + ')';
                break;
            case ExportFilterType.Saturation:
                this.previewCtx.filter = 'saturate(' + this.percentage + ')';
                break;
            case ExportFilterType.Hue:
                this.previewCtx.filter = 'hue-rotate(' + this.percentage * HUE_CONVERSION + 'deg)';
                break;
            case ExportFilterType.Sepia:
                this.previewCtx.filter = 'contrast(1.4) sepia(1)';
                this.sliderIsVisible = false;
                break;
            case ExportFilterType.Invert:
                this.previewCtx.filter = 'invert(1)';
                this.sliderIsVisible = false;
                break;
        }
        this.setWhiteBackground(this.previewCtx);
        this.previewCtx.drawImage(
            this.drawingService.canvas,
            0,
            0,
            this.drawingService.canvas.width,
            this.drawingService.canvas.height,
            0,
            0,
            this.previewCanvas.nativeElement.width,
            this.previewCanvas.nativeElement.height,
        );
        this.exportFilter = this.previewCtx.filter;
        this.previewCtx.filter = 'none';
    }

    private setImageUrl(): void {
        const format = 'image/' + this.selectedFormat;
        const imageUrl = this.exportCanvas.nativeElement.toDataURL(format);
        this.drawingImageContainer.nativeElement.href = imageUrl;
    }

    onFormatChange(): void {
        this.setImageUrl();
    }

    downloadImage(): void {
        this.exportCtx.filter = this.exportFilter;
        this.setWhiteBackground(this.exportCtx);
        this.exportCtx.drawImage(this.drawingService.canvas, 0, 0);
        this.exportCtx.filter = 'none';

        this.setImageUrl();
        this.drawingImageContainer.nativeElement.download = this.titleForm.value + '.' + this.selectedFormat;
        this.drawingImageContainer.nativeElement.click();
        this.dialogRef.close();
    }

    isEmailInputEmpty(): boolean {
        if (this.emailForm.value.length === 0) {
            this.emailForm.markAsPristine();
        }
        return this.emailForm.value.length === 0;
    }

    // Case if png or jpeg
    sendByEmail(): void {
        // png
        //         if (this.selectedFormat === 'png') {
        this.exportCtx.canvas.toBlob(
            (blob: Blob) => {
                // success
                const email: Email = {
                    emailAddress: this.emailForm.value,
                    image: blob,
                    // image: this.exportCtx.getImageData(0, 0, this.exportCanvas.nativeElement.width, this.exportCanvas.nativeElement.height),
                };
                this.emailService.onSubmit(email);
                this.emailForm.reset();
                // echec
            },
            'image/png',
            1,
        );
        //     }
    }

    // // createBlob
    // createBlob() : void {

    // }

    keepOriginalOrder(): number {
        return 0;
    }
}

/*
 * EMAIL :
 * Le serveur est disponible sur l'addresse suivante : [ http://log2990.step.polymtl.ca/ | http://log2990.step.polymtl.ca/ ] (notez le http)
 * Vous pouvez communiquer avec ce serveur Ã  travers le votre par HTTP.
 * Seulement la route /email ( [ http://log2990.step.polymtl.ca/email | http://log2990.step.polymtl.ca/email ] )
 * est disponible et rÃ©pond seulement aux requÃªtes HTTP POST
 */
