import { portfolioConfig } from '@/portfolio.config';
import { FaGithub, FaLinkedin, FaXTwitter } from 'react-icons/fa6';
import type { IconType } from 'react-icons';

const SOCIAL_ICONS: { key: keyof typeof portfolioConfig.social; Icon: IconType }[] = [
  { key: 'github',   Icon: FaGithub },
  { key: 'linkedin', Icon: FaLinkedin },
  { key: 'twitter',  Icon: FaXTwitter },
];

export default function Footer() {
  const { footer, personal, social } = portfolioConfig;

  return (
    <footer className="bg-ink text-paper py-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h3 className="text-3xl font-marker mb-4 text-highlighter-yellow/80">{personal.name}</h3>
            <p className="font-hand text-xl text-paper/80">{personal.title}</p>
            <p className="font-hand text-lg text-paper/60 mt-2">{personal.location}</p>
          </div>

          {footer.showLinks && (
            <div className="font-hand text-xl">
              <h3 className="text-2xl font-amatic font-bold mb-4 text-paper underline decoration-highlighter-pink/50">quick links</h3>
              <ul className="space-y-2">
                {footer.links.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="hover:text-highlighter-pink transition-colors hover:underline decoration-dashed">{link.name}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h3 className="text-2xl font-amatic font-bold mb-4 text-paper underline decoration-highlighter-yellow/50">connect</h3>
            <div className="flex justify-center md:justify-start space-x-6">
              {SOCIAL_ICONS.map(({ key, Icon }) => social[key] && (
                <a key={key} href={social[key]} target="_blank" rel="noopener noreferrer"
                  className="text-paper/70 hover:text-white hover:scale-110 transition-transform">
                  <Icon className="w-7 h-7" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {footer.showCopyright && (
          <div className="mt-12 pt-8 border-t border-paper/20 text-center font-hand text-paper/65">
            <p>© {new Date().getFullYear()} {personal.name}. hand-coded with <span className="text-highlighter-pink">❤</span> and lots of cheez-its.</p>
          </div>
        )}
      </div>
    </footer>
  );
}
