// Theme Service Example for KAR Admin
// Place this in: src/app/core/services/theme.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type ThemeMode = 'light' | 'dark';
export type MenuColor = 'light' | 'dark' | 'gray' | 'gradient';
export type TopbarColor = 'light' | 'dark' | 'gray' | 'gradient';

interface ThemeConfig {
  mode: ThemeMode;
  menuColor: MenuColor;
  topbarColor: TopbarColor;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'kar-theme-config';
  
  private themeConfig$ = new BehaviorSubject<ThemeConfig>({
    mode: 'light',
    menuColor: 'light',
    topbarColor: 'light'
  });

  constructor() {
    this.loadThemeFromStorage();
  }

  /**
   * Get current theme configuration as observable
   */
  getThemeConfig(): Observable<ThemeConfig> {
    return this.themeConfig$.asObservable();
  }

  /**
   * Get current theme configuration value
   */
  getCurrentTheme(): ThemeConfig {
    return this.themeConfig$.value;
  }

  /**
   * Set theme mode (light/dark)
   */
  setThemeMode(mode: ThemeMode): void {
    const config = { ...this.themeConfig$.value, mode };
    this.applyTheme(config);
  }

  /**
   * Toggle between light and dark mode
   */
  toggleThemeMode(): void {
    const currentMode = this.themeConfig$.value.mode;
    const newMode: ThemeMode = currentMode === 'light' ? 'dark' : 'light';
    this.setThemeMode(newMode);
  }

  /**
   * Set menu color
   */
  setMenuColor(menuColor: MenuColor): void {
    const config = { ...this.themeConfig$.value, menuColor };
    this.applyTheme(config);
  }

  /**
   * Set topbar color
   */
  setTopbarColor(topbarColor: TopbarColor): void {
    const config = { ...this.themeConfig$.value, topbarColor };
    this.applyTheme(config);
  }

  /**
   * Set complete theme configuration
   */
  setThemeConfig(config: ThemeConfig): void {
    this.applyTheme(config);
  }

  /**
   * Apply predefined theme presets
   */
  applyPreset(preset: 'full-light' | 'full-dark' | 'mixed' | 'premium-dark'): void {
    let config: ThemeConfig;

    switch (preset) {
      case 'full-light':
        config = {
          mode: 'light',
          menuColor: 'light',
          topbarColor: 'light'
        };
        break;

      case 'full-dark':
        config = {
          mode: 'dark',
          menuColor: 'dark',
          topbarColor: 'dark'
        };
        break;

      case 'mixed':
        config = {
          mode: 'light',
          menuColor: 'dark',
          topbarColor: 'gradient'
        };
        break;

      case 'premium-dark':
        config = {
          mode: 'dark',
          menuColor: 'gradient',
          topbarColor: 'gradient'
        };
        break;

      default:
        config = this.themeConfig$.value;
    }

    this.applyTheme(config);
  }

  /**
   * Reset theme to default
   */
  resetTheme(): void {
    const defaultConfig: ThemeConfig = {
      mode: 'light',
      menuColor: 'light',
      topbarColor: 'light'
    };
    this.applyTheme(defaultConfig);
  }

  /**
   * Apply theme configuration to DOM and save to storage
   */
  private applyTheme(config: ThemeConfig): void {
    const html = document.documentElement;

    // Apply theme mode
    html.setAttribute('data-bs-theme', config.mode);

    // Apply menu color
    html.setAttribute('data-menu-color', config.menuColor);

    // Apply topbar color
    html.setAttribute('data-topbar-color', config.topbarColor);

    // Update state
    this.themeConfig$.next(config);

    // Save to storage
    this.saveThemeToStorage(config);

    // Emit event for other components
    this.emitThemeChangeEvent(config);
  }

  /**
   * Load theme from localStorage
   */
  private loadThemeFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.THEME_KEY);
      if (stored) {
        const config: ThemeConfig = JSON.parse(stored);
        this.applyTheme(config);
      } else {
        // Check system preference
        this.applySystemPreference();
      }
    } catch (error) {
      console.error('Error loading theme from storage:', error);
      this.applySystemPreference();
    }
  }

  /**
   * Save theme to localStorage
   */
  private saveThemeToStorage(config: ThemeConfig): void {
    try {
      localStorage.setItem(this.THEME_KEY, JSON.stringify(config));
    } catch (error) {
      console.error('Error saving theme to storage:', error);
    }
  }

  /**
   * Apply system color scheme preference
   */
  private applySystemPreference(): void {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const mode: ThemeMode = prefersDark ? 'dark' : 'light';
    
    this.setThemeMode(mode);

    // Listen for system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      const newMode: ThemeMode = e.matches ? 'dark' : 'light';
      this.setThemeMode(newMode);
    });
  }

  /**
   * Emit custom event for theme change
   */
  private emitThemeChangeEvent(config: ThemeConfig): void {
    const event = new CustomEvent('themeChange', { detail: config });
    window.dispatchEvent(event);
  }

  /**
   * Check if current theme is dark
   */
  isDarkMode(): boolean {
    return this.themeConfig$.value.mode === 'dark';
  }

  /**
   * Check if current theme is light
   */
  isLightMode(): boolean {
    return this.themeConfig$.value.mode === 'light';
  }
}


// ============================================
// USAGE EXAMPLES
// ============================================

/*

1. In your component:

import { Component, OnInit } from '@angular/core';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  isDarkMode = false;

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    // Subscribe to theme changes
    this.themeService.getThemeConfig().subscribe(config => {
      this.isDarkMode = config.mode === 'dark';
      console.log('Theme changed:', config);
    });
  }

  toggleTheme() {
    this.themeService.toggleThemeMode();
  }

  setLightTheme() {
    this.themeService.applyPreset('full-light');
  }

  setDarkTheme() {
    this.themeService.applyPreset('full-dark');
  }

  setMixedTheme() {
    this.themeService.applyPreset('mixed');
  }

  setPremiumTheme() {
    this.themeService.applyPreset('premium-dark');
  }
}

2. In your template:

<div class="theme-switcher">
  <button class="btn btn-glass" (click)="toggleTheme()">
    <i [class]="isDarkMode ? 'icon-sun' : 'icon-moon'"></i>
    {{ isDarkMode ? 'Light Mode' : 'Dark Mode' }}
  </button>
</div>

<!-- Or use a dropdown -->
<div class="dropdown">
  <button class="btn btn-gold dropdown-toggle" data-bs-toggle="dropdown">
    Theme
  </button>
  <ul class="dropdown-menu glass-card-dark">
    <li><a class="dropdown-item" (click)="setLightTheme()">Full Light</a></li>
    <li><a class="dropdown-item" (click)="setDarkTheme()">Full Dark</a></li>
    <li><a class="dropdown-item" (click)="setMixedTheme()">Mixed (Recommended)</a></li>
    <li><a class="dropdown-item" (click)="setPremiumTheme()">Premium Dark</a></li>
  </ul>
</div>

3. In your navbar component:

export class NavbarComponent {
  constructor(public themeService: ThemeService) {}

  get isDark() {
    return this.themeService.isDarkMode();
  }

  toggleTheme() {
    this.themeService.toggleThemeMode();
  }
}

<button class="btn btn-icon btn-glass" (click)="toggleTheme()">
  <i [class]="isDark ? 'icon-sun text-gold' : 'icon-moon text-gold'"></i>
</button>

*/
