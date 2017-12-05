import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DisablePage } from './disable';
import { FlexiboardModule } from '@brycemarshall/flexiboard-ionic';

@NgModule({
  declarations: [
    DisablePage,
  ],
  imports: [
    FlexiboardModule,
    IonicPageModule.forChild(DisablePage),
  ],
})
export class DisablePageModule {}
