# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MADLAB is a collaborative educational project between MADFAM and La Ciencia Del Juego, focused on bringing gamified science and technology learning to primary schools in Mexico. The project addresses topics aligned with global Sustainable Development Goals (SDGs) and Mexican national competency standards.

## Key Project Details

- **Duration**: 81 days (August 11 - October 31, 2025)
- **Team**: 5 members (Aldo, Nuri, Luis, Silvia, Caro)
- **Focus Areas**: Clean water, clean energy, and recycling
- **Target**: 20-100 students per 3-hour presentation

## Architecture

### Core Files

- `index.html` - Interactive bilingual project dashboard with task management
- `README.md` - Comprehensive project documentation in Spanish

### Dashboard Features

The `index.html` file is a self-contained single-page application featuring:

- **Bilingual Support**: Spanish/English toggle with complete translation system
- **Theme System**: Auto/light/dark mode with localStorage persistence
- **Responsive Design**: Mobile-first approach with touch-friendly interactions
- **Task Management**: 109 tasks across 5 project phases with filtering and search
- **Team Visualization**: Individual task assignments and hour tracking

### Technical Implementation

- **Pure HTML/CSS/JavaScript**: No external dependencies
- **CSS Custom Properties**: Consistent theming and responsive design
- **LocalStorage**: Theme preferences persistence
- **Mobile Optimized**: Touch-friendly UI with proper viewport handling

## Data Structure

The dashboard manages project data through a comprehensive JavaScript object containing:

- **5 Project Phases**: Foundation, Content Development, Pilot Preparation, Pilot & Iteration, Launch Ready
- **Task Hierarchy**: Phases → Sections → Individual Tasks
- **Task Properties**: ID, name (bilingual), assignee, duration, difficulty (1-5), dependencies
- **Translation System**: Complete bilingual support for all UI elements

## Team Structure

- **Aldo**: CEO MADFAM, Tech Lead (116.5 hours, 24 tasks)
- **Nuri**: Strategy Officer MADFAM (86.5 hours, 19 tasks)  
- **Luis**: La Ciencia del Juego Representative (102 hours, 20 tasks)
- **Silvia**: Marketing Guru (115.5 hours, 23 tasks)
- **Caro**: Designer and Teacher (102 hours, 22 tasks)

## Development Guidelines

### When Working with the Dashboard

- **Maintain Bilingual Support**: All new content must include both Spanish and English versions
- **Preserve Responsive Design**: Test changes on mobile and desktop viewports
- **Follow CSS Architecture**: Use existing custom properties for consistent theming
- **Task Data Format**: Follow the established object structure for any new tasks

### Accessibility Standards

- Minimum 44px touch targets for mobile
- Proper ARIA labels and semantic HTML
- Keyboard navigation support
- Color contrast compliance for both themes

### Browser Support

The dashboard is designed to work across modern browsers with:
- CSS Grid and Flexbox
- ES6+ JavaScript features
- CSS Custom Properties
- LocalStorage API

## Project Context

This is a high-stakes educational initiative with specific deliverables and timelines. When making changes:

- Respect the bilingual nature of all communications
- Maintain the project's educational and professional tone
- Consider the collaborative nature of the team structure
- Keep the gamified learning objectives in mind

## File Modification Notes

- The HTML file is fully self-contained with embedded CSS and JavaScript
- Any changes should maintain the single-file architecture
- The translation system is complete and should be extended for new features
- Task data is embedded in JavaScript and follows a specific schema