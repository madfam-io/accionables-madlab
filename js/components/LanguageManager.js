// ==========================================================================
// Language Manager Component
// ==========================================================================

import { Component } from './Component.js';
import { translations } from '../data/translations.js';

export class LanguageManager extends Component {
    constructor(element, state) {
        super(element, state);
        this.subscribeToState('currentLang', () => this.update());
    }

    /**
     * Get translations for current language
     * @param {string} [lang] - Optional language override
     * @returns {Object} Translation object
     */
    getTranslations(lang = null) {
        const currentLang = lang || this.state.getState('currentLang');
        return translations[currentLang] || translations.es;
    }

    /**
     * Get translated text for a key
     * @param {string} key - Translation key
     * @param {string} [lang] - Optional language override
     * @returns {string} Translated text
     */
    t(key, lang = null) {
        const t = this.getTranslations(lang);
        const keys = key.split('.');
        let result = t;
        
        for (const k of keys) {
            result = result?.[k];
            if (result === undefined) break;
        }
        
        return result || key;
    }

    /**
     * Set language and update interface
     * @param {string} lang - Language code ('es' or 'en')
     */
    setLanguage(lang) {
        if (!['es', 'en'].includes(lang)) {
            console.warn(`Invalid language: ${lang}`);
            return;
        }

        this.state.setState({ currentLang: lang });
        this.updateInterface();
        
        // Dispatch custom event for external listeners
        window.dispatchEvent(new CustomEvent('languagechange', {
            detail: { language: lang, translations: this.getTranslations(lang) }
        }));
    }

    /**
     * Toggle between Spanish and English
     */
    toggleLanguage() {
        const currentLang = this.state.getState('currentLang');
        const newLang = currentLang === 'es' ? 'en' : 'es';
        this.setLanguage(newLang);
    }

    /**
     * Update all translatable elements in the interface
     */
    updateInterface() {
        const currentLang = this.state.getState('currentLang');
        const t = this.getTranslations();

        // Update elements with data attributes
        document.querySelectorAll('[data-es], [data-en]').forEach(element => {
            const translation = element.dataset[currentLang];
            if (translation) {
                element.textContent = translation;
            }
        });

        // Update specific elements by ID
        this.updateElementById('heroTitle', t.heroTitle);
        this.updateElementById('heroSubtitle', t.heroSubtitle);
        this.updateElementById('heroStartDate', t.startDate);
        this.updateElementById('searchBox', null, 'placeholder', t.searchPlaceholder);
        this.updateElementById('langToggle', currentLang === 'es' ? 'English' : 'Español');

        // Update filter options
        this.updateFilterOptions(t);
        
        // Update stat labels
        this.updateStatLabels(t);

        // Update phase titles
        this.updatePhaseTitles(t);
    }

    /**
     * Update element content by ID
     * @param {string} id - Element ID
     * @param {string} content - Content to set
     * @param {string} [property] - Property to update (default: textContent)
     * @param {string} [value] - Value to set (defaults to content)
     */
    updateElementById(id, content, property = 'textContent', value = null) {
        const element = document.getElementById(id);
        if (element && content !== undefined) {
            element[property] = value !== null ? value : content;
        }
    }

    /**
     * Update filter dropdown options
     * @param {Object} t - Translations object
     */
    updateFilterOptions(t) {
        // Team filter
        const teamDefault = this.$('#teamFilter option[value=""]');
        if (teamDefault) teamDefault.textContent = t.allMembers;

        // Difficulty filter
        const difficultyDefault = this.$('#difficultyFilter option[value=""]');
        if (difficultyDefault) difficultyDefault.textContent = t.allDifficulty;

        // Update difficulty level options
        for (let i = 1; i <= 5; i++) {
            const option = this.$(`#difficultyFilter option[value="${i}"]`);
            if (option) option.textContent = `${t.level} ${i}`;
        }

        // Phase filter
        const phaseDefault = this.$('#phaseFilter option[value=""]');
        if (phaseDefault) {
            phaseDefault.textContent = this.state.getState('currentLang') === 'es' ? 'Todas las Fases' : 'All Phases';
        }

        // Duration filter
        const durationDefault = this.$('#durationFilter option[value=""]');
        if (durationDefault) {
            durationDefault.textContent = this.state.getState('currentLang') === 'es' ? 'Toda Duración' : 'All Duration';
        }

        // Update phase options
        Object.entries(t.phases || {}).forEach(([phaseNum, phaseTitle]) => {
            const option = this.$(`#phaseFilter option[value="${phaseNum}"]`);
            if (option) option.textContent = phaseTitle;
        });
    }

    /**
     * Update statistics card labels
     * @param {Object} t - Translations object
     */
    updateStatLabels(t) {
        const statLabels = this.$$('.stat-label');
        const labelKeys = ['tasks', 'projectDays', 'estimatedHours', 'teamMembers'];
        
        statLabels.forEach((label, index) => {
            const key = labelKeys[index];
            if (key && label.dataset.es && label.dataset.en) {
                // Use data attributes if available
                const currentLang = this.state.getState('currentLang');
                label.textContent = label.dataset[currentLang];
            }
        });
    }

    /**
     * Update phase titles in the main content
     * @param {Object} t - Translations object
     */
    updatePhaseTitles(t) {
        this.$$('.phase-title').forEach((title, index) => {
            const phaseNum = index + 1;
            const phaseTitle = t.phases?.[phaseNum];
            if (phaseTitle && title) {
                title.textContent = phaseTitle;
            }
        });
    }

    /**
     * Bind language-related event listeners
     */
    bindEvents() {
        // Language toggle button
        const langToggleBtn = this.$('button[onclick*="toggleLang"]') || 
                             this.$('#langToggle')?.closest('button');
        
        if (langToggleBtn) {
            this.addEventListener(langToggleBtn, 'click', (e) => {
                e.preventDefault();
                this.toggleLanguage();
            });
        }
    }

    /**
     * Initialize language on component mount
     */
    onMount() {
        this.updateInterface();
    }

    /**
     * Format text with language-specific rules
     * @param {string} text - Text to format
     * @param {Object} values - Values to interpolate
     * @returns {string} Formatted text
     */
    formatText(text, values = {}) {
        let formatted = text;
        Object.entries(values).forEach(([key, value]) => {
            formatted = formatted.replace(`{${key}}`, value);
        });
        return formatted;
    }

    /**
     * Get current language info
     * @returns {Object} Language information
     */
    getLanguageInfo() {
        const currentLang = this.state.getState('currentLang');
        return {
            currentLang,
            availableLanguages: Object.keys(translations),
            translationKeys: Object.keys(this.getTranslations()),
            isRTL: false // MADLAB uses LTR languages only
        };
    }
}

export default LanguageManager;