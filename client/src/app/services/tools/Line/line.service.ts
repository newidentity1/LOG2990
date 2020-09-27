import { Injectable } from '@angular/core';
import { Color } from '@app/classes/color/color';
import { ShapeTool } from '@app/classes/shape-tool';
import { BasicShapeProperties } from '@app/classes/tools-properties/basic-shape-properties';
import { Vec2 } from '@app/classes/vec2';
import * as CONSTANTS from '@app/constants/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';

const MINIMAL_DISTANCE = 20;

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
    pathData: Vec2[];
    // position de la souris
    private mouse: Vec2;
    // si shift appuye
    shift: boolean = false;
    // ancrage du segment de previsualisation selon un angle
    private lock180: boolean = false;
    private lock90: boolean = false;
    private lock45: boolean = false;
    // ligne avec ou sans point
    private withPoint: boolean = false;
    // taille des points de liaisons
    private pointSize: number = 10;

    // test :
    endLoop: boolean = false;

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.name = 'Line';
        this.tooltip = 'Line';
        this.iconName = 'show_chart';
        this.toolProperties = new BasicShapeProperties();
        this.clearPath();
    }

    // Permet d'ajouter un point dans la ligne a chaque click
    onClick(event: MouseEvent): void {
        console.log('CLICK');
        this.mouseDown = event.button === MouseButton.Left;
        const mousePosition = this.getPositionFromMouse(event);
        const point: Vec2 = mousePosition;
        // si il n'y a qu'un seul point on ne trace pas de ligne
        if (this.pathData.length < 1) {
            this.pathData.push(mousePosition);
        } else {
            // sinon on trace une ligne
            // si shift est appuye les points doivent s'alligner sur un angle de 0 ou multiple de 45 degres
            if (this.shift) {
                const dx = mousePosition.x - this.pathData[this.pathData.length - 1].x; // utile pour les angle de 45 degres
                const dy = mousePosition.y - this.pathData[this.pathData.length - 1].y; // utile pour les angle de 45 degres
                if (this.lock180) {
                    // point s'aligne avec axe x
                    point.y = this.pathData[this.pathData.length - 1].y;
                } else if (this.lock45) {
                    // point s'aligne avec droite y = x ou y = -x
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
                } else if (this.lock90) {
                    // point s'aligne avec axe y
                    point.x = this.pathData[this.pathData.length - 1].x;
                }
                this.pathData.push(point);
            } else {
                // sinon le point s'alligne avec la position de la souris
                this.pathData.push(mousePosition);
            }
            this.drawLine(this.drawingService.previewCtx, this.pathData);
        }
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
            this.afficherSegementPreview(event);
        }
    }

    // SHIFT appuyé
    onKeyDown(event: KeyboardEvent): void {
        event.preventDefault();
        if (event.key === 'Shift') {
            this.shift = true;
        }
        if (event.code === 'Backspace') {
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
                // si la souris est a 20 pixels du point de depart de la ligne, la boucle se ferme sur son point de depart
                if (distance <= MINIMAL_DISTANCE) {
                    this.endLoop = true; // pour les test
                    this.pathData.pop();
                    this.pathData.pop();

                    this.drawingService.clearCanvas(this.drawingService.previewCtx);
                    this.pathData.push(this.pathData[0]);
                    this.drawLine(this.drawingService.baseCtx, this.pathData);
                    this.clearPath();
                } else {
                    console.log('DOUBLE-CLICK');
                    this.drawLine(this.drawingService.baseCtx, this.pathData);
                    this.clearPath();
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
            this.pathData.push(this.mouse);
            // on suprime l'ancien segment et on définit le nouveau
            // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawLine(this.drawingService.previewCtx, this.pathData);
            this.pathData.pop();
        }
    }

    // permet de choisir la couleur de la ligne
    setColors(primaryColor: Color, secondaryColor: Color): void {
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
        console.log(value);
        if (value[0] === 'A') {
            this.withPoint = true;
        } else {
            this.withPoint = false;
        }
        console.log(this.withPoint);
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
            const pathTemp: Vec2[] = path;
            ctx.beginPath();
            for (const point of path) {
                ctx.lineTo(point.x, point.y);
            }
            ctx.stroke();
            for (const point of pathTemp) {
                ctx.beginPath();
                ctx.arc(point.x, point.y, this.pointSize, 0, Math.PI * 2, false);
                ctx.fill();
            }
        }
    }

    // affiche le segment de previsualisation selon la position de la souris
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

    //// affiche le segment de previsualisation selon la position de la souris et un angle
    private afficherSegementPreviewAngle(event: MouseEvent, point: Vec2): void {
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

            // verifie qu'une ligne existe bien
            if (x1 !== x2 && y1 !== y2) {
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
        return angle;
    }

    // Permet de trouver le point a ajouter a la ligne selon l'angle
    private lockAngle(event: MouseEvent, angle: number): void {
        const mousePosition = this.getPositionFromMouse(event);
        const point: Vec2 = mousePosition;
        const dx = mousePosition.x - this.pathData[this.pathData.length - 1].x;
        const dy = mousePosition.y - this.pathData[this.pathData.length - 1].y;
        switch (angle) {
            case CONSTANTS.ANGLE_45:
                this.lock45 = true;
                if ((dx > 0 && dy > 0) || (dx < 0 && dy < 0)) {
                    point.y =
                        Math.tan(CONSTANTS.ANGLE_45) * (point.x - this.pathData[this.pathData.length - 1].x) +
                        this.pathData[this.pathData.length - 1].y;
                    console.log(point.y);
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
            default:
                this.lock180 = true;
                point.y = this.pathData[this.pathData.length - 1].y;
                break;
        }
        this.afficherSegementPreviewAngle(event, point);
    }

    // permet d'effacer les ancrage
    private clearlock(): void {
        this.lock180 = false;
        this.lock90 = false;
        this.lock45 = false;
    }
}
