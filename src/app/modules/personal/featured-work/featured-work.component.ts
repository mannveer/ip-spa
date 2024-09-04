import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
interface Project {
  title: string;
  description: string;
  imageUrl: string;
  projectUrl: string;
  category: string;
}


@Component({
  selector: 'app-featured-work',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './featured-work.component.html',
  styleUrl: './featured-work.component.css'
})


  export class FeaturedWorkComponent implements OnInit {
    projects: Project[] = [];
  displayedProjects: Project[] = [];
  currentPage: number = 0;
  projectsPerPage: number = 4;
  currentCategory: string = 'all'; // Track the current category filter
  allProjects: Project[] = [];
  categories: string[] = [];
  
    constructor() { }
  
    ngOnInit(): void {
      // Temporary images from the internet for a classy and professional look
      this.allProjects = [
        {
          title: 'Thumbnail Design',
          description: 'Creating eye-catching and engaging thumbnail designs for online content.',
          imageUrl: 'https://via.placeholder.com/600x400.png?text=Thumbnail+Design',
          projectUrl: '/files/category/thumbnails-design',
          category: 'Graphic Design'
        },
        {
          title: 'Luxury Brand Identity',
          description: 'Crafting a high-end brand identity for a luxury fashion line.',
          imageUrl: 'https://via.placeholder.com/600x400.png?text=Luxury+Brand+Identity',
          projectUrl: '/files/luxury-brand',
          category: 'Branding'
        },
        {
          title: 'Art Magazine Editorial',
          description: 'Creating a visually compelling editorial layout for an art-focused magazine.',
          imageUrl: 'https://via.placeholder.com/600x400.png?text=Art+Magazine+Editorial',
          projectUrl: '/portfolio/art-magazine',
          category: 'Print Design'
        },
        {
          title: 'Corporate Brochure Design',
          description: 'Designing a professional brochure for a corporate client.',
          imageUrl: 'https://via.placeholder.com/600x400.png?text=Corporate+Brochure+Design',
          projectUrl: '/portfolio/corporate-brochure',
          category: 'Print Design'
        },
        {
          title: 'Product Packaging Design',
          description: 'Creating elegant and functional packaging for a premium product line.',
          imageUrl: 'https://via.placeholder.com/600x400.png?text=Product+Packaging+Design',
          projectUrl: '/portfolio/product-packaging',
          category: 'Packaging Design'
        }
      ];
      // this.categories = 
      this.allProjects.forEach(x=>{
        if(this.categories.indexOf(x.category) == -1) this.categories.push(x.category)
      })
    console.log(this.categories)
      this.projects = this.allProjects;
      this.updateDisplayedProjects();

    }
    
    filterProjects(category: string): void {
      this.currentCategory = category; // Update the current category
      this.currentPage = 0; // Reset to first page
      this.updateDisplayedProjects();
    }
  
    loadPreviousPage(): void {
      if (this.currentPage > 0) {
        this.currentPage--;
        this.updateDisplayedProjects();
      }
    }
  
    loadNextPage(): void {
      if ((this.currentPage + 1) * this.projectsPerPage < this.getFilteredProjects().length) {
        this.currentPage++;
        this.updateDisplayedProjects();
      }
    }
  
    private updateDisplayedProjects(): void {
      const filteredProjects = this.getFilteredProjects();
      this.displayedProjects = filteredProjects.slice(
        this.currentPage * this.projectsPerPage,
        (this.currentPage + 1) * this.projectsPerPage
      );
    }
  
    getFilteredProjects(): Project[] {
      if (this.currentCategory === 'all') {
        this.projects = this.allProjects;
        return this.projects;
      } else {
        const pr = this.allProjects.filter(project => project.category === this.currentCategory);
        console.log("pr - ",pr)
        this.projects = pr;
        return pr;
      }
    }
  }
  