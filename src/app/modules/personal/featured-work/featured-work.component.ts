import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { trigger, transition, query, style, stagger, animate, state } from '@angular/animations';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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
    imports: [
        CommonModule,
        RouterModule,
    ],
    templateUrl: './featured-work.component.html',
    styleUrls: ['./featured-work.component.css'],
    // animations: [
    //   trigger('staggerAnimation', [
    //     transition('* => *', [
    //       query(':enter', [
    //         style({ opacity: 0, transform: 'translateY(20px)' }),
    //         stagger(100, [
    //           animate('0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    //             style({ opacity: 1, transform: 'translateY(0)' }))
    //         ])
    //       ], { optional: true })
    //     ])
    //   ]),
    //   trigger('cardAnimation', [
    //     state('active', style({ opacity: 1 })),
    //     state('inactive', style({ opacity: 0.5 })),
    //     transition('active <=> inactive', animate('0.3s ease'))
    //   ])
    // ]
   })

export class FeaturedWorkComponent implements OnInit {
  projects: Project[] = [];
  displayedProjects: Project[] = [];
  currentPage: number = 0;
  projectsPerPage: number = 4;
  currentCategory: string = 'all';
  allProjects: Project[] = [];
  categories: string[] = [];
  private apiUrlEnv = environment.apiUrl;
  private API_URL = `${this.apiUrlEnv}/projects`;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<Project[]>(this.API_URL).subscribe(
      (data) => {
      this.allProjects = data;
      this.projects = this.allProjects;
      this.updateDisplayedProjects();
      this.allProjects.forEach((x) => {
        if (this.categories.indexOf(x.category) === -1) this.categories.push(x.category);
      });
      this.categories = ['all', ...this.categories];
      },
      (error) => {
      console.error('Error fetching projects:', error);
      }
    );
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