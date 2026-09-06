import {
  ArrowUpRight,
  ArrowRight,
  Play,
  Check,
  BookOpen,
  Clock,
  GraduationCap,
  DeviceMobile,
  Globe,
  Pencil,
  Envelope,
} from './icons';
import { lessons, PLAY_STORE, OFFICIAL_SITE } from './lessons';
import { topics } from './content';

export function AboutSection({ onLesson }: { onLesson: (id: number) => void }) {
  return (
    <section id="about" className="wrap about-section section-space">
      <div>
        <span className="eyebrow">WHAT IS SPIRKZ?</span>
        <h2>
          A feed for the
          <br />
          <em>curious part of you.</em>
        </h2>
        <p>
          There’s a question behind every good discovery. Spirkz brings short
          educational videos into the moments you already have — on the bus,
          over a coffee, or between things.
        </p>
        <p>
          Follow a new interest. Find an explanation that clicks. Make a little
          room for learning, every day.
        </p>
        <dl className="about-stats">
          <div>
            <dt>≤60s</dt>
            <dd>per lesson</dd>
          </div>
          <div>
            <dt>12</dt>
            <dd>topic areas</dd>
          </div>
          <div>
            <dt>100%</dt>
            <dd>education focused</dd>
          </div>
        </dl>
      </div>
      <div className="about-example">
        <span className="eyebrow">ONE QUESTION CAN TAKE YOU SOMEWHERE</span>
        <h3>
          Why does the Moon
          <br />
          always look familiar?
        </h3>
        <div className="about-meta">
          <span>Space</span>
          <span>32 seconds</span>
          <span>One new idea</span>
        </div>
        <button className="button button-dark" onClick={() => onLesson(0)}>
          <Play size={17} weight="fill" /> Find out <ArrowRight size={17} />
        </button>
        <small>Original concept lesson</small>
      </div>
    </section>
  );
}

