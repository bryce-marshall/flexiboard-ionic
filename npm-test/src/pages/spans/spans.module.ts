import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SpansPage } from './spans';
import { FlexiboardModule } from '@brycemarshall/flexiboard-ionic';

@NgModule({
  declarations: [
    SpansPage,
  ],
  imports: [
    FlexiboardModule,
    IonicPageModule.forChild(SpansPage),
  ]
})
export class SpansPageModule {}
