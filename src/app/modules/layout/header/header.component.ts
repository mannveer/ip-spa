import { Component, Renderer2, Inject, OnInit } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  public isDarkMode: boolean = false;

  constructor(private renderer: Renderer2, @Inject(DOCUMENT) private document: Document) {}

  ngOnInit(): void {
    // Check if dark mode was previously enabled
    this.isDarkMode = localStorage.getItem('theme') === 'dark';
    if (this.isDarkMode) {
      this.renderer.addClass(this.document.body, 'dark-mode');
    }
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      this.renderer.addClass(this.document.body, 'dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      this.renderer.removeClass(this.document.body, 'dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }

  onMouseMove(event: MouseEvent): void {
    const logoText = (event.currentTarget as HTMLElement)?.querySelector('.logo-text');
    if (logoText) {
      const xPos = event.pageX - logoText.getBoundingClientRect().left;
      const yPos = event.pageY - logoText.getBoundingClientRect().top;
      (logoText as HTMLElement).style.backgroundPosition = `${xPos}px ${yPos}px`;
    }
  }

}
