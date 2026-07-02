import { Directive, ElementRef, HostListener, Renderer2, signal } from '@angular/core';
import { RecipeService } from './recipe-service';

@Directive({
    selector: '[appSwipe]',
    standalone: true,
})
export class SwipeDirective {
    private startClientX: number = 0;
    private previousClientX: number = 0;
    private isSwipeBlocked = false;
    private totalPxMove: number = 0;
    private currentDirection: string = "";
    private readonly directions = {Next: "NEXT", Prev: "PREV"};
    private readonly windowWidth =  window.innerWidth;

    constructor(private el: ElementRef<HTMLElement>, private renderer: Renderer2, private recipeService: RecipeService) {}

    @HostListener('touchmove', ['$event'])
    onMove(e: TouchEvent) {

        if(this.isSwipeBlocked) return;
    
        this.isSwipeBlocked = true;

        let clientX = e.changedTouches[0].clientX;

       

        const pxMove = this.previousClientX - clientX; //avancement en pixel entre 2 moves
        const boundary = this.el.nativeElement.scrollWidth - window.innerWidth;

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

        this.isSwipeBlocked = false;
    }

    @HostListener('touchstart', ['$event'])
    onMoveStart(e: TouchEvent) {
        this.startClientX = e.changedTouches[0].clientX;
    }

    @HostListener('touchend', ['$event'])
    onMoveEnd(e: TouchEvent) {
         this.setDirection(e.changedTouches[0].clientX);
       this.fecthPage();
    }

    private fecthPage(){
        this.isSwipeBlocked = true;
        //on remet à zéro le previousClientX pour redémarrer une page de donnée neuve
        this.setPreviousClientX(0);

        this.handleAdvancement();
        
        this.isSwipeBlocked = false;
    }

    private setDirection(lastClientX: number): void{
       this.currentDirection =  lastClientX < this.startClientX ? this.directions.Next : this.directions.Prev;
    }

    private setPreviousClientX(clientX: number) {
       this.previousClientX = clientX;
    }

    findElement(id:number): Element | null{
       return this.el.nativeElement.querySelector("#page-"+id.toString());
    }

    handleAdvancement(){
        const totalPage =  Math.round(this.el.nativeElement.scrollWidth / window.innerWidth);
        let currentPage = this.recipeService.currentPage();

        if(this.currentDirection == this.directions.Next && this.recipeService.currentPage() < totalPage){
           this.next();
        }
        else if(this.currentDirection == this.directions.Prev && currentPage > 1){
            this.previous();
        }
    }

    next(){
        this.translateElement(((this.recipeService.currentPage()) * window.innerWidth));// on prend la taille max d'une page

        this.recipeService.currentPage.set(this.recipeService.currentPage() + 1);
    }

    previous(){
        let currentPage = this.recipeService.currentPage();

        this.translateElement(((currentPage - 1) * window.innerWidth) - window.innerWidth); // on prend la taille min d'une page

        this.recipeService.currentPage.set(currentPage - 1);
    }

    translateElement(pxMove: number) {
        this.totalPxMove = pxMove;//on avance le total
        this.renderer.setStyle(this.el.nativeElement, 'will-change', 'transform')
        this.renderer.setStyle(this.el.nativeElement, 'transform', `translate3d(${-pxMove}px,0,0)`);
    }
}
