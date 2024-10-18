import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';

interface Project {
  title: string;
  description: string;
  imageUrl: string;
  projectUrl: string;
  category: string;
  available: boolean;
}

@Component({
  selector: 'app-featured-work',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatGridListModule,
    MatPaginatorModule,
    MatChipsModule,
    MatDividerModule,
  ],
  templateUrl: './featured-work.component.html',
  styleUrls: ['./featured-work.component.css'],
})
export class FeaturedWorkComponent implements OnInit {
  projects: Project[] = [];
  displayedProjects: Project[] = [];
  currentPage: number = 0;
  projectsPerPage: number = 4;
  currentCategory: string = 'all';
  allProjects: Project[] = [];
  categories: string[] = [];

  constructor() {}

  ngOnInit(): void {
    // Same project list as earlier
    this.allProjects = [
      {
        title: 'Thumbnail Design',
        description: 'Creating eye-catching and engaging thumbnail designs for online content.',
        imageUrl: 'https://via.placeholder.com/600x400.png?text=Thumbnail+Design',
        projectUrl: '/files/category/thumbnails-design',
        category: 'Graphic Design',
        available: true
      },
      {
        title: 'Luxury Brand Identity',
        description: 'Crafting a high-end brand identity for a luxury fashion line.',
        imageUrl: 'https://via.placeholder.com/600x400.png?text=Luxury+Brand+Identity',
        projectUrl: '/files/luxury-brand',
        category: 'Branding',
        available: false
      },
      {
        title: 'Art Magazine Editorial',
        description: 'Creating a visually compelling editorial layout for an art-focused magazine.',
        imageUrl: 'https://via.placeholder.com/600x400.png?text=Art+Magazine+Editorial',
        projectUrl: '/portfolio/art-magazine',
        category: 'Print Design',
        available: false
      },
      {
        title: 'Corporate Brochure Design',
        description: 'Designing a professional brochure for a corporate client.',
        imageUrl: 'https://via.placeholder.com/600x400.png?text=Corporate+Brochure+Design',
        projectUrl: '/portfolio/corporate-brochure',
        category: 'Print Design',
        available: false
      },
      {
        title: 'Product Packaging Design',
        description: 'Creating elegant and functional packaging for a premium product line.',
        imageUrl: 'https://via.placeholder.com/600x400.png?text=Product+Packaging+Design',
        projectUrl: '/portfolio/product-packaging',
        category: 'Packaging Design',
        available: false
      }
    ];

    this.allProjects.forEach((x) => {
      if (this.categories.indexOf(x.category) == -1) this.categories.push(x.category);
    });

    this.projects = this.allProjects;
    this.updateDisplayedProjects();
  }

  filterProjects(category: string): void {
    this.currentCategory = category;
    this.currentPage = 0;
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
      const pr = this.allProjects.filter((project) => project.category === this.currentCategory);
      this.projects = pr;
      return pr;
    }
  }
}
