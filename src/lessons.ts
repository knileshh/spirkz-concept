export const lessons = [
  {
    id: 'moon',
    category: 'SPACE',
    title: 'The Moon has a familiar face.',
    question: 'Why do we always see the same side of the Moon?',
    description: 'One orbit. One rotation. One surprisingly elegant answer.',
    image: '/images/moon.jpg',
    duration: 32,
    chapters: [
      {
        title: 'A familiar face',
        text: 'Look up at the Moon tonight. Its familiar pattern of dark plains always faces roughly the same way.',
      },
      {
        title: 'It really does rotate',
        text: 'The Moon turns once on its axis in about 27.3 days. It also takes about 27.3 days to orbit Earth.',
      },
      {
        title: 'Perfectly in step',
        text: 'This matching rhythm is called synchronous rotation. As the Moon moves around Earth, the same side keeps facing us.',
      },
      {
        title: 'A small extra glimpse',
        text: 'A gentle apparent wobble, called libration, lets us see about 59% of the lunar surface over time.',
      },
    ],
    quiz: 'Does the Moon rotate on its axis?',
    answers: ['Yes — once per orbit', 'No — it stays still'],
    correct: 0,
    explanation:
      'Exactly. Its rotation and orbit take the same amount of time, so the same side faces Earth.',
    source: 'https://science.nasa.gov/moon/facts/',
    sourceName: 'NASA · Moon facts',
  },
  {
    id: 'ocean',
    category: 'OUR PLANET',
    title: 'An ocean of blue. But why?',
    question: 'What gives the ocean its blue color?',
    description: 'There is more to it than a reflection of the sky.',
    image: '/images/ocean.jpg',
    duration: 32,
    chapters: [
      {
        title: 'More than a reflection',
        text: 'A glass of water looks clear. Yet a deep ocean often looks blue. The depth makes a difference.',
      },
      {
        title: 'Light is a mix of colors',
        text: 'Sunlight contains many wavelengths. Water absorbs the red part of the spectrum more strongly than the blue.',
      },
      {
        title: 'Blue travels farther',
        text: 'As light travels through deep water, more of the red light is absorbed. The light that returns to our eyes is often blue.',
      },
      {
        title: 'Every ocean has a palette',
        text: 'Plankton, sediment, depth and reflected sky can all change the color. That is why coastal water can look green or turquoise.',
      },
    ],
    quiz: 'Which part of visible light does water absorb more strongly?',
    answers: ['Blue light', 'Red light'],
    correct: 1,
    explanation:
      'Yes. Red light is absorbed more strongly, helping explain the blue appearance of deep, clear water.',
    source: 'https://oceanservice.noaa.gov/facts/oceanblue.html',
    sourceName: 'NOAA · Why is the ocean blue?',
  },
  {
    id: 'fern',
    category: 'NATURE',
    title: 'A leaf. A tiny solar kitchen.',
    question: 'How do plants turn sunlight into food?',
    description: 'Meet the quiet chemistry happening all around you.',
    image: '/images/fern.jpg',
    duration: 32,
    chapters: [
      {
        title: 'Powered by sunlight',
        text: 'Inside a leaf, tiny structures called chloroplasts contain chlorophyll, a pigment that captures light energy.',
      },
      {
        title: 'Just add water and air',
        text: 'Roots supply water. Small pores in the leaves let in carbon dioxide from the air.',
      },
      {
        title: 'Making something new',
        text: 'Photosynthesis uses light energy to help turn water and carbon dioxide into sugars that support the plant.',
      },
      {
        title: 'A useful by-product',
        text: 'Oxygen is released along the way. The green world around us is doing chemistry with sunlight, every day.',
      },
    ],
    quiz: 'What supplies the energy for photosynthesis?',
    answers: ['Soil', 'Sunlight'],
    correct: 1,
    explanation:
      'That is it. Light supplies the energy; water and carbon dioxide are ingredients for making sugars.',
    source: 'https://education.nationalgeographic.org/resource/photosynthesis/',
    sourceName: 'National Geographic · Photosynthesis',
  },
] as const;
export const PLAY_STORE =
  'https://play.google.com/store/apps/details?id=com.spirkz.app';
export const OFFICIAL_SITE = 'https://www.spirkz.com/';
export function chapterAt(seconds: number, duration: number, count: number) {
  return Math.min(
    count - 1,
    Math.max(0, Math.floor(seconds / (duration / count))),
  );
}
