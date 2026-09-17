import { Component, effect, OnInit, signal } from '@angular/core';
import { AppInitService } from '../../Services/app-init.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  imports: [MatIconModule],
  selector: 'app-loading',
  templateUrl: './loading.page.html',
  styleUrls: ['./loading.page.scss'],
})
export class LoadingPage implements OnInit {

  dots = signal<string>("");
  private timer?: number;

  constructor(private appInitService: AppInitService) {
    effect(() => {
      const isAppInit = this.appInitService.isAppInit();

      if(isAppInit){
        clearInterval(this.timer)
      }
    });
   }

  ngOnInit() {
    this.appInitService.init();
    
    this.fillDots();
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }

  private fillDots(){
    this.timer = window.setInterval(() => {
      if(this.dots().length == 4 ){
        this.dots.set(".");
      }
      else{
        this.dots.update((dots: string) => dots + ".");
      }
    }, 300);
  }
}
