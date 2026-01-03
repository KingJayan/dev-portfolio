export const translations = {
    en: {
        nav: { home: "Home", projects: "Projects", about: "About", contact: "Contact" },
        footer: { scroll: "Scroll Top", email: "Email Me" },
    },
    es: {
        nav: { home: "Inicio", projects: "Proyectos", about: "Sobre Mí", contact: "Contacto" },
        footer: { scroll: "Volver Arriba", email: "Envíame un Correo" },
    },
    zh: {
        nav: { home: "首页", projects: "项目", about: "关于", contact: "联系" },
        footer: { scroll: "回到顶部", email: "给我发邮件" },
    },
    fr: {
        nav: { home: "Accueil", projects: "Projets", about: "À Propos", contact: "Contact" },
        footer: { scroll: "Haut de Page", email: "Envoyez-moi un Email" },
    },
};

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.en;
