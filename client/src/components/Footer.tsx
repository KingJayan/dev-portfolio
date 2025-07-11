import { portfolioConfig } from '../../../portfolio.config';

export default function Footer() {
  const { footer, personal, social } = portfolioConfig;

  return (
    <footer className="bg-slate-900/50 dark:bg-slate-900/50 border-t border-slate-800 dark:border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Personal Info */}
          <div>
            <h3 className="text-lg font-display font-semibold text-white dark:text-white mb-4">
              {personal.name}
            </h3>
            <p className="text-slate-300 dark:text-slate-300 mb-4">
              {personal.title}
            </p>
            <p className="text-slate-400 dark:text-slate-400 text-sm">
              {personal.location}
            </p>
          </div>

          {/* Links */}
          {footer.showLinks && (
            <div>
              <h3 className="text-lg font-display font-semibold text-white dark:text-white mb-4">
                Links
              </h3>
              <ul className="space-y-2">
                {footer.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-slate-300 dark:text-slate-300 hover:text-blue-400 transition-colors text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-display font-semibold text-white dark:text-white mb-4">
              Connect
            </h3>
            <div className="flex space-x-4">
              {social.github && (
                <a
                  href={social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-blue-400 transition-colors"
                >
                  <i className="fab fa-github text-xl"></i>
                </a>
              )}
              {social.linkedin && (
                <a
                  href={social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-blue-400 transition-colors"
                >
                  <i className="fab fa-linkedin text-xl"></i>
                </a>
              )}
              {social.twitter && (
                <a
                  href={social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-blue-400 transition-colors"
                >
                  <i className="fab fa-twitter text-xl"></i>
                </a>
              )}
              {social.instagram && (
                <a
                  href={social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-blue-400 transition-colors"
                >
                  <i className="fab fa-instagram text-xl"></i>
                </a>
              )}
              {social.youtube && (
                <a
                  href={social.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-blue-400 transition-colors"
                >
                  <i className="fab fa-youtube text-xl"></i>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Copyright */}
        {footer.showCopyright && (
          <div className="mt-8 pt-8 border-t border-slate-800 dark:border-slate-800">
            <p className="text-center text-slate-400 dark:text-slate-400 text-sm">
              © {new Date().getFullYear()} {personal.name}. All rights reserved.
            </p>
          </div>
        )}
      </div>
    </footer>
  );
}