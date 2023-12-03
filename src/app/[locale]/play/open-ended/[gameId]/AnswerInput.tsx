import React, { useMemo, MutableRefObject } from "react";
import keyword_extractor from "keyword-extractor";
type Props = {
  answer: string;
  setBlankAnswer: React.Dispatch<React.SetStateAction<string>>;
};

const BLANKS = "_____";
// <HTMLInputElement, Props>
const AnswerInput = React.forwardRef<HTMLInputElement[], Props>(
  ({ answer, setBlankAnswer }, ref) => {
    const keyword = useMemo(() => {
      const words = keyword_extractor.extract(answer, {
        language: "english",
        remove_digits: true,
        return_changed_case: false,
        remove_duplicates: false,
      });
      const suffled = words.sort(() => Math.random() - 0.5);

      return suffled.slice(0, 2);
    }, [answer]);

    const answerWithBlanks = useMemo(() => {
      const answerWithBlanks = keyword.reduce((acc, current) => {
        return acc.replace(current, BLANKS);
      }, answer);
      setBlankAnswer(answerWithBlanks);
      return answerWithBlanks;
    }, [answer, keyword, setBlankAnswer]);
    const splitAnswers = answerWithBlanks.split(BLANKS);

    return (
      <div className="flex w-full mt-4 justify-start">
        <h1 className="text-xl font-bold">
          {splitAnswers.map((part, index) => {
            const refKey = `input-${index}`;
            return (
              <React.Fragment key={index}>
                {part}
                {index !== splitAnswers.length - 1 && (
                  <input
                    id="user-blank-input"
                    className="text-center border-b-2 border-black dark:border-white w-28 focus:border-2 focus:border-b-4 focus:outline-none"
                    type="text"
                    ref={(el) => {
                      if (ref !== null && typeof ref !== "function") {
                        ref.current![index] = el as HTMLInputElement;
                      }
                    }}
                  />
                )}
              </React.Fragment>
            );
          })}
        </h1>
      </div>
    );
  }
);
AnswerInput.displayName = "AnswerInput";
export default AnswerInput;
