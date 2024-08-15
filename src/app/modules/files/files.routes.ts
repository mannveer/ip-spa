import { Routes } from '@angular/router';
import { AvailableFilesComponent } from './available-files/available-files.component';
import { FileDetailsComponent } from './file-details/file-details.component';

export const filesRoutes: Routes = [
  {
    path: 'files',
    component: AvailableFilesComponent,
    // children: [
    //   {
    //     path: 'file-details/:fileName',
    //     data: {
    //       path: 'FILES',
    //       title: 'Available files'
    //     },
    //     component: FileDetailsComponent
      },
      
      {
        path: 'files',
        children: [
          {
            path: 'file-details/:id',
            component: FileDetailsComponent
          }
        ]
      }
];