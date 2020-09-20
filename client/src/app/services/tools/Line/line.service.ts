import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';

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
    // private indexLine: number =0;

    // angle
    // private setAngle: boolean = false;
    // ligne précedente
    // private priviousLine: Vec2[];

    // segment de prévisualisation et point de depart de ce segment
    private pathPreiew: Vec2[];
    private startPoint: Vec2;

    // une ligne est tracé que si le nombre de point est >= 2
    private index: number = 0;

    // quand la touche SHIFT est appuyé
    private shiftPress: boolean = false;

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.name = 'Line';
        this.tooltip = 'Line';
        this.iconName = 'show_chart';
        this.clearPath();
        this.clear();
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.index++;
            console.log(this.index);
            const mousePosition = this.getPositionFromMouse(event);
            this.startPoint = mousePosition;

            if (this.index < 2) {
                this.pathData.push(mousePosition);
            } else {
                this.pathPreiew.push(this.startPoint);
                this.pathData.push(mousePosition);
                this.drawingService.clearCanvas(this.drawingService.baseCtx);
                this.drawLine(this.drawingService.baseCtx, this.pathData);
            }
        }
    }

    onMouseUp(event: MouseEvent): void {
        this.mouseDown = false;
    }

    onMouseMove(event: MouseEvent): void {
        if (this.shiftPress) {
            this.afficherSegementPreview(event);
        }
    }

    // SHIFT appuyé
    onKeyDown(event: KeyboardEvent): void {
        if (event.key === 'Shift') {
            this.shiftPress = true;
            console.log('SHIFT-DOWN');
        }
        if (event.key === 'Delete') {
            this.clearPath();
            this.drawingService.clearCanvas(this.drawingService.baseCtx);
        }
    }

    // SHIFT relaché
    onKeyUp(event: KeyboardEvent): void {
        if (event.key === 'Shift') {
            this.shiftPress = false;
            console.log('SHIFT-UP');
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
        }
    }

    // dessine la ligne
    private drawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.beginPath();
        for (const point of path) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();
    }

    private afficherSegementPreview(event: MouseEvent): void {
        const mousePosition = this.getPositionFromMouse(event);
        // si on a pas encore commencer de ligne
        if (this.index < 2) {
            this.startPoint = mousePosition;
        }
        // on suprime l'ancien segment et on définit le nouveau
        this.clear();
        this.pathPreiew.push(this.startPoint);
        this.pathPreiew.push(mousePosition);
        // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris

        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.drawLine(this.drawingService.previewCtx, this.pathPreiew);
    }

    private clearPath(): void {
        this.pathData = [];
    }

    // nettoit le segment de prévisualisation
    private clear(): void {
        this.pathPreiew = [];
    }
}
