import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from '../Header';
import { useAppStore } from '../../stores/appStore';

describe('Header', () => {
  beforeEach(() => {
    // Reset store to default state before each test
    useAppStore.setState({
      theme: 'auto',
      language: 'es',
    });
  });

  it('should render the header component', () => {
    render(<Header />);

    // Header should be in the document
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
  });

  it('should display the project title', () => {
    render(<Header />);

    // Should display Spanish title by default
    expect(screen.getByText(/MADLAB/i)).toBeInTheDocument();
  });

  it('should toggle language when language button is clicked', () => {
    render(<Header />);

    // Find language button
    const languageButton = screen.getByText('ES');

    // Initial language is Spanish
    expect(useAppStore.getState().language).toBe('es');

    // Click to switch to English
    fireEvent.click(languageButton);

    // Language should now be English
    expect(useAppStore.getState().language).toBe('en');
  });

  it('should change theme when theme buttons are clicked', () => {
    render(<Header />);

    // Initial theme is auto
    expect(useAppStore.getState().theme).toBe('auto');

    // Find theme buttons by their SVG icons (Sun and Moon icons)
    const buttons = screen.getAllByRole('button');

    const lightButton = buttons.find(btn => btn.querySelector('svg.lucide-sun'));
    const darkButton = buttons.find(btn => btn.querySelector('svg.lucide-moon'));

    // Click light theme
    if (lightButton) {
      fireEvent.click(lightButton);
      expect(useAppStore.getState().theme).toBe('light');
    }

    // Click dark theme
    if (darkButton) {
      fireEvent.click(darkButton);
      expect(useAppStore.getState().theme).toBe('dark');
    }
  });

  it('should highlight the active theme button', () => {
    render(<Header />);

    const buttons = screen.getAllByRole('button');
    const autoButton = buttons.find(btn => btn.querySelector('svg.lucide-monitor'));

    // Auto button should have active styling (includes 'bg-white' class)
    if (autoButton) {
      expect(autoButton.className).toContain('bg-white');
    }
  });

  it('should render UserSwitcher component', () => {
    render(<Header />);

    // UserSwitcher should be rendered (it contains a select element)
    const userSelect = screen.getByRole('combobox');
    expect(userSelect).toBeInTheDocument();
  });

  it('should display start date information', () => {
    render(<Header />);

    // Should display date information
    const dateText = screen.getByText(/agosto|august/i);
    expect(dateText).toBeInTheDocument();
  });
});
