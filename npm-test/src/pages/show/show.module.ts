import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShowPage } from './show';
import { FlexiboardModule } from '@brycemarshall/flexiboard-ionic';

@NgModule({
  declarations: [
    ShowPage,
  ],
  imports: [
    FlexiboardModule,
    IonicPageModule.forChild(ShowPage),
  ],
})
export class ShowPageModule {}
