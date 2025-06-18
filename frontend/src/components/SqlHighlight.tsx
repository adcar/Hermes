'use client';

import { Highlight, themes } from 'prism-react-renderer';

interface SqlHighlightProps {
  code: string;
}

export function SqlHighlight({ code }: SqlHighlightProps) {
  return (
    <Highlight theme={themes.nightOwl} code={code.trim()} language="sql">
      {({ style, tokens, getLineProps, getTokenProps }) => (
        <pre
          style={{
            ...style,
            background: 'transparent',
            margin: 0,
            padding: 0,
            fontSize: '13px',
            lineHeight: '1.6',
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          }}
        >
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line })}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
}

