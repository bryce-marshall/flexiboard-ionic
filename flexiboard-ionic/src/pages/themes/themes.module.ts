import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ThemesPage } from './themes';
import { FlexiboardModule } from '../../components/flexiboard/flexiboard.module';

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
