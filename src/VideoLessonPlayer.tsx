import { useState, type RefObject } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { ArrowRight, ArrowUpRight, Check, X } from './icons';
import { lessons } from './lessons';
import { languages, useI18n } from './I18n';

export function VideoLessonPlayer({
  selected,
  onSelect,
  returnFocus,
}: {
  selected: number | null;
  onSelect: (n: number | null) => void;
  returnFocus: RefObject<HTMLElement | null>;
}) {
  const { t, localize, locale } = useI18n();
  const [answer, setAnswer] = useState<number | null>(null);
  const [error, setError] = useState(false);
  if (selected === null) return null;
  const lesson = localize(lessons[selected]);
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onSelect(null);
      }}
    >
      <DialogContent
        className="short-dialog"
        showCloseButton={false}
        finalFocus={returnFocus}
      >
        <div className="short-heading">
          <div>
            <span className="eyebrow">{lesson.category} · 0:32</span>
            <DialogTitle>{lesson.question}</DialogTitle>
          </div>
          <DialogClose className="icon-button" aria-label={t('Close lesson')}>
            <X />
          </DialogClose>
        </div>
        <DialogDescription className="short-language-note">
          {t('English narration · subtitles in your language')}
        </DialogDescription>
        <video
          key={`${lesson.id}-${locale}`}
          className="short-video"
          controls
          autoPlay
          playsInline
          preload="metadata"
          poster={`/videos/${lesson.id}-poster.jpg`}
          aria-label={lesson.question}
          onError={() => setError(true)}
        >
          <source src={`/videos/${lesson.id}.mp4?v=george-1`} type="video/mp4" />
          <track
            kind="captions"
            src={`/videos/${lesson.id}.en.vtt?v=george-1`}
            srcLang="en"
            label="English"
            default={locale === 'en'}
          />
          {languages
            .filter((language) => language.code !== 'en')
            .map((language) => (
              <track
                key={language.code}
                kind="subtitles"
                src={`/videos/${lesson.id}.${language.code}.vtt?v=george-1`}
                srcLang={language.code}
                label={language.name}
                default={language.code === locale}
              />
            ))}
        </video>
        {error && (
          <p role="alert">
            {t('The video could not load.')}{' '}
            <a href={`/videos/${lesson.id}.mp4`}>{t('Open video')}</a>
          </p>
        )}
        <div className="short-actions">
          <a href={lesson.source} target="_blank" rel="noreferrer">
            {lesson.sourceName}
            <ArrowUpRight size={14} />
          </a>
          <button
            className="text-button"
            onClick={() => onSelect((selected + 1) % lessons.length)}
          >
            {t('Next lesson')}
            <ArrowRight size={17} />
          </button>
        </div>
        <details className="short-extra">
          <summary>{t('Read the lesson')}</summary>
          {lesson.chapters.map((chapter) => (
            <p key={chapter.title}>
              <strong>{chapter.title}</strong>
              <br />
              {chapter.text}
            </p>
          ))}
        </details>
        <details className="short-extra">
          <summary>{t('ONE QUICK CHECK')}</summary>
          <div className="quiz">
            <h3>{lesson.quiz}</h3>
            <div className="quiz-answers">
              {lesson.answers.map((item, i) => (
                <button
                  key={item}
                  onClick={() => setAnswer(i)}
                  className={
                    answer === i
                      ? i === lesson.correct
                        ? 'correct'
                        : 'incorrect'
                      : ''
                  }
                >
                  {item}
                  {answer === i && i === lesson.correct && <Check size={17} />}
                </button>
              ))}
            </div>
            {answer !== null && (
              <p aria-live="polite">
                {answer === lesson.correct
                  ? lesson.explanation
                  : t(
                      'Take another look at the lesson, then try the other answer.',
                    )}
              </p>
            )}
          </div>
        </details>
      </DialogContent>
    </Dialog>
  );
}
