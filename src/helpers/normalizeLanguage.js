export const normalizeLanguage = (lang) => {
    if (!lang) return 'layout';
    const l = lang.toLowerCase();
    if (l.includes('python')) return 'python';
    if (l.includes('js') || l.includes('javascript')) return 'js';
    if (l.includes('html') || l.includes('css')) return 'layout';
    return 'fullstack';
};