import { useI18n } from './I18n';
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
  const { t } = useI18n();
  return (
    <section id="about" className="wrap about-section section-space">
      <div>
        <span className="eyebrow">{t('WHAT IS SPIRKZ?')}</span>
        <h2>
          {t('A feed for the')} <br />
          <em>{t('curious part of you.')}</em>
        </h2>
        <p>
          {t(
            'There’s a question behind every good discovery. Spirkz brings short educational videos into the moments you already have — on the bus, over a coffee, or between things.',
          )}{' '}
        </p>
        <p>
          {t(
            'Follow a new interest. Find an explanation that clicks. Make a little room for learning, every day.',
          )}{' '}
        </p>
        <dl className="about-stats">
          <div>
            <dt>{t('≤60s')}</dt>
            <dd>{t('per lesson')}</dd>
          </div>
          <div>
            <dt>12</dt>
            <dd>{t('topic areas')}</dd>
          </div>
          <div>
            <dt>100%</dt>
            <dd>{t('education focused')}</dd>
          </div>
        </dl>
      </div>
      <div className="about-example">
        <span className="eyebrow">
          {t('ONE QUESTION CAN TAKE YOU SOMEWHERE')}
        </span>
        <h3>
          {t('Why does the Moon')} <br />
          {t('always look familiar?')}{' '}
        </h3>
        <div className="about-meta">
          <span>{t('Space')}</span>
          <span>{t('32 seconds')}</span>
          <span>{t('One new idea')}</span>
        </div>
        <button className="button button-dark" onClick={() => onLesson(0)}>
          <Play size={17} weight="fill" /> {t('Find out')}{' '}
          <ArrowRight size={17} />
        </button>
        <small>{t('Original concept lesson')}</small>
      </div>
    </section>
  );
}

