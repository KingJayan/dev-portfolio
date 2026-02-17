export const translations = {
    en: {
        nav: { home: "Home", projects: "Projects", github: "GitHub", about: "About", achievements: "Achievements", life: "Life", contact: "Contact" },
        footer: { scroll: "Scroll Top", email: "Email Me" },
    },
    es: {
        nav: { home: "Inicio", projects: "Proyectos", github: "GitHub", about: "Sobre Mí", achievements: "Logros", life: "Vida", contact: "Contacto" },
        footer: { scroll: "Volver Arriba", email: "Envíame un Correo" },
    },
    zh: {
        nav: { home: "首页", projects: "项目", github: "GitHub", about: "关于", achievements: "成就", life: "生活", contact: "联系" },
        footer: { scroll: "回到顶部", email: "给我发邮件" },
    },
    fr: {
        nav: { home: "Accueil", projects: "Projets", github: "GitHub", about: "À Propos", achievements: "Réalisations", life: "Vie", contact: "Contact" },
        footer: { scroll: "Haut de Page", email: "Envoyez-moi un Email" },
    },
};

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.en;
