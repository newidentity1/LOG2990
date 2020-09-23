import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';

const MINIMAL_DISTANCE = 50;
const LINE_WIDTH = 10;

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
export class LineService extends Tool {
    // ligne principale
    private pathData: Vec2[];
    private index: number = 0;

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.name = 'Line';
        this.tooltip = 'Line';
        this.iconName = 'show_chart';
        this.clearPath();
    }

    onClick(event: MouseEvent): void {
        console.log('CLICK');
        this.mouseDown = event.button === MouseButton.Left;

        this.index++;
        console.log(this.index);
        const mousePosition = this.getPositionFromMouse(event);

        if (this.index < 2) {
            this.pathData.push(mousePosition);
        } else {
            this.pathData.push(mousePosition);
            // this.drawingService.clearCanvas(this.drawingService.baseCtx);

            this.drawLine(this.drawingService.previewCtx, this.pathData);
        }
    }

    onMouseMove(event: MouseEvent): void {
        this.afficherSegementPreview(event);
    }

    // SHIFT appuyé
    onKeyDown(event: KeyboardEvent): void {
        event.preventDefault();
        if (event.key === 'Shift') {
            this.drawLine(this.drawingService.previewCtx, this.pathData);
            // this.shiftPress = true;
            console.log('SHIFT-DOWN');
        }
        if (event.code === 'Backspace') {
            if (this.pathData.length >= 2) {
                this.pathData.pop();
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                // this.drawingService.clearCanvas(this.drawingService.baseCtx);
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
            console.log('SHIFT-UP');
        }
    }

    // dessine la ligne
    private drawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.lineWidth = LINE_WIDTH;
        ctx.beginPath();
        for (const point of path) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();
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

    private clearPath(): void {
        this.pathData = [];
    }
}
