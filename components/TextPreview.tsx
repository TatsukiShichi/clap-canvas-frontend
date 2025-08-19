import React from 'react';

type Props = {
  title: string;
  preface?: string;
  maintext: string;
  afterword?: string;
};

const rubyRegex = /[｜|]([^｜|]+?)[｜|]([^｜|]+?)(?=[^｜|]|$)/g;

function applyRubyFormatting(text: string) {
  return text.replace(/[｜|](.*?)《(.*?)》/g, (_, base: string, ruby: string) => {
    return `<ruby>${base}<rt>${ruby}</rt></ruby>`;
  });
}

function applyLineBreaks(text: string) {
  return text.replace(/\n/g, '<br />');
}

function applyAllFormatting(text: string) {
  const withRuby = applyRubyFormatting(text);
  const withLineBreaks = applyLineBreaks(withRuby);
  return withLineBreaks;
}

export const TextPreview: React.FC<Props> = ({ title, preface, maintext, afterword }) => {
  const formattedPreface = preface ? applyAllFormatting(preface) : null;
  const formattedMaintext = applyAllFormatting(maintext);
  const formattedAfterword = afterword ? applyAllFormatting(afterword) : null;

  return (
    <div className="space-y-4">
      <h1 className="text-center font-bold text-xl" dangerouslySetInnerHTML={{ __html: applyAllFormatting(title) }} />

      {formattedPreface && (
        <div dangerouslySetInnerHTML={{ __html: formattedPreface }} />
      )}

      {formattedPreface && (
        <hr className="border-t-4 border-double border-gray-400 my-2" />
      )}

      <div dangerouslySetInnerHTML={{ __html: formattedMaintext }} />

      {formattedAfterword && (
        <>
          <hr className="border-t-4 border-double border-gray-400 my-2" />
          <div dangerouslySetInnerHTML={{ __html: formattedAfterword }} />
        </>
      )}
    </div>
  );
};
