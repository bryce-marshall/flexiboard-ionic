import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ThemesPage } from './themes';
import { FlexiboardModule } from '@brycemarshall/flexiboard-ionic';

@NgModule({
  declarations: [
    ThemesPage,
  ],
  imports: [
    FlexiboardModule,
    IonicPageModule.forChild(ThemesPage),
  ],
})
export class ThemesPageModule {}
