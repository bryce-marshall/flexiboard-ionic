import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MarkupTemplatePage } from './markup-template';
import { FlexiboardModule } from '@brycemarshall/flexiboard-ionic';

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
