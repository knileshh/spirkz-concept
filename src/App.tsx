import { useI18n } from './I18n';
import { LanguageSelector } from './LanguageSelector';
import React, { useEffect, useRef, useState } from 'react';
import { Slider } from '@/components/ui/slider';
import {
  ArrowUpRight,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  Check,
  Menu,
  X,
  BookOpen,
  Bookmark,
  Compass,
  CheckCircle,
  Moon,
  CellSignal,
  Battery,
  VolumeX,
} from './icons';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { lessons, PLAY_STORE, OFFICIAL_SITE, chapterAt } from './lessons';
import { navigation, faqs } from './content';
import {
  AboutSection,
  WhySection,
  TopicsSection,
  CreatorsSection,
  AppSection,
  InvestSection,
  FooterLinks,
} from './Sections';

const PlayIcon = () => <Play size={16} weight="fill" aria-hidden="true" />;
const Brand = () => {
  const { t } = useI18n();
  return (
    <a href="#main" className="brand" aria-label={t('Spirkz home')}>
      <img
        className="official-logo"
        src="/brand/spirkz-app-icon.png"
        alt=""
        width="56"
        height="56"
      />
      <span>spirkz</span>
    </a>
  );
};
const StoreButton = () => {
  const { t } = useI18n();
  return (
    <a
      className="button button-dark"
      href={PLAY_STORE}
      target="_blank"
      rel="noreferrer"
    >
      <PlayIcon /> {t('Get it on Google Play')} <ArrowUpRight size={18} />
    </a>
  );
};

