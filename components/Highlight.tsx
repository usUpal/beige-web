import 'highlight.js/styles/monokai-sublime.css';
import hightlight from 'highlight.js';
import { PropsWithChildren, useEffect, useRef } from 'react';

const CodeHighlight = ({ children }: PropsWithChildren) => {
  const highlightElement = useRef<any>(null);

  useEffect(() => {
    if (highlightElement?.current) {
      hightlight.highlightElement(highlightElement.current.querySelector('pre'));
    }
  }, []);

  // payout?sortBy=createdAt:desc&userId=661e4b416970067f1739f61f&limit=1&page=2

  return (
    <div ref={highlightElement} className="highlight-el">
      {children}
    </div>
  );
};

export default CodeHighlight;
