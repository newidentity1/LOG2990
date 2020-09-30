import { Injectable } from '@angular/core';
import { Color } from '@app/classes/color/color';
import { Tool } from '@app/classes/tool';
import { BasicShapeProperties } from '@app/classes/tools-properties/basic-shape-properties';
import { Vec2 } from '@app/classes/vec2';
import * as CONSTANTS from '@app/constants/constants';
import { MouseButton } from '@app/enums/mouse-button.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class LineService extends Tool {
    // ligne principale
    pathData: Vec2[];
    // position de la souris
    private mouse: Vec2;

    shift: boolean = false;
    // ancrage du segment de previsualisation selon un angle
    lock180: boolean = false;
    lock90: boolean = false;
    lock45: boolean = false;
    // ligne avec ou sans point
    withPoint: boolean = false;
    // taille des points de liaisons
    pointSize: number = 10;

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.name = 'Line';
        this.tooltip = 'Line(l)';
        this.iconName = 'show_chart';
        this.toolProperties = new BasicShapeProperties();
        this.clearPath();
    }

    // Permet d'ajouter un point dans la ligne a chaque click
    onClick(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        const mousePosition = this.getPositionFromMouse(event);
        // si il n'y a qu'un seul point on ne trace pas de ligne
        if (this.pathData.length > 1) {
            // sinon on trace une ligne
            // si shift est appuye les points doivent s'alligner sur un angle de 0 ou multiple de 45 degres
            if (this.shift) {
                if (this.lock180) {
                    // point s'aligne avec axe x
                    mousePosition.y = this.pathData[this.pathData.length - 1].y;
                } else if (this.lock45) {
                    const dx = mousePosition.x - this.pathData[this.pathData.length - 1].x;
                    const dy = mousePosition.y - this.pathData[this.pathData.length - 1].y;
                    // point s'aligne avec droite y = x ou y = -x
                    if ((dx > 0 && dy > 0) || (dx < 0 && dy < 0)) {
                        mousePosition.y =
                            Math.tan(CONSTANTS.ANGLE_45) * (mousePosition.x - this.pathData[this.pathData.length - 1].x) +
                            this.pathData[this.pathData.length - 1].y;
                    } else {
                        mousePosition.y =
                            -Math.tan(CONSTANTS.ANGLE_45) * (mousePosition.x - this.pathData[this.pathData.length - 1].x) +
                            this.pathData[this.pathData.length - 1].y;
                    }
                } else if (this.lock90) {
                    // point s'aligne avec axe y
                    mousePosition.x = this.pathData[this.pathData.length - 1].x;
                }
            }
            this.drawLine(this.drawingService.previewCtx, this.pathData);
        }
        this.pathData.push(mousePosition);
    }

    // Met a jour le segment de previsualisation
    onMouseMove(event: MouseEvent): void {
        this.mouse = this.getPositionFromMouse(event);
        if (this.shift) {
            // nettoie les variable booleen d'encrage d'angle
            this.clearlock();
            // trouve l'angle
            this.ajustementAngle(event);
        } else {
            this.afficherSegementPreview(this.mouse);
        }
    }

    // SHIFT appuyé
    onKeyDown(event: KeyboardEvent): void {
        event.preventDefault();
        if (event.key === 'Shift') {
            this.shift = true;
        }
        if (event.key === 'Backspace') {
            // efface le dernier segment
            if (this.pathData.length >= 2) {
                this.pathData.pop();
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.drawLine(this.drawingService.previewCtx, this.pathData);
            }
        }
        if (event.code === 'Escape') {
            // efface la derniere ligne
            this.clearPath();
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
        }
    }

    // double click donc fin de ligne
    onDoubleClick(event: MouseEvent): void {
        const mousePosition = this.getPositionFromMouse(event);
        if (mousePosition !== this.pathData[0] && this.pathData.length >= 1) {
            // calculer la distance entre la souris et le point de départ
            const x1: number = mousePosition.x;
            const y1: number = mousePosition.y;
            const x2: number = this.pathData[0].x;
            const y2: number = this.pathData[0].y;
            const distance: number = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
            // si la souris est a 20 pixels du point de depart de la ligne, la boucle se ferme sur son point de depart
            if (distance <= CONSTANTS.MINIMAL_DISTANCE) {
                this.pathData.pop();
                this.pathData.pop();

                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.pathData.push(this.pathData[0]);
                this.drawLine(this.drawingService.baseCtx, this.pathData);
                this.clearPath();
            } else {
                this.drawLine(this.drawingService.baseCtx, this.pathData);
                this.clearPath();
            }
        }
    }

    // SHIFT relaché
    onKeyUp(event: KeyboardEvent): void {
        if (event.key === 'Shift') {
            this.shift = false;
            this.clearlock();
            this.pathData.push(this.mouse);
            // on suprime l'ancien segment et on définit le nouveau
            // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawLine(this.drawingService.previewCtx, this.pathData);
            this.pathData.pop();
        }
    }

    // permet de choisir la couleur de la ligne
    setColors(primaryColor: Color): void {
        this.drawingService.setColor(primaryColor.toStringRGBA());
    }

    // permet de choisir la taille des points
    setPointeSize(value: number | null): void {
        value = value === null ? 1 : value;
        this.pointSize = value;
    }

    // permet de choisir l'epaisseur de la ligne
    setThickness(value: number | null): void {
        value = value === null ? 1 : value;
        this.toolProperties.thickness = value;
        this.drawingService.setThickness(value);
    }

    // permet de choisir le type de liaison
    setTypeDrawing(value: string): void {
        if (value[0] === 'A') {
            this.withPoint = true;
        } else {
            this.withPoint = false;
        }
    }

    // dessine la ligne
    private drawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.beginPath();
        for (const point of path) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();
        if (this.withPoint) {
            ctx.beginPath();
            for (const point of path) {
                ctx.beginPath();
                ctx.arc(point.x, point.y, this.pointSize, 0, Math.PI * 2, false);
                ctx.fill();
            }
        }
    }

    //// affiche le segment de previsualisation selon la position de la souris et un angle
    private afficherSegementPreview(point: Vec2): void {
        // si on a pas encore commencer de ligne
        this.pathData.push(point);
        // on suprime l'ancien segment et on définit le nouveau
        // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.drawLine(this.drawingService.previewCtx, this.pathData);
        this.pathData.pop();
    }

    // suprime la ligne en cours de creation
    private clearPath(): void {
        this.pathData = [];
    }

    // Permet de trouver l'angle entre la souris et l'axe x
    ajustementAngle(event: MouseEvent): void {
        let angle = 0;
        const mousePosition = this.getPositionFromMouse(event);
        if (mousePosition !== this.pathData[this.pathData.length - 1] && this.pathData.length >= 1) {
            const x1: number = mousePosition.x;
            const y1: number = mousePosition.y;
            // B  dernier point de la ligne
            const x2: number = this.pathData[this.pathData.length - 1].x;
            const y2: number = this.pathData[this.pathData.length - 1].y;
            const d1: number = Math.abs(x1 - x2);
            const d2: number = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
            angle = Math.acos(d1 / d2);
            // angle en degres
            angle = angle * ((CONSTANTS.ANGLE_90 * 2) / Math.PI);

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

    // Permet de trouver le point a ajouter a la ligne selon l'angle
    private lockAngle(event: MouseEvent, angle: number): void {
        const mousePosition = this.getPositionFromMouse(event);
        const point: Vec2 = mousePosition;
        switch (angle) {
            case CONSTANTS.ANGLE_45:
                const dx = mousePosition.x - this.pathData[this.pathData.length - 1].x;
                const dy = mousePosition.y - this.pathData[this.pathData.length - 1].y;
                this.lock45 = true;
                if ((dx > 0 && dy > 0) || (dx < 0 && dy < 0)) {
                    point.y =
                        Math.tan(CONSTANTS.ANGLE_45) * (point.x - this.pathData[this.pathData.length - 1].x) +
                        this.pathData[this.pathData.length - 1].y;
                }
                if ((dx > 0 && dy < 0) || (dx < 0 && dy > 0)) {
                    point.y =
                        -Math.tan(CONSTANTS.ANGLE_45) * (point.x - this.pathData[this.pathData.length - 1].x) +
                        this.pathData[this.pathData.length - 1].y;
                }
                break;
            case CONSTANTS.ANGLE_90:
                point.x = this.pathData[this.pathData.length - 1].x;
                this.lock90 = true;
                break;
            case CONSTANTS.ANGLE_180:
                this.lock180 = true;
                point.y = this.pathData[this.pathData.length - 1].y;
                break;
        }
        this.afficherSegementPreview(point);
    }

    // permet d'effacer les ancrage
    private clearlock(): void {
        this.lock180 = false;
        this.lock90 = false;
        this.lock45 = false;
    }

    resetContext(): void {
        const previewCtx = this.drawingService.previewCtx;
        const baseCtx = this.drawingService.baseCtx;
        previewCtx.lineCap = baseCtx.lineCap = 'butt';
        previewCtx.lineJoin = baseCtx.lineJoin = 'miter';
        this.mouseDown = false;
        this.shift = false;
        this.clearlock();
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.clearPath();
    }
}
