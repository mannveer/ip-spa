import {Injectable} from '@angular/core';
import {Router, NavigationEnd, ActivatedRoute} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {map, filter} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CommonTitleService {
  private defaultTitle = 'PRIYANKA\'S STORE'; // Default title

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title
  ) {}

  public setTitle() {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.router.routerState.root), // Get the root route
        map(root => this.getTitle(this.router.routerState, root)) // Fetch titles
      )
      .subscribe((titles: string[]) => {
        const title = titles.length ? titles[titles.length - 1] : this.defaultTitle;
        this.titleService.setTitle(title);
      });
  }

  private getTitle(state: any, parent: any): string[] {
    const data: string[] = [];
    if (parent && parent.snapshot.data && parent.snapshot.data.title) {
      data.push(parent.snapshot.data.title);
    }
    if (state && parent) {
      data.push(...this.getTitle(state, state.firstChild(parent)));
    }
    return data;
  }
}
