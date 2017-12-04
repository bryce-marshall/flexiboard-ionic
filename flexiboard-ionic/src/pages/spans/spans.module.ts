import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SpansPage } from './spans';
import { FlexiboardModule } from '../../components/flexiboard';

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
