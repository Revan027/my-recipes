import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { RecipeBookService } from './recipe-book.service';

@Directive({
    selector: '[appSwipe]',
    standalone: true,
})
export class SwipeDirective {
    private startClientX: number = 0;

    private moveLineCoord: { X: number; Y: number }[] = [];
    private horizontalLineCoord: { X: number; Y: number }[] = [];

    private previousClientX: number = 0;
    private isSwipeBlocked = false;
    private totalPxMove: number = 0;
    private currentDirection: string = '';
    private readonly directions = { Next: 'NEXT', Prev: 'PREV' };
    private readonly windowWidth = window.innerWidth;

    constructor(
        private el: ElementRef<HTMLElement>,
        private renderer: Renderer2,
        private recipeBookService: RecipeBookService,
    ) {}

    @HostListener('touchmove', ['$event'])
    onMove(e: TouchEvent) {
        /* if(this.isSwipeBlocked) return;
    
        this.isSwipeBlocked = true;

        let clientX = e.changedTouches[0].clientX;
        const pxMove = this.previousClientX - clientX; //avancement en pixel entre 2 moves
        const boundary = this.el.nativeElement.scrollWidth - this.windowWidth;

        // on garde 4 points 

        if(this.previousClientX != 0){//si pas de point précédent
            this.totalPxMove = this.totalPxMove + pxMove;//calcul total de l'avancement

             if(this.totalPxMove < 0){
            }
            else if(this.totalPxMove > boundary){
            }
            else{
                this.translateElement(this.totalPxMove);
            }
        }

        this.setPreviousClientX(clientX);

        this.isSwipeBlocked = false;*/
    }

    @HostListener('touchstart', ['$event'])
    onMoveStart(e: TouchEvent) {
        this.startClientX = e.changedTouches[0].clientX;

        this.moveLineCoord[0] = {
            X: Math.round(this.startClientX),
            Y: Math.round(e.changedTouches[0].clientY),
        };
    }

    @HostListener('touchend', ['$event'])
    onMoveEnd(e: TouchEvent) {
        this.setDirection(e.changedTouches[0].clientX);

        this.moveLineCoord[1] = {
            X: Math.round(e.changedTouches[0].clientX),
            Y: Math.round(e.changedTouches[0].clientY),
        };

        this.horizontalLineCoord[0] = {
            X: Math.round(e.changedTouches[0].clientX + 30),
            Y: Math.round(e.changedTouches[0].clientY),
        };

        this.horizontalLineCoord[1] = {
            X: Math.round(e.changedTouches[0].clientX),
            Y: Math.round(e.changedTouches[0].clientY),
        };

        if (!this.isVerticalSwipe()) 
            this.fetchPage();
    }

    private isVerticalSwipe() {
        // Calcul des coefficient directeur des droites X et Y
        const cMoveLine = this.getSlope(this.moveLineCoord[0], this.moveLineCoord[1]);
        const cHorizontalLine = this.getSlope(
            this.horizontalLineCoord[1],
            this.horizontalLineCoord[0],
        );

        // Calclul de l'angle
        let corner = this.getCorner(cMoveLine, cHorizontalLine);

        corner = corner < 0 ? corner * -1 : corner;

        return corner > 50;
    }

    private getSlope(coordB: any, coordA: any) {
        return (coordA.Y - coordB.Y) / (coordA.X - coordB.X);
    }

    private getCorner(m2: number, m1: number) {
        return (Math.atan((m2 - m1) / (1 + m2 * m1)) * 180) / Math.PI;
    }

    private fetchPage() {
        this.isSwipeBlocked = true;
        
        //on remet à zéro le previousClientX pour redémarrer une page de donnée neuve
        this.setPreviousClientX(0);

        this.handleAdvancement();

        this.isSwipeBlocked = false;
    }

    private setDirection(lastClientX: number): void {
        this.currentDirection = lastClientX < this.startClientX ? this.directions.Next : this.directions.Prev;
    }

    private setPreviousClientX(clientX: number) {
        this.previousClientX = clientX;
    }

    findPageElement(id: number): Element | null {
        return this.el.nativeElement.querySelector('#page-' + id.toString());
    }

    findPageListElement(): Element | null {
        return this.el.nativeElement;
    }

    handleAdvancement() {
        const totalPage = Math.round(this.el.nativeElement.scrollWidth / this.windowWidth);
        const currentBookPage = this.recipeBookService.currentBookPage();

        if (
            this.currentDirection == this.directions.Next &&
            this.recipeBookService.currentBookPage() < totalPage
        ) {
            this.next();
        } else if (this.currentDirection == this.directions.Prev && currentBookPage > 1) {
            this.previous();
        }

        // on recupère l'id de la recette sur la page courante
        const pageElement = Array.from(this.el.nativeElement.querySelectorAll(".recipe-page"))
            .find((e, index: number) => index + 1 ==  this.recipeBookService.currentBookPage())

        this.recipeBookService.currentIDPage.set((pageElement?.getAttribute("data-id") ?? 0) as number)
    }

    next() {
        this.translateElement(this.recipeBookService.currentBookPage() * this.windowWidth); // on prend la taille max d'une page et on * par la position de la page pour avoirt le décalage réel

        this.recipeBookService.currentBookPage.set(this.recipeBookService.currentBookPage() + 1);
    }

    previous() {
        let currentBookPage = this.recipeBookService.currentBookPage();

        this.translateElement((currentBookPage - 1) * this.windowWidth - this.windowWidth); // on prend la taille min d'une page

        this.recipeBookService.currentBookPage.set(currentBookPage - 1);
    }

    translateElement(pxMove: number) {
        this.totalPxMove = pxMove; //on avance le total
        this.renderer.setStyle(this.el.nativeElement, 'will-change', 'transform');
        this.renderer.setStyle(this.el.nativeElement, 'transform', `translate3d(${-pxMove}px,0,0)`);
    }

    removeAnimation() {
        this.renderer.setStyle(this.el.nativeElement, 'transition', 'none');
    }

    addAnimation() {
        this.renderer.setStyle(this.el.nativeElement, 'transition', 'transform 0.3s ease-out');
    }
}
