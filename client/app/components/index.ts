import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MdlModule } from 'angular2-mdl';
import { Ng2PaginationModule } from 'ng2-pagination';

import { PlayerComponent } from './player/player.component';
import { SalesPreviewComponent } from './sales-preview/sales-preview.component';
import { SalesPreviewListComponent } from './sales-preview-list/sales-preview-list.component';
import { ReleasePreviewComponent } from './release-preview/release-preview.component';
import { ReleasePreviewListComponent } from './release-preview-list/release-preview-list.component';
import { WantPreviewListComponent } from './want-preview-list/want-preview-list.component';
import { SearchBoxComponent } from './search-box/search-box.component';
import { SearchResultComponent } from './search-result/search-result.component';
import { ReleaseDetailComponent } from './release-detail/release-detail.component';
import { VideoListComponent } from './video-list/video-list.component';
// import { LayoutHeaderComponent } from './layout-header/layout-header.component';
// import { LayoutContentComponent } from './layout-content/layout-content.component';

import { PipesModule } from '../pipes';

export const COMPONENTS = [
  PlayerComponent,
  ReleasePreviewComponent,
  ReleasePreviewListComponent,
  WantPreviewListComponent,
  SearchBoxComponent,
  SearchResultComponent,
  SalesPreviewComponent,
  SalesPreviewListComponent,
  ReleaseDetailComponent,
  VideoListComponent
  // LayoutHeaderComponent,
  // LayoutContentComponent
];


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    PipesModule,
    MdlModule,
    Ng2PaginationModule
  ],
  declarations: COMPONENTS,
  exports: COMPONENTS
})
export class ComponentsModule { }
