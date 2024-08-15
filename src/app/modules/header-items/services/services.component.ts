import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { sample } from 'rxjs';
import { ItemListComponent } from '../../../core/components/item-list/item-list.component';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule,ItemListComponent],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css'
})
export class ServicesComponent {

  services = [
    {
      title: 'Thumbnail Design',
      description: 'Eye-catching thumbnails to increase your video click-through rates.',
      sampleFiles: Math.floor(Math.random() * 10) + 1
    },
    {
      title: 'Mockup Design',
      description: 'High-quality mockups to visualize your products and presentations.',
      sampleFiles: Math.floor(Math.random() * 10) + 1
    },
    {
      title: 'Business Cards',
      description: 'Professional business cards that leave a lasting impression.',
      sampleFiles: Math.floor(Math.random() * 10) + 1
    },
    {
      title: 'Social Media Graphics',
      description: 'Engaging graphics for your social media channels.',
      sampleFiles: Math.floor(Math.random() * 10) + 1
    },
    {
      title: 'Brochures and Flyers',
      description: 'Attractive brochures and flyers to promote your business.',
      sampleFiles: Math.floor(Math.random() * 10) + 1
    },
    {
      title: 'Banner Design',
      description: 'Attention-grabbing banners for both online and offline use.',
      sampleFiles: Math.floor(Math.random() * 10) + 1
    }
  ];
  
  showSamples: boolean = false;

  viewSamples(service:any) {
    console.log("this.showSamples - ",this.showSamples);
    this.showSamples = true;
  }

  closeSamples() {
    this.showSamples = false;
  }

}
