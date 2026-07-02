import { Directive, ElementRef, HostListener, Renderer2, signal } from '@angular/core';
import { RecipeService } from './recipe-service';

@Directive({
    selector: '[appSwipe]',
    standalone: true,
})
export class SwipeDirective {
    private previousClientX: number = 0;
    private isSwiped = false;
    private totalPxMove: number = 0;
    private currentDirection: string = "";
    private directions = ["NEXT", "PREV"];

    constructor(private el: ElementRef<HTMLElement>, private renderer: Renderer2, private recipeService: RecipeService) {}

    @HostListener('touchmove', ['$event'])
    onMove(e: TouchEvent) {

        if(this.isSwiped == true) return;

        this.isSwiped = true;

        let clientX = e.changedTouches[0].clientX;
        let pxMove = this.previousClientX - clientX; //avancement en pixel entre 2 moves

        this.setDirection(clientX);

        if(this.previousClientX != 0){//si pas de point précédent
            this.totalPxMove = this.totalPxMove + pxMove;//calcul total de l'avancement

            if(this.totalPxMove < 0){
                this.totalPxMove = 0;
                clientX = 0;
            }
            else if(this.totalPxMove > this.el.nativeElement.scrollWidth - window.innerWidth){
                this.totalPxMove = this.el.nativeElement.scrollWidth - window.innerWidth;
                clientX = 0;
            }

            this.moveElement(this.totalPxMove);
        }

        this.recipeService.currentPage.set(this.getPosition());

        this.setPreviousClientX(clientX);

        this.isSwiped = false;
    }

    @HostListener('touchend', ['$event'])
    onMoveEnd(e: TouchEvent) {
        this.isSwiped = true;

         //on remet à zéro le previousClientX pour redémarrer une page de donnée neuve
        this.setPreviousClientX(0);

        //on avance jusqu'a la taille max de la page en cours. Ce qui ménera vers la prochaine page.
        this.moveElement((this.getPosition() - 1) * window.innerWidth);

        this.isSwiped = false;
    }

    private getPosition(){
        return Math.round(this.totalPxMove / window.innerWidth) + 1;//on prend l'entier au dessus, cela représente la taille que prend la page actuellement dans la fenetre
    }

    private setDirection(clientX: number): void{
       this.currentDirection = clientX < this.previousClientX ? this.directions[0] : this.directions[1];
    }

    private setPreviousClientX(clientX: number) {
       this.previousClientX = clientX;
    }

    findElement(id:number): Element | null{
       return this.el.nativeElement.querySelector("#page-"+id.toString());
    }

    moveElement(pxMove: number) {
        this.totalPxMove = pxMove;//on  avance le total
        this.renderer.setStyle(this.el.nativeElement, 'left', `${-pxMove}px`)
    }   
}