export function WhySection() {
  const { t } = useI18n();
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
            <span className="eyebrow">{t('WHY SPIRKZ')}</span>
            <h2>
              {t('A better reason')} <em>{t('to keep watching.')}</em>
            </h2>
          </div>
        </div>
        <div className="benefits-grid">
          {benefits.map(([Icon, title, body]) => (
            <article key={t(title)}>
              <Icon size={28} weight="regular" aria-hidden="true" />
              <h3>{t(title)}</h3>
              <p>{t(body)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TopicsSection() {
  const { t, localize } = useI18n();
  return (
    <section id="topics" className="wrap topics-section section-space">
      <div className="section-heading">
        <div>
          <span className="eyebrow">{t('TWELVE WAYS INTO SOMETHING NEW')}</span>
          <h2>
            {t('Where will your')} <em>{t('curiosity go?')}</em>
          </h2>
        </div>
        <p>
          {t('Start with what you love.')} <br />
          {t('Leave room for a surprise.')}{' '}
        </p>
      </div>
      <div className="topics-grid">
        {localize(topics).map((topic, i) => (
          <div key={topic}>
            <span>{String(i + 1).padStart(2, '0')}</span>
            <h3>{topic}</h3>
          </div>
        ))}
      </div>
      <p className="topics-note">
        {t('Explore these subjects in the Spirkz app. Or')}{' '}
        <a href="#discover">
          {t('try one of our three sample lessons below')}{' '}
          <ArrowRight size={15} />
        </a>
      </p>
    </section>
  );
}

export function CreatorsSection() {
  const { t } = useI18n();
  return (
    <section id="creators" className="creators-section">
      <div className="wrap creators-layout section-space">
        <div>
          <span className="eyebrow">{t('FOR CREATORS')}</span>
          <h2>
            {t('You know something')} <br />
            <em>{t('worth sharing.')}</em>
          </h2>
          <p>
            {t(
              'Turn your expertise into short lessons for people who want to learn. Bring your voice, your subject, and the explanation you wish you’d heard sooner.',
            )}{' '}
          </p>
          <ul className="plain-checks">
            <li>
              <Check />
              {t('Keep ownership of your work')}{' '}
            </li>
            <li>
              <Check />
              {t('Tools for captions, quizzes and chapters')}{' '}
            </li>
            <li>
              <Check />
              {t('Creator analytics and earning opportunities')}{' '}
            </li>
          </ul>
          <a
            className="button button-outline"
            href="mailto:iviko.shengelia@spirkz.com?subject=Creating%20on%20Spirkz"
          >
            {t('Talk to the team')} <ArrowUpRight size={18} />
          </a>
        </div>
        <div className="creator-example">
          <div className="creator-example-heading">
            <Pencil size={22} />
            <span>{t('A lesson worth making')}</span>
            <small>{t('EXAMPLE OUTLINE')}</small>
          </div>
          <h3>
            {t('One idea.')} <br />
            {t('Your way of explaining it.')}{' '}
          </h3>
          <ol>
            <li>
              <span>01</span>
              <div>
                <strong>{t('Start with a question')}</strong>
                <p>{t('Give someone a reason to be curious.')}</p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <strong>{t('Make the idea clear')}</strong>
                <p>{t('A useful example can make it click.')}</p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <strong>{t('Leave them with a takeaway')}</strong>
                <p>{t('One thing they can explain to a friend.')}</p>
              </div>
            </li>
          </ol>
          <div className="creator-example-footer">
            <BookOpen size={18} />
            {t('A small format for something you know well.')}{' '}
          </div>
        </div>
      </div>
    </section>
  );
}

export function AppSection({ onLesson }: { onLesson: (id: number) => void }) {
  const { t, localize } = useI18n();
  return (
    <section id="app" className="wrap app-section section-space">
      <div>
        <span className="eyebrow">{t('THE APP')}</span>
        <h2>
          {t('Your next discovery,')} <br />
          <em>{t('right in your pocket.')}</em>
        </h2>
        <p>
          {t(
            'Swipe through lessons, save the ideas you want to revisit, and pick up your learning when you have a moment.',
          )}{' '}
        </p>
        <ul className="plain-checks">
          <li>
            <Check />
            {t('A feed focused on education')}{' '}
          </li>
          <li>
            <Check />
            {t('Save lessons to come back to')}{' '}
          </li>
          <li>
            <Check />
            {t('Find more subjects to explore')}{' '}
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
            {t('iOS updates')} <ArrowRight size={17} />
          </a>
        </div>
      </div>
      <div className="app-preview">
        <div className="app-preview-heading">
          <DeviceMobile size={23} />
          <div>
            {t('Something new in a minute')}
            <small>{t('TRY A CONCEPT LESSON')}</small>
          </div>
        </div>
        {localize(lessons).map((lesson, i) => (
          <button
            key={lesson.id}
            onClick={() => onLesson(i)}
            aria-label={t('Play preview: {question}', {
              question: lesson.question,
            })}
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
          {t(
            'Every preview plays. Pause, explore a chapter, or try the question at the end.',
          )}{' '}
        </p>
      </div>
    </section>
  );
}

export function InvestSection() {
  const { t } = useI18n();
  return (
    <section id="invest" className="wrap invest-section">
      <div>
        <span className="eyebrow">{t('INVEST & PARTNER')}</span>
        <h2>
          {t('Help shape what')} <br />
          <em>{t('learning looks like next.')}</em>
        </h2>
        <p>
          {t(
            'Spirkz is based in Malta and welcomes conversations with early partners and investors. If the idea speaks to you, meet the people building it.',
          )}{' '}
        </p>
      </div>
      <a
        className="invest-contact"
        href="mailto:iviko.shengelia@spirkz.com?subject=Spirkz%20partnership"
      >
        <Envelope size={30} />
        <span>
          {t('Start a conversation')}
          <strong>iviko.shengelia@spirkz.com</strong>
        </span>
        <ArrowUpRight size={24} />
      </a>
    </section>
  );
}

export function FooterLinks() {
  const { t, locale } = useI18n();
  return (
    <div id="contact" className="footer-links">
      <div>
        <h3>{t('Explore')}</h3>
        <a href="#about">{t('What is Spirkz?')}</a>
        <a href="#why">{t('Why Spirkz')}</a>
        <a href="#topics">{t('Topics')}</a>
        <a href="#faq">{t('Frequently asked questions')}</a>
      </div>
      <div>
        <h3>Spirkz</h3>
        <a href="#app">{t('Get the app')}</a>
        <a href="#creators">{t('For creators')}</a>
        <a href="#invest">{t('Invest & partner')}</a>
        <a href="#notify">{t('iOS updates')}</a>
      </div>
      <div>
        <h3>{t('Get in touch')}</h3>
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
        <h3>{t('Official information')}</h3>
        <a
          href={`${OFFICIAL_SITE}${locale}/privacy`}
          target="_blank"
          rel="noreferrer"
        >
          {t('Privacy policy')} <ArrowUpRight size={12} />
        </a>
        <a
          href={`${OFFICIAL_SITE}${locale}/terms`}
          target="_blank"
          rel="noreferrer"
        >
          {t('Terms & conditions')} <ArrowUpRight size={12} />
        </a>
        <a href="/credits.html">{t('Concept & photo credits')}</a>
      </div>
    </div>
  );
}
