export const translations = {
    en: {
        nav: { home: "home", projects: "projects", github: "github", about: "about", achievements: "extras", life: "life", contact: "contact" },
        footer: { scroll: "scroll top", email: "email me" },
    },
    es: {
        nav: { home: "inicio", projects: "proyectos", github: "github", about: "sobre mí", achievements: "extras", life: "vida", contact: "contacto" },
        footer: { scroll: "volver arriba", email: "envíame un correo" },
    },
    zh: {
        nav: { home: "首页", projects: "项目", github: "GitHub", about: "关于", achievements: "其他", life: "生活", contact: "联系" },
        footer: { scroll: "回到顶部", email: "给我发邮件" },
    },
    fr: {
        nav: { home: "accueil", projects: "projets", github: "github", about: "à propos", achievements: "extras", life: "vie", contact: "contact" },
        footer: { scroll: "haut de page", email: "envoyez-moi un email" },
    },
};

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.en;
