import { Routes } from '@angular/router';
import { AvailableFilesComponent } from './available-files/available-files.component';
import { FileDetailsComponent } from './file-details/file-details.component';
import { FeaturedWorkComponent } from '../personal/featured-work/featured-work.component';

export const filesRoutes: Routes = [
  {
    path: 'files',
    component:FeaturedWorkComponent
      },
      
      {
        path: 'files',
        children: [
          {
            path: 'category/:category',
            component: AvailableFilesComponent
          },
          {
            path: 'file-details/:id',
            component: FileDetailsComponent
          }
        ]
      }
];