function LessonPlayer({
  selected,
  onSelect,
  returnFocus,
}: {
  selected: number | null;
  onSelect: (n: number | null) => void;
  returnFocus: React.RefObject<HTMLElement | null>;
}) {
  const { t, localize } = useI18n();
  const [elapsed, setElapsed] = useState(0);
  const [requestedPlayback, setPlaying] = useState(selected !== null);
  const [answer, setAnswer] = useState<number | null>(null);
  const lesson = localize(lessons[selected ?? 0]);
  const playing = requestedPlayback && elapsed < lesson.duration;
  useEffect(() => {
    if (!playing || selected === null) return;
    let last = performance.now();
    const timer = window.setInterval(() => {
      const now = performance.now();
      const delta = (now - last) / 1000;
      last = now;
      if (!document.hidden)
        setElapsed((t) => Math.min(lesson.duration, t + delta));
    }, 100);
    return () => window.clearInterval(timer);
  }, [playing, selected, lesson.duration]);
  const chapter = chapterAt(elapsed, lesson.duration, lesson.chapters.length);
  const finished = elapsed >= lesson.duration;
  const replay = () => {
    setElapsed(0);
    setAnswer(null);
    setPlaying(true);
  };
  return (
    <Dialog
      open={selected !== null}
      onOpenChange={(open) => {
        if (!open) {
          setPlaying(false);
          onSelect(null);
        }
      }}
    >
      <DialogContent
        className="lesson-dialog"
        showCloseButton={false}
        finalFocus={returnFocus}
      >
        <DialogClose
          className="player-close icon-button"
          aria-label={t('Close lesson')}
        >
          <X />
        </DialogClose>
        <div className={`lesson-screen lesson-screen-${lesson.id}`}>
          <img
            src={lesson.image}
            alt=""
            className={playing ? 'lesson-photo is-playing' : 'lesson-photo'}
          />
          <div className="lesson-topline">
            <span>spirkz.</span>
            <span>
              {t('SAMPLE LESSON ·')} {lesson.category}
            </span>
          </div>
          <div className="lesson-captions">
            <span className="eyebrow">
              {String(chapter + 1).padStart(2, '0')} / 04
            </span>
            <h3>{lesson.chapters[chapter].title}</h3>
            <p>{lesson.chapters[chapter].text}</p>
          </div>
          <div className="player-controls">
            <span className="sr-only" id="lesson-seek-label">
              {t('Lesson progress in seconds')}{' '}
            </span>
            <Slider
              min={0}
              max={lesson.duration}
              step={0.1}
              value={[elapsed]}
              aria-labelledby="lesson-seek-label"
              onValueChange={(value) => {
                setElapsed(Array.isArray(value) ? value[0] : value);
                setAnswer(null);
              }}
            />
            <div>
              <button
                className="icon-button"
                aria-label={
                  finished
                    ? t('Replay lesson')
                    : playing
                      ? t('Pause lesson')
                      : t('Play lesson')
                }
                onClick={() => (finished ? replay() : setPlaying((p) => !p))}
              >
                {finished ? (
                  <RotateCcw />
                ) : playing ? (
                  <Pause weight="fill" />
                ) : (
                  <Play weight="fill" />
                )}
              </button>
              <span>
                0:{String(Math.floor(elapsed)).padStart(2, '0')} / 0:
                {lesson.duration}
              </span>
              <span className="caption-note">
                <VolumeX size={16} /> {t('Caption-led lesson')}{' '}
              </span>
            </div>
          </div>
        </div>
        <div className="lesson-notes">
          <span className="eyebrow">{t('A LITTLE MOMENT OF DISCOVERY')}</span>
          <DialogTitle className="player-title">{lesson.question}</DialogTitle>
          <DialogDescription className="player-description">
            {t(
              'An original animated sample for this website concept. Read along, pause, or jump to a chapter.',
            )}{' '}
          </DialogDescription>
          <div className="chapter-list">
            {lesson.chapters.map((item, i) => (
              <button
                key={item.title}
                className={i === chapter ? 'active' : ''}
                onClick={() => {
                  setElapsed((i * lesson.duration) / 4);
                  setPlaying(true);
                  setAnswer(null);
                }}
                aria-label={t('Jump to chapter {number}: {title}', {
                  number: i + 1,
                  title: item.title,
                })}
                aria-current={i === chapter ? 'step' : undefined}
              >
                <span>{String(i + 1).padStart(2, '0')}</span>
                {item.title}
                <Play size={13} />
              </button>
            ))}
          </div>
          {finished ? (
            <div className="quiz" aria-live="polite">
              <span className="eyebrow">{t('ONE QUICK CHECK')}</span>
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
                    {answer === i && i === lesson.correct && (
                      <Check size={17} />
                    )}
                  </button>
                ))}
              </div>
              {answer !== null && (
                <p>
                  {answer === lesson.correct
                    ? lesson.explanation
                    : t(
                        'Take another look at the lesson, then try the other answer.',
                      )}
                </p>
              )}
            </div>
          ) : (
            <p className="lesson-hint">
              <CheckCircle size={17} />{' '}
              {t('Stay to the end for a quick knowledge check.')}{' '}
            </p>
          )}
          <div className="lesson-bottom">
            <a href={lesson.source} target="_blank" rel="noreferrer">
              {lesson.sourceName}
              <ArrowUpRight size={14} />
            </a>
            <button
              onClick={() => onSelect(((selected ?? 0) + 1) % lessons.length)}
            >
              {t('Next lesson')} <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function App() {
  const { t, localize, locale } = useI18n();
  const [selected, setSelected] = useState<number | null>(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const returnFocus = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    if (!mobileMenu) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenu(false);
        menuButtonRef.current?.focus();
      }
    };
    const onOutside = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !headerRef.current?.contains(event.target)
      )
        setMobileMenu(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onOutside);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onOutside);
    };
  }, [mobileMenu]);
  const openLesson = (id: number) => {
    returnFocus.current = document.activeElement as HTMLElement;
    setSelected(id);
  };

  return (
    <>
      <a href="#main" className="skip-link">
        {t('Skip to content')}{' '}
      </a>
      <header className="site-header wrap" ref={headerRef}>
        <Brand />
        <nav className="desktop-nav" aria-label={t('Main navigation')}>
          <a href="#discover">{t('Discover')}</a>
          <a href="#how-it-works">{t('How it works')}</a>
          <a href="#faq">{t('FAQs')}</a>
        </nav>
        <a
          className="header-cta"
          href={PLAY_STORE}
          target="_blank"
          rel="noreferrer"
        >
          {t('Get the app')} <ArrowUpRight size={17} />
        </a>
        <LanguageSelector />
        <button
          className="mobile-toggle icon-button"
          ref={menuButtonRef}
          type="button"
          onClick={() => setMobileMenu((p) => !p)}
          aria-label={t(mobileMenu ? 'Close navigation' : 'Open navigation')}
          aria-expanded={mobileMenu}
          aria-controls="mobile-nav"
        >
          {mobileMenu ? <X /> : <Menu />}
        </button>
        {mobileMenu && (
          <nav
            className="mobile-nav"
            id="mobile-nav"
            aria-label={t('All sections')}
          >
            {localize(navigation).map(([label, href]) => (
              <a key={href} href={href} onClick={() => setMobileMenu(false)}>
                {label}
                <ArrowUpRight size={18} />
              </a>
            ))}
          </nav>
        )}
      </header>
      <main id="main">
        <section className="hero wrap">
          <div className="hero-copy">
            <div className="availability">
              <span /> {t('LESS SCROLLING. MORE SPARKS.')}{' '}
            </div>
            <h1>
              {t('A little scroll.')} <br />
              {t('A lot to')} <br />
              <em>{t('discover.')}</em>
            </h1>
            <p>
              {t(
                'Your curiosity deserves a better feed. Explore big ideas in short lessons — and turn your next spare minute into something good.',
              )}{' '}
            </p>
            <div className="hero-actions">
              <StoreButton />
              <button className="text-button" onClick={() => openLesson(0)}>
                <span className="small-play">
                  <PlayIcon />
                </span>{' '}
                {t('Try a lesson')}{' '}
              </button>
            </div>
            <div className="hero-footnote">
              <span>{t('Free on Android')}</span>
              <span>·</span>
              <a href="#faq">
                {t('iOS is on its way')} <ArrowRight size={13} />
              </a>
            </div>
          </div>
          <div className="hero-visual">
            <div className="visual-field" aria-hidden="true">
              <div className="orbit orbit-one" />
              <div className="orbit orbit-two" />
              <span className="field-label">{t('FOLLOW YOUR CURIOSITY')}</span>
            </div>
            <div className="floating-note note-top">
              <span className="note-icon">
                <Compass size={19} />
              </span>
              <div>
                {t('A new perspective.')}
                <small>{t('Just one minute away.')}</small>
              </div>
            </div>
            <button
              className="phone"
              onClick={() => openLesson(0)}
              aria-label={t(
                'Play sample lesson: Why do we see the same side of the Moon?',
              )}
            >
              <span className="phone-camera" />
              <span className="phone-top">
                <b>9:41</b>
                <span className="phone-status">
                  <CellSignal size={12} />
                  <Battery size={15} />
                </span>
              </span>
              <span className="phone-nav">
                <b className="phone-brand">
                  <img src="/brand/spirkz-owl.png" alt="" />
                  spirkz
                </b>
                <span>
                  {t('For you')} <i />
                </span>
                <Bookmark size={16} />
              </span>
              <img
                className="phone-moon"
                src="/images/moon.jpg"
                alt={t('The Moon photographed by the Galileo spacecraft')}
                fetchPriority="high"
              />
              <span className="phone-topic">{t('SPACE & CURIOSITY')}</span>
              <span className="phone-title">
                {t('Same Moon.')} <br />
                {t('Same face.')} <br />
                <em>{t('But why?')}</em>
              </span>
              <span className="phone-play">
                <Play size={22} weight="fill" />
              </span>
              <span className="phone-bottom">
                <span>
                  {t('ONE SMALL LESSON')} <b>0:32</b>
                </span>
                <span className="phone-progress">
                  <i />
                </span>
                <small>
                  {t('Tap to discover')} <ArrowUpRight size={12} />
                </small>
              </span>
            </button>
            <div className="floating-note note-bottom">
              <span className="note-icon lime">
                <BookOpen size={19} />
              </span>
              <div>
                {t('Big ideas. Small lessons.')}
                <small>{t('Made for your everyday.')}</small>
              </div>
            </div>
            <span className="sample-label">
              {t('A PEEK AT THE POSSIBILITIES · CONCEPT PREVIEW')}{' '}
            </span>
          </div>
        </section>
        <div className="topic-ribbon">
          <div className="wrap">
            <span>{t('A WORLD TO GET INTO')}</span>
            <span>
              {t('Science')} <i aria-hidden="true">·</i>
            </span>
            <span>
              {t('History')} <i aria-hidden="true">·</i>
            </span>
            <span>
              {t('Languages')} <i aria-hidden="true">·</i>
            </span>
            <span>
              {t('Nature')} <i aria-hidden="true">·</i>
            </span>
            <span>
              {t('Technology')} <i aria-hidden="true">·</i>
            </span>
            <span>
              {t('And your next obsession')} <ArrowUpRight size={17} />
            </span>
          </div>
        </div>
        <AboutSection onLesson={openLesson} />
        <WhySection />
        <TopicsSection />
        <section id="discover" className="discover wrap section-space">
          <div className="section-heading">
            <div>
              <span className="eyebrow">{t('FEED YOUR CURIOSITY')}</span>
              <h2>
                {t('Start with a little')} <em>{t('“wait, really?”')}</em>
              </h2>
            </div>
            <p>
              {t('No long introductions.')} <br />
              {t('Just something worth knowing.')}{' '}
            </p>
          </div>
          <div className="lesson-cards">
            {localize(lessons).map((lesson, i) => (
              <button
                key={lesson.id}
                className={`lesson-card lesson-card-${lesson.id}`}
                onClick={() => openLesson(i)}
                aria-label={t('Play sample lesson: {question}', {
                  question: lesson.question,
                })}
              >
                <div className="card-image">
                  <img
                    src={lesson.image}
                    alt={
                      i === 0
                        ? t('A detailed view of the Moon')
                        : i === 1
                          ? t('Turquoise waves in the ocean')
                          : t('Sunlit green fern leaves')
                    }
                    loading="lazy"
                  />
                  <span className="card-topic">{lesson.category}</span>
                  <span className="card-play">
                    <PlayIcon />
                  </span>
                  <span className="card-time">0:{lesson.duration}</span>
                </div>
                <div className="card-copy">
                  <h3>{lesson.title}</h3>
                  <p>{lesson.description}</p>
                  <span>
                    {t('Discover something new')} <ArrowUpRight size={18} />
                  </span>
                </div>
              </button>
            ))}
          </div>
          <p className="sample-disclosure">
            {t(
              'Original sample lessons for this concept. A little taste of what learning could feel like.',
            )}{' '}
          </p>
        </section>
        <section id="how-it-works" className="journey-section">
          <div className="wrap journey">
            <div className="journey-copy">
              <span className="eyebrow">{t('A SPARK IS JUST THE START')}</span>
              <h2>
                {t('From “that’s cool”')} <br />
                {t('to')} <em>{t('“I get it.”')}</em>
              </h2>
              <p>
                {t(
                  'Sometimes one little idea opens a whole new world. Follow that feeling — from a quick discovery to a course that connects the dots.',
                )}{' '}
              </p>
              <button className="text-button" onClick={() => openLesson(0)}>
                {t('Take your first little step')} <ArrowUpRight size={20} />
              </button>
              <div className="journey-stamp">
                <BookOpen size={19} />{' '}
                {t('SMALL STEPS. REAL DISCOVERIES.')}{' '}
              </div>
            </div>
            <div className="journey-steps">
              <div className="journey-step">
                <span className="step-number">01</span>
                <div>
                  <h3>{t('Find your spark.')}</h3>
                  <p>
                    {t(
                      'A question you never thought to ask. A topic you didn’t know you loved.',
                    )}{' '}
                  </p>
                  <span className="example-pill">
                    <Moon size={14} />{' '}
                    {t('Why does the Moon always look familiar?')}{' '}
                  </span>
                </div>
              </div>
              <div className="journey-step">
                <span className="step-number">02</span>
                <div>
                  <h3>{t('Go a little deeper.')}</h3>
                  <p>
                    {t(
                      'Follow short, connected lessons. Build understanding one idea at a time.',
                    )}{' '}
                  </p>
                  <div className="course-example">
                    <BookOpen size={20} />
                    <span>
                      {t('A little guide to our Moon')}{' '}
                      <small>{t('EXAMPLE COURSE PATH')}</small>
                    </span>
                    <div className="mini-progress">
                      <i />
                      <i />
                      <i />
                      <i />
                    </div>
                  </div>
                </div>
              </div>
              <div className="journey-step">
                <span className="step-number">03</span>
                <div>
                  <h3>{t('Leave knowing more.')}</h3>
                  <p>
                    {t(
                      'Keep the ideas that click. Bring a little more curiosity into your everyday.',
                    )}{' '}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <CreatorsSection />
        <AppSection onLesson={openLesson} />
        <section id="faq" className="wrap faq-section section-space">
          <div className="ios-panel" id="notify">
            <span className="eyebrow">{t('BE THE FIRST TO KNOW')}</span>
            <h2>
              {t('iPhone in your pocket?')} <br />
              <em>{t('You’re next.')}</em>
            </h2>
            <p>
              {t(
                'Spirkz is live on Android, with iOS on the way. Get launch updates from the team on the official website.',
              )}{' '}
            </p>
            <a
              href={`${OFFICIAL_SITE}${locale}`}
              target="_blank"
              rel="noreferrer"
              className="button button-outline"
            >
              {t('Keep me in the loop')} <ArrowUpRight size={18} />
            </a>
            <small>{t('Opens the official Spirkz website.')}</small>
          </div>
          <div className="faqs">
            <h2>{t('A few good questions.')}</h2>
            <Accordion defaultValue={['faq-0']} multiple={false}>
              {localize(faqs).map(([question, answer], i) => (
                <AccordionItem key={question} value={`faq-${i}`}>
                  <AccordionTrigger>{question}</AccordionTrigger>
                  <AccordionContent>{answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
        <InvestSection />
        <section className="wrap">
          <div className="closing-cta">
            <div>
              <span className="eyebrow">
                {t('YOUR NEXT MINUTE HAS POTENTIAL')}
              </span>
              <h2>
                {t('Make room for a little')} <em>{t('wonder.')}</em>
              </h2>
            </div>
            <StoreButton />
          </div>
        </section>
      </main>
      <footer className="wrap">
        <div className="footer-top">
          <Brand />
          <p>{t('Short videos. A world of possibility.')}</p>
          <a
            href={`${OFFICIAL_SITE}${locale}`}
            target="_blank"
            rel="noreferrer"
          >
            {t('Visit the official Spirkz site')} <ArrowUpRight size={16} />
          </a>
        </div>
        <FooterLinks />
        <div className="footer-bottom">
          <span>
            {t(
              'Independent design concept by Nilesh. Not the official Spirkz website.',
            )}{' '}
          </span>
          <a href="/credits.html">
            {t('Photo & lesson credits')} <ArrowUpRight size={12} />
          </a>
        </div>
      </footer>
      <LessonPlayer
        key={selected ?? 'closed'}
        selected={selected}
        onSelect={setSelected}
        returnFocus={returnFocus}
      />
    </>
  );
}
export default App;