export function WhySection() {
  const benefits = [
    [
      BookOpen,
      'Education comes first.',
      'A feed with a clear purpose: to help you understand something new.',
    ],
    [
      Clock,
      'Small enough to finish.',
      'Short lessons that fit into a spare minute, with one idea at a time.',
    ],
    [
      GraduationCap,
      'People with something to teach.',
      'A place for educators, professionals and creators to share what they know.',
    ],
    [
      Globe,
      'Learning goes with you.',
      'A little classroom in your pocket, ready whenever curiosity turns up.',
    ],
  ] as const;
  return (
    <section id="why" className="why-section">
      <div className="wrap section-space">
        <div className="section-heading">
          <div>
            <span className="eyebrow">WHY SPIRKZ</span>
            <h2>
              A better reason <em>to keep watching.</em>
            </h2>
          </div>
        </div>
        <div className="benefits-grid">
          {benefits.map(([Icon, title, body]) => (
            <article key={title}>
              <Icon size={28} weight="regular" aria-hidden="true" />
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TopicsSection() {
  return (
    <section id="topics" className="wrap topics-section section-space">
      <div className="section-heading">
        <div>
          <span className="eyebrow">TWELVE WAYS INTO SOMETHING NEW</span>
          <h2>
            Where will your <em>curiosity go?</em>
          </h2>
        </div>
        <p>
          Start with what you love.
          <br />
          Leave room for a surprise.
        </p>
      </div>
      <div className="topics-grid">
        {topics.map((topic, i) => (
          <div key={topic}>
            <span>{String(i + 1).padStart(2, '0')}</span>
            <h3>{topic}</h3>
          </div>
        ))}
      </div>
      <p className="topics-note">
        Explore these subjects in the Spirkz app. Or{' '}
        <a href="#discover">
          try one of our three sample lessons below <ArrowRight size={15} />
        </a>
      </p>
    </section>
  );
}

export function CreatorsSection() {
  return (
    <section id="creators" className="creators-section">
      <div className="wrap creators-layout section-space">
        <div>
          <span className="eyebrow">FOR CREATORS</span>
          <h2>
            You know something
            <br />
            <em>worth sharing.</em>
          </h2>
          <p>
            Turn your expertise into short lessons for people who want to learn.
            Bring your voice, your subject, and the explanation you wish you’d
            heard sooner.
          </p>
          <ul className="plain-checks">
            <li>
              <Check />
              Keep ownership of your work
            </li>
            <li>
              <Check />
              Tools for captions, quizzes and chapters
            </li>
            <li>
              <Check />
              Creator analytics and earning opportunities
            </li>
          </ul>
          <a
            className="button button-outline"
            href="mailto:iviko.shengelia@spirkz.com?subject=Creating%20on%20Spirkz"
          >
            Talk to the team <ArrowUpRight size={18} />
          </a>
        </div>
        <div className="creator-example">
          <div className="creator-example-heading">
            <Pencil size={22} />
            <span>A lesson worth making</span>
            <small>EXAMPLE OUTLINE</small>
          </div>
          <h3>
            One idea.
            <br />
            Your way of explaining it.
          </h3>
          <ol>
            <li>
              <span>01</span>
              <div>
                <strong>Start with a question</strong>
                <p>Give someone a reason to be curious.</p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <strong>Make the idea clear</strong>
                <p>A useful example can make it click.</p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <strong>Leave them with a takeaway</strong>
                <p>One thing they can explain to a friend.</p>
              </div>
            </li>
          </ol>
          <div className="creator-example-footer">
            <BookOpen size={18} />A small format for something you know well.
          </div>
        </div>
      </div>
    </section>
  );
}

export function AppSection({ onLesson }: { onLesson: (id: number) => void }) {
  return (
    <section id="app" className="wrap app-section section-space">
      <div>
        <span className="eyebrow">THE APP</span>
        <h2>
          Your next discovery,
          <br />
          <em>right in your pocket.</em>
        </h2>
        <p>
          Swipe through lessons, save the ideas you want to revisit, and pick up
          your learning when you have a moment.
        </p>
        <ul className="plain-checks">
          <li>
            <Check />A feed focused on education
          </li>
          <li>
            <Check />
            Save lessons to come back to
          </li>
          <li>
            <Check />
            Find more subjects to explore
          </li>
        </ul>
        <div className="app-downloads">
          <a
            className="button button-dark"
            href={PLAY_STORE}
            target="_blank"
            rel="noreferrer"
          >
            <Play weight="fill" size={16} /> Google Play{' '}
            <ArrowUpRight size={17} />
          </a>
          <a className="button button-outline" href="#notify">
            iOS updates <ArrowRight size={17} />
          </a>
        </div>
      </div>
      <div className="app-preview">
        <div className="app-preview-heading">
          <DeviceMobile size={23} />
          <div>
            Something new in a minute<small>TRY A CONCEPT LESSON</small>
          </div>
        </div>
        {lessons.map((lesson, i) => (
          <button
            key={lesson.id}
            onClick={() => onLesson(i)}
            aria-label={`Play preview: ${lesson.question}`}
          >
            <img src={lesson.image} alt="" loading="lazy" />
            <span>
              <strong>{lesson.title}</strong>
              <small>{lesson.category} · 0:32</small>
            </span>
            <Play size={17} weight="fill" />
          </button>
        ))}
        <p>
          Every preview plays. Pause, explore a chapter, or try the question at
          the end.
        </p>
      </div>
    </section>
  );
}

export function InvestSection() {
  return (
    <section id="invest" className="wrap invest-section">
      <div>
        <span className="eyebrow">INVEST & PARTNER</span>
        <h2>
          Help shape what
          <br />
          <em>learning looks like next.</em>
        </h2>
        <p>
          Spirkz is based in Malta and welcomes conversations with early
          partners and investors. If the idea speaks to you, meet the people
          building it.
        </p>
      </div>
      <a
        className="invest-contact"
        href="mailto:iviko.shengelia@spirkz.com?subject=Spirkz%20partnership"
      >
        <Envelope size={30} />
        <span>
          Start a conversation<strong>iviko.shengelia@spirkz.com</strong>
        </span>
        <ArrowUpRight size={24} />
      </a>
    </section>
  );
}

export function FooterLinks() {
  return (
    <div id="contact" className="footer-links">
      <div>
        <h3>Explore</h3>
        <a href="#about">What is Spirkz?</a>
        <a href="#why">Why Spirkz</a>
        <a href="#topics">Topics</a>
        <a href="#faq">Frequently asked questions</a>
      </div>
      <div>
        <h3>Spirkz</h3>
        <a href="#app">Get the app</a>
        <a href="#creators">For creators</a>
        <a href="#invest">Invest & partner</a>
        <a href="#notify">iOS updates</a>
      </div>
      <div>
        <h3>Get in touch</h3>
        <a href="mailto:iviko.shengelia@spirkz.com">
          iviko.shengelia@spirkz.com
        </a>
        <a href="tel:+35699588696">+356 9958 8696</a>
        <address>
          St George’s Park, Triq il-Dragunara
          <br />
          San Ġiljan, Malta
        </address>
      </div>
      <div>
        <h3>Official information</h3>
        <a href={`${OFFICIAL_SITE}en/privacy`} target="_blank" rel="noreferrer">
          Privacy policy <ArrowUpRight size={12} />
        </a>
        <a href={`${OFFICIAL_SITE}en/terms`} target="_blank" rel="noreferrer">
          Terms & conditions <ArrowUpRight size={12} />
        </a>
        <a href="/credits.html">Concept & photo credits</a>
      </div>
    </div>
  );
}
