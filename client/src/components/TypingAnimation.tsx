import { useState, useEffect } from 'react';
import { portfolioConfig } from '../../../portfolio.config';

interface TypingAnimationProps {
  phrases?: string[];
  className?: string;
}

export default function TypingAnimation({ 
  phrases = portfolioConfig.typing.phrases, 
  className = "" 
}: TypingAnimationProps) {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[currentPhraseIndex];
    
    const timeout = setTimeout(() => {
      if (isDeleting) {
        setCurrentText(currentPhrase.substring(0, currentText.length - 1));
        
        if (currentText.length === 0) {
          setIsDeleting(false);
          setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
        }
      } else {
        setCurrentText(currentPhrase.substring(0, currentText.length + 1));
        
        if (currentText === currentPhrase) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentPhraseIndex, phrases]);

  return (
    <span className={`inline-block ${className}`}>
      {currentText}
      <span className="border-r-2 border-blue-400 animate-pulse ml-1">|</span>
    </span>
  );
}
