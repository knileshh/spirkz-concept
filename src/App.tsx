import React, { useEffect, useRef, useState } from 'react';
import { Slider } from '@/components/ui/slider';
import {
  ArrowUpRight,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  Check,
  Zap,
  Menu,
  X,
  BookOpen,
  Bookmark,
  Sparkles,
  VolumeX,
} from 'lucide-react';
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

const PlayIcon = () => (
  <Play size={16} fill="currentColor" aria-hidden="true" />
);
const Brand = () => (
  <a href="#main" className="brand" aria-label="Spirkz home">
    <Zap fill="currentColor" strokeWidth={1.7} />
    <span>
      spirkz<span className="brand-dot">.</span>
    </span>
  </a>
);
const StoreButton = () => (
  <a
    className="button button-dark"
    href={PLAY_STORE}
    target="_blank"
    rel="noreferrer"
  >
    <PlayIcon /> Get it on Google Play <ArrowUpRight size={18} />
  </a>
);

function LessonPlayer({
  selected,
  onSelect,
  returnFocus,
}: {
  selected: number | null;
  onSelect: (n: number | null) => void;
  returnFocus: React.RefObject<HTMLElement | null>;
}) {
  const [elapsed, setElapsed] = useState(0);
  const [requestedPlayback, setPlaying] = useState(selected !== null);
  const [answer, setAnswer] = useState<number | null>(null);
  const lesson = lessons[selected ?? 0];
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
          aria-label="Close lesson"
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
            <span>
              <Zap size={16} fill="currentColor" /> spirkz
            </span>
            <span>SAMPLE LESSON · {lesson.category}</span>
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
              Lesson progress in seconds
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
                    ? 'Replay lesson'
                    : playing
                      ? 'Pause lesson'
                      : 'Play lesson'
                }
                onClick={() => (finished ? replay() : setPlaying((p) => !p))}
              >
                {finished ? (
                  <RotateCcw />
                ) : playing ? (
                  <Pause fill="currentColor" />
                ) : (
                  <Play fill="currentColor" />
                )}
              </button>
              <span>
                0:{String(Math.floor(elapsed)).padStart(2, '0')} / 0:
                {lesson.duration}
              </span>
              <span className="caption-note">
                <VolumeX size={16} /> Caption-led lesson
              </span>
            </div>
          </div>
        </div>
        <div className="lesson-notes">
          <span className="eyebrow">A LITTLE MOMENT OF DISCOVERY</span>
          <DialogTitle className="player-title">{lesson.question}</DialogTitle>
          <DialogDescription className="player-description">
            An original animated sample for this website concept. Read along,
            pause, or jump to a chapter.
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
                aria-label={`Jump to chapter ${i + 1}: ${item.title}`}
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
              <span className="eyebrow">ONE QUICK CHECK</span>
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
                    : 'Take another look at the lesson, then try the other answer.'}
                </p>
              )}
            </div>
          ) : (
            <p className="lesson-hint">
              <Sparkles size={17} /> Stay to the end for a quick knowledge
              check.
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
              Next lesson
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function App() {
  const [selected, setSelected] = useState<number | null>(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const returnFocus = useRef<HTMLElement | null>(null);
  const openLesson = (id: number) => {
    returnFocus.current = document.activeElement as HTMLElement;
    setSelected(id);
  };
  const faqs = [
    [
      'What is Spirkz?',
      'Spirkz is a mobile app for short educational videos. Explore something new in the feed, or follow a subject through a series of bite-sized lessons.',
    ],
    [
      'How is it different from other video feeds?',
      'Spirkz focuses on educational content. The idea is simple: every short video should leave you knowing something you did not know before.',
    ],
    [
      'Is the app free?',
      'Spirkz currently describes its Android app as free to download and free to learn from. Check the official Google Play listing for the latest availability and details.',
    ],
    [
      'Can I use Spirkz on my iPhone?',
      'The Spirkz website currently lists iOS as coming soon. Use the link beside these questions to visit the official site and sign up for launch updates.',
    ],
    [
      'Are these lessons from the Spirkz app?',
      'These three caption-led lessons were created specifically for this independent website concept. They demonstrate the experience; they are not recordings of the live Spirkz app.',
    ],
  ];
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <header className="site-header wrap">
        <Brand />
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#discover">Discover</a>
          <a href="#how-it-works">How it works</a>
          <a href="#faq">FAQs</a>
        </nav>
        <a
          className="header-cta"
          href={PLAY_STORE}
          target="_blank"
          rel="noreferrer"
        >
          Get the app <ArrowUpRight size={17} />
        </a>
        <button
          className="mobile-toggle icon-button"
          onClick={() => setMobileMenu((p) => !p)}
          aria-label={mobileMenu ? 'Close navigation' : 'Open navigation'}
          aria-expanded={mobileMenu}
          aria-controls="mobile-nav"
        >
          {mobileMenu ? <X /> : <Menu />}
        </button>
        {mobileMenu && (
          <nav
            className="mobile-nav"
            id="mobile-nav"
            aria-label="Mobile navigation"
          >
            {[
              ['Discover', '#discover'],
              ['How it works', '#how-it-works'],
              ['FAQs', '#faq'],
            ].map(([label, href]) => (
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
              <span /> LESS SCROLLING. MORE SPARKS.
            </div>
            <h1>
              A little scroll.
              <br />A lot to
              <br />
              <em>discover.</em>
              <span className="title-spark" aria-hidden="true">
                ✳
              </span>
            </h1>
            <p>
              Your curiosity deserves a better feed. Explore big ideas in short
              lessons — and turn your next spare minute into something good.
            </p>
            <div className="hero-actions">
              <StoreButton />
              <button className="text-button" onClick={() => openLesson(0)}>
                <span className="small-play">
                  <PlayIcon />
                </span>{' '}
                Try a lesson
              </button>
            </div>
            <div className="hero-footnote">
              <span>Free on Android</span>
              <span>·</span>
              <a href="#faq">
                iOS is on its way <ArrowRight size={13} />
              </a>
            </div>
          </div>
          <div className="hero-visual">
            <div className="visual-field" aria-hidden="true">
              <div className="orbit orbit-one" />
              <div className="orbit orbit-two" />
              <span className="visual-star">✳</span>
              <span className="field-label">FOLLOW YOUR CURIOSITY ↗</span>
            </div>
            <div className="floating-note note-top">
              <span className="note-icon">
                <Sparkles size={19} />
              </span>
              <div>
                A new perspective.<small>Just one minute away.</small>
              </div>
            </div>
            <button
              className="phone"
              onClick={() => openLesson(0)}
              aria-label="Play sample lesson: Why do we see the same side of the Moon?"
            >
              <span className="phone-camera" />
              <span className="phone-top">
                <b>9:41</b>
                <span>••• ▰</span>
              </span>
              <span className="phone-nav">
                <b>spirkz.</b>
                <span>
                  For you <i />
                </span>
                <Bookmark size={16} />
              </span>
              <img
                className="phone-moon"
                src="/images/moon.jpg"
                alt="The Moon photographed by the Galileo spacecraft"
                fetchPriority="high"
              />
              <span className="phone-topic">SPACE & CURIOSITY</span>
              <span className="phone-title">
                Same Moon.
                <br />
                Same face.
                <br />
                <em>But why?</em>
              </span>
              <span className="phone-play">
                <Play size={22} fill="currentColor" />
              </span>
              <span className="phone-bottom">
                <span>
                  ONE SMALL LESSON <b>0:32</b>
                </span>
                <span className="phone-progress">
                  <i />
                </span>
                <small>
                  Tap to discover <ArrowUpRight size={12} />
                </small>
              </span>
            </button>
            <div className="floating-note note-bottom">
              <span className="note-icon lime">
                <BookOpen size={19} />
              </span>
              <div>
                Big ideas. Small lessons.<small>Made for your everyday.</small>
              </div>
            </div>
            <span className="sample-label">
              A PEEK AT THE POSSIBILITIES · CONCEPT PREVIEW
            </span>
          </div>
        </section>
        <div className="topic-ribbon">
          <div className="wrap">
            <span>A WORLD TO GET INTO</span>
            <span>
              Science <i>✳</i>
            </span>
            <span>
              History <i>✳</i>
            </span>
            <span>
              Languages <i>✳</i>
            </span>
            <span>
              Nature <i>✳</i>
            </span>
            <span>
              Technology <i>✳</i>
            </span>
            <span>
              And your next obsession <ArrowUpRight size={17} />
            </span>
          </div>
        </div>
        <section id="discover" className="discover wrap section-space">
          <div className="section-heading">
            <div>
              <span className="eyebrow">FEED YOUR CURIOSITY</span>
              <h2>
                Start with a little <em>“wait, really?”</em>
              </h2>
            </div>
            <p>
              No long introductions.
              <br />
              Just something worth knowing.
            </p>
          </div>
          <div className="lesson-cards">
            {lessons.map((lesson, i) => (
              <button
                key={lesson.id}
                className={`lesson-card lesson-card-${lesson.id}`}
                onClick={() => openLesson(i)}
                aria-label={`Play sample lesson: ${lesson.question}`}
              >
                <div className="card-image">
                  <img
                    src={lesson.image}
                    alt={
                      i === 0
                        ? 'A detailed view of the Moon'
                        : i === 1
                          ? 'Turquoise waves in the ocean'
                          : 'Sunlit green fern leaves'
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
                    Discover something new <ArrowUpRight size={18} />
                  </span>
                </div>
              </button>
            ))}
          </div>
          <p className="sample-disclosure">
            Original sample lessons for this concept. A little taste of what
            learning could feel like.
          </p>
        </section>
        <section id="how-it-works" className="journey-section">
          <div className="wrap journey">
            <div className="journey-copy">
              <span className="eyebrow">A SPARK IS JUST THE START</span>
              <h2>
                From “that’s cool”
                <br />
                to <em>“I get it.”</em>
              </h2>
              <p>
                Sometimes one little idea opens a whole new world. Follow that
                feeling — from a quick discovery to a course that connects the
                dots.
              </p>
              <button className="text-button" onClick={() => openLesson(0)}>
                Take your first little step <ArrowUpRight size={20} />
              </button>
              <div className="journey-stamp">
                <Zap size={19} fill="currentColor" /> SMALL STEPS. REAL
                DISCOVERIES.
              </div>
            </div>
            <div className="journey-steps">
              <div className="journey-step">
                <span className="step-number">01</span>
                <div>
                  <h3>Find your spark.</h3>
                  <p>
                    A question you never thought to ask. A topic you didn’t know
                    you loved.
                  </p>
                  <span className="example-pill">
                    <Sparkles size={14} /> Why does the Moon always look
                    familiar?
                  </span>
                </div>
              </div>
              <div className="journey-step">
                <span className="step-number">02</span>
                <div>
                  <h3>Go a little deeper.</h3>
                  <p>
                    Follow short, connected lessons. Build understanding one
                    idea at a time.
                  </p>
                  <div className="course-example">
                    <BookOpen size={20} />
                    <span>
                      A little guide to our Moon
                      <small>EXAMPLE COURSE PATH</small>
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
                  <h3>Leave knowing more.</h3>
                  <p>
                    Keep the ideas that click. Bring a little more curiosity
                    into your everyday.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="faq" className="wrap faq-section section-space">
          <div className="ios-panel">
            <span className="eyebrow">GOOD THINGS ARE ON THE WAY</span>
            <h2>
              iPhone in your pocket?
              <br />
              <em>You’re next.</em>
            </h2>
            <p>
              Spirkz is live on Android, with iOS on the way. Get launch updates
              from the team on the official website.
            </p>
            <a
              href={OFFICIAL_SITE}
              target="_blank"
              rel="noreferrer"
              className="button button-outline"
            >
              Keep me in the loop <ArrowUpRight size={18} />
            </a>
            <small>Opens the official Spirkz website.</small>
          </div>
          <div className="faqs">
            <h2>A few good questions.</h2>
            <Accordion defaultValue={['faq-0']} multiple={false}>
              {faqs.map(([question, answer], i) => (
                <AccordionItem key={question} value={`faq-${i}`}>
                  <AccordionTrigger>{question}</AccordionTrigger>
                  <AccordionContent>{answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
        <section className="wrap">
          <div className="closing-cta">
            <span className="cta-spark" aria-hidden="true">
              ✳
            </span>
            <div>
              <span className="eyebrow">YOUR NEXT MINUTE HAS POTENTIAL</span>
              <h2>
                Make room for a little <em>wonder.</em>
              </h2>
            </div>
            <StoreButton />
          </div>
        </section>
      </main>
      <footer className="wrap">
        <div className="footer-top">
          <Brand />
          <p>Short videos. A world of possibility.</p>
          <a href={OFFICIAL_SITE} target="_blank" rel="noreferrer">
            Visit the official Spirkz site <ArrowUpRight size={16} />
          </a>
        </div>
        <div className="footer-bottom">
          <span>
            Independent design concept by Nilesh. Not the official Spirkz
            website.
          </span>
          <a href="/credits.html">
            Photo & lesson credits <ArrowUpRight size={12} />
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
