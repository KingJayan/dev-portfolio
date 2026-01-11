import React from 'react';
import {
    SiReact,
    SiNodedotjs,
    SiPython,
    SiPostgresql,
    SiNextdotjs,
    SiPrisma,
    SiTailwindcss,
    SiJavascript,
    SiTypescript,
    SiHtml5,
    SiCss3,
    SiVercel,
    SiFirebase,
    SiGit,
    SiWordpress,
    SiNpm,
    SiFramer,
    SiGithub,
    SiDocker,
    SiExpress,
    SiYarn,
    SiWebpack,
    SiBabel,
    SiEslint,
    SiPrettier,
    SiAngular,
    SiSvelte,
    SiVuedotjs,
    SiGithubactions,
    SiGooglecloud,
    SiMysql,
    SiMongodb,
    SiRedis,
    SiGraphql,
    SiJest,
    SiCypress,
    SiSwift,
    SiXcode,
    SiWebassembly,
    SiJetbrains,
    SiReplit
} from "react-icons/si";

interface IconProps {
    name: string;
    className?: string;
}

export default function TechIcon({ name, className = "w-6 h-6" }: IconProps) {
    const normalizedName = name.toLowerCase();

    switch (normalizedName) {
        case 'github': return <SiGithub className={className} />;
        case 'git': return <SiGit className={className} />;
        case 'npm': return <SiNpm className={className} />;
        case 'yarn': return <SiYarn className={className} />;
        case 'vercel': return <SiVercel className={className} />;
        case 'aws':
            return (
                <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg" aria-label="AWS">
                    <path d="M12 2L3 7v10l9 5 9-5V7l-9-5z" />
                </svg>
            );
        case 'google cloud': return <SiGooglecloud className={className} />;
        case 'docker': return <SiDocker className={className} />;
        case 'firebase': return <SiFirebase className={className} />;
        case 'replit': return <SiReplit className={className} />;
        case 'express':
        case 'express.js': return <SiExpress className={className} />;
        case 'java':
            return (
                <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg" aria-label="Java">
                    <path d="M12 2c-2 0-4 1.5-4 4 0 2.2 4 5 4 5s4-2.8 4-5c0-2.5-2-4-4-4zm0 7c-1 0-2-.8-2-2 0-1.2 1-2 2-2s2 .8 2 2c0 1.2-1 2-2 2zm-4 5c0 0 1 1 4 1s4-1 4-1-1 3-4 3-4-3-4-3z" />
                </svg>
            );
        case 'vscode':
            return (
                <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className={className}
                    xmlns="http://www.w3.org/2000/svg"
                    aria-label="VS Code"
                >
                    <path d="M23.15 2.59L18.21.21a1.25 1.25 0 0 0-1.41.27L8.3 8.17 4.38 5.18a.83.83 0 0 0-1.07.07L.53 7.77a.83.83 0 0 0 0 1.21l3.02 3.02L.53 15.02a.83.83 0 0 0 0 1.21l2.78 2.52a.83.83 0 0 0 1.07.07l3.92-2.99 8.5 7.69a1.25 1.25 0 0 0 1.41.27l4.94-2.38a1.25 1.25 0 0 0 .71-1.13V3.72a1.25 1.25 0 0 0-.71-1.13zM18.21 17.3L11.6 12l6.61-5.3z" />
                </svg>
            );
        case 'wordpress': return <SiWordpress className={className} />;
        case 'react': return <SiReact className={className} />;
        case 'next.js': return <SiNextdotjs className={className} />;
        case 'node.js': return <SiNodedotjs className={className} />;
        case 'tailwind': return <SiTailwindcss className={className} />;
        case 'framer-motion': return <SiFramer className={className} />;
        case 'angular': return <SiAngular className={className} />;
        case 'svelte': return <SiSvelte className={className} />;
        case 'vue': return <SiVuedotjs className={className} />;
        case 'python': return <SiPython className={className} />;
        case 'javascript':
        case 'js': return <SiJavascript className={className} />;
        case 'typescript':
        case 'ts': return <SiTypescript className={className} />;
        case 'html': return <SiHtml5 className={className} />;
        case 'css': return <SiCss3 className={className} />;
        case 'postgres': return <SiPostgresql className={className} />;
        case 'mysql': return <SiMysql className={className} />;
        case 'mongodb': return <SiMongodb className={className} />;
        case 'redis': return <SiRedis className={className} />;
        case 'graphql': return <SiGraphql className={className} />;
        case 'prisma': return <SiPrisma className={className} />;
        case 'webpack': return <SiWebpack className={className} />;
        case 'babel': return <SiBabel className={className} />;
        case 'eslint': return <SiEslint className={className} />;
        case 'prettier': return <SiPrettier className={className} />;
        case 'jest': return <SiJest className={className} />;
        case 'cypress': return <SiCypress className={className} />;
        case 'github actions': return <SiGithubactions className={className} />;
        case 'swift': return <SiSwift className={className} />;
        case 'xcode': return <SiXcode className={className} />;
        case 'jetbrains': return <SiJetbrains className={className} />;
        case 'webassembly': return <SiWebassembly className={className} />;

        default:
            return (
                <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
                    <rect x="4" y="4" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
            );
    }
}
