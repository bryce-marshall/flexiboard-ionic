import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MarkupTemplatePage } from './markup-template';
import { FlexiboardModule } from '../../components/flexiboard/flexiboard.module';

@NgModule({
  declarations: [
    MarkupTemplatePage,
  ],
  imports: [
    FlexiboardModule,
    IonicPageModule.forChild(MarkupTemplatePage),
  ],
})
export class MarkupTemplatePageModule {}
