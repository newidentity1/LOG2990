import { Injectable } from '@angular/core';
import { ShapeTool } from '@app/classes/shape-tool';
import { BasicShapeProperties } from '@app/classes/tools-properties/basic-shape-properties';
import { Vec2 } from '@app/classes/vec2';
import * as CONSTANTS from '@app/constants/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';

const MINIMAL_DISTANCE = 50;

// TODO : Déplacer ça dans un fichier séparé accessible par tous
export enum MouseButton {
    Left = 0,
    Middle = 1,
    Right = 2,
    Back = 3,
    Forward = 4,
}

// Ceci est une implémentation de base de l'outil Crayon pour aider à débuter le projet
// L'implémentation ici ne couvre pas tous les critères d'accepetation du projet
// Vous êtes encouragés de modifier et compléter le code.
// N'oubliez pas de regarder les tests dans le fichier spec.ts aussi!
@Injectable({
    providedIn: 'root',
})
export class LineService extends ShapeTool {
    // ligne principale
    private pathData: Vec2[];
    private index: number = 0;
    private mouse: Vec2;
    private shift: boolean = false;
    private lock180: boolean = false;
    private lock90: boolean = false;
    private lock45: boolean = false;
    private withPoint: boolean = false;
    private pointSize: number = 10;

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.name = 'Line';
        this.tooltip = 'Line';
        this.iconName = 'show_chart';
        this.toolProperties = new BasicShapeProperties();
        this.clearPath();
    }

    onClick(event: MouseEvent): void {
        console.log('CLICK');
        this.mouseDown = event.button === MouseButton.Left;
        this.index++;
        const mousePosition = this.getPositionFromMouse(event);
        const point: Vec2 = mousePosition;
        if (this.pathData.length <= 1) {
            this.pathData.push(mousePosition);
        } else {
            const dx = mousePosition.x - this.pathData[this.pathData.length - 1].x;
            const dy = mousePosition.y - this.pathData[this.pathData.length - 1].y;
            if (this.lock180) {
                // TODO
                point.y = this.pathData[this.pathData.length - 1].y;
                this.pathData.push(point);
            } else if (this.lock45) {
                // TODO
                if ((dx > 0 && dy > 0) || (dx < 0 && dy < 0)) {
                    point.y =
                        Math.tan(CONSTANTS.ANGLE_45) * (point.x - this.pathData[this.pathData.length - 1].x) +
                        this.pathData[this.pathData.length - 1].y;
                }
                if ((dx > 0 && dy < 0) || (dx < 0 && dy > 0)) {
                    // TODO
                    point.y =
                        -Math.tan(CONSTANTS.ANGLE_45) * (point.x - this.pathData[this.pathData.length - 1].x) +
                        this.pathData[this.pathData.length - 1].y;
                }
                this.pathData.push(point);
            } else if (this.lock90) {
                // TODO
                point.x = this.pathData[this.pathData.length - 1].x;
                this.pathData.push(point);
            } else {
                this.pathData.push(mousePosition);
            }
            this.drawLine(this.drawingService.previewCtx, this.pathData);
        }
    }

    onMouseMove(event: MouseEvent): void {
        this.mouse = this.getPositionFromMouse(event);
        if (this.shift) {
            this.clearlock();
            this.ajustementAngle(event);
        } else {
            this.afficherSegementPreview(event);
        }
    }

    // SHIFT appuyé
    onKeyDown(event: KeyboardEvent): void {
        event.preventDefault();
        if (event.key === 'Shift') {
            console.log('SHIFT-DOWN');
            this.shift = true;
        }
        if (event.code === 'Backspace') {
            if (this.pathData.length >= 2) {
                this.pathData.pop();
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.drawLine(this.drawingService.previewCtx, this.pathData);
                this.index = this.index - 1;
            }
        }
        if (event.code === 'Escape') {
            this.clearPath();
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
        }
    }

    // double click donc fin de ligne
    onDoubleClick(event: MouseEvent): void {
        this.index = 0;
        if (this.pathData.length >= 1) {
            const mousePosition = this.getPositionFromMouse(event);
            // calculer la distance entre la souris et le point de départ
            const x1: number = mousePosition.x;
            const y1: number = mousePosition.y;
            const x2: number = this.pathData[0].x;
            const y2: number = this.pathData[0].y;
            if (x1 !== x2 && y1 !== y2) {
                const distance: number = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
                console.log(distance);

                if (distance <= MINIMAL_DISTANCE) {
                    this.pathData.pop();
                    this.pathData.pop();

                    this.index = this.index - 2;
                    this.drawingService.clearCanvas(this.drawingService.previewCtx);
                    this.pathData.push(this.pathData[0]);
                    this.drawLine(this.drawingService.baseCtx, this.pathData);
                    this.clearPath();
                    this.index = 1;
                } else {
                    console.log('DOUBLE-CLICK');
                    this.drawLine(this.drawingService.baseCtx, this.pathData);
                    this.clearPath();
                    this.index = 1;
                }
            }
        }
    }

    // SHIFT relaché
    onKeyUp(event: KeyboardEvent): void {
        if (event.key === 'Shift') {
            this.shift = false;
            this.lock180 = false;
            this.lock45 = false;
            this.lock90 = false;
            // TODO
            // si on a pas encore commencer de ligne
            this.pathData.push(this.mouse);
            // on suprime l'ancien segment et on définit le nouveau
            // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawLine(this.drawingService.previewCtx, this.pathData);
            this.pathData.pop();
        }
    }

    // dessine la ligne
    private drawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        if (!this.withPoint) {
            ctx.beginPath();
            for (const point of path) {
                ctx.lineTo(point.x, point.y);
            }
            ctx.stroke();
        } else {
            ctx.beginPath();
            for (const point of path) {
                ctx.lineTo(point.x, point.y);
                ctx.arc(point.x, point.y, this.pointSize, CONSTANTS.DEFAULT_LINE_POINT_SIZE, Math.PI * 2, true);
            }
            ctx.stroke();
        }
    }

    setPointeSize(value: number | null): void {
        value = value === null ? 1 : value;
        this.pointSize = value;
    }
    private afficherSegementPreview(event: MouseEvent): void {
        const mousePosition = this.getPositionFromMouse(event);
        // si on a pas encore commencer de ligne
        this.pathData.push(mousePosition);
        // on suprime l'ancien segment et on définit le nouveau
        // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.drawLine(this.drawingService.previewCtx, this.pathData);
        this.pathData.pop();
    }

    private afficherSegementPreviewAngle(event: MouseEvent, point: Vec2): void {
        // si on a pas encore commencer de ligne
        this.pathData.push(point);
        // on suprime l'ancien segment et on définit le nouveau
        // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.drawLine(this.drawingService.previewCtx, this.pathData);
        this.pathData.pop();
    }

    private clearPath(): void {
        this.pathData = [];
    }

    setThickness(value: number | null): void {
        // TODO possiblement ajouter de la validation ici aussi
        value = value === null ? 1 : value;
        this.toolProperties.thickness = value;
        this.drawingService.setThickness(value);
    }

    setTypeDrawing(value: string): void {
        console.log(value);
        if (value[0] === 'A') {
            this.withPoint = true;
        } else {
            this.withPoint = false;
        }
        console.log(this.withPoint);
    }

    private ajustementAngle(event: MouseEvent): number {
        let angle = 0;
        if (this.pathData.length >= 1) {
            // A position de la souris
            const mousePosition = this.getPositionFromMouse(event);
            const x1: number = mousePosition.x;
            const y1: number = mousePosition.y;
            // B  dernier point de la ligne
            const x2: number = this.pathData[this.pathData.length - 1].x;
            const y2: number = this.pathData[this.pathData.length - 1].y;
            // C avant dernier point de la ligne

            // verifie qu'une ligne existe bien
            if (x1 !== x2 && y1 !== y2) {
                const d1: number = Math.abs(x1 - x2);
                const d2: number = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
                angle = Math.acos(d1 / d2);
                // angle en degres
                angle = angle * ((CONSTANTS.ANGLE_90 * 2) / Math.PI);
                // test
                // console.log(angle);
                if (angle >= CONSTANTS.ANGLE_45 / 2 && angle <= CONSTANTS.ANGLE_45 + CONSTANTS.ANGLE_45 / 2) {
                    this.lockAngle(event, CONSTANTS.ANGLE_45);
                }
                if (angle < CONSTANTS.ANGLE_90 && angle > CONSTANTS.ANGLE_45 + CONSTANTS.ANGLE_45 / 2) {
                    this.lockAngle(event, CONSTANTS.ANGLE_90);
                }
                if (angle < CONSTANTS.ANGLE_45 / 2 && angle >= 0) {
                    this.lockAngle(event, CONSTANTS.ANGLE_180);
                }
            }
        }
        return angle;
    }

    private lockAngle(event: MouseEvent, angle: number): void {
        // TODO
        const mousePosition = this.getPositionFromMouse(event);
        const point: Vec2 = mousePosition;
        const dx = mousePosition.x - this.pathData[this.pathData.length - 1].x;
        const dy = mousePosition.y - this.pathData[this.pathData.length - 1].y;
        if (angle === CONSTANTS.ANGLE_45) {
            // todo
            this.lock45 = true;
            if ((dx > 0 && dy > 0) || (dx < 0 && dy < 0)) {
                point.y =
                    Math.tan(CONSTANTS.ANGLE_45) * (point.x - this.pathData[this.pathData.length - 1].x) + this.pathData[this.pathData.length - 1].y;
                console.log(point.y);
            }
            if ((dx > 0 && dy < 0) || (dx < 0 && dy > 0)) {
                // TODO
                point.y =
                    -Math.tan(CONSTANTS.ANGLE_45) * (point.x - this.pathData[this.pathData.length - 1].x) + this.pathData[this.pathData.length - 1].y;
            }
        } else if (angle === CONSTANTS.ANGLE_90) {
            // TODO
            point.x = this.pathData[this.pathData.length - 1].x;
            this.lock90 = true;
        } else if (angle === CONSTANTS.ANGLE_180) {
            this.lock180 = true;
            point.y = this.pathData[this.pathData.length - 1].y;
        } else {
            // TODO
            point.y = this.pathData[this.pathData.length - 1].y;
        }
        this.afficherSegementPreviewAngle(event, point);
    }

    private clearlock(): void {
        this.lock180 = false;
        this.lock90 = false;
        this.lock45 = false;
    }
}
