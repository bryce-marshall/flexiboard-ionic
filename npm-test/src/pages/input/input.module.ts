import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InputPage } from './input';
import { FlexiboardModule } from '@brycemarshall/flexiboard-ionic';

@NgModule({
  declarations: [
    InputPage,
  ],
  imports: [
    FlexiboardModule,
    IonicPageModule.forChild(InputPage),
  ],
})
export class InputPageModule {}
