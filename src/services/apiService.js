// using Open Library API - free and no auth required
const BASE_URL = 'https://openlibrary.org';

// curated Unsplash photo IDs relevant to each programming topic
// these are permanent CDN URLs, no API key needed to display them
const TOPIC_IMAGES = {
  python:      'photo-1526374965328-7f61d4dc18c5',
  javascript:  'photo-1627398242454-45a1465c2479',
  java:        'photo-1555066931-4365d14bab8c',
  web:         'photo-1547658719-da2b51169166',
  database:    'photo-1544383835-bda2bc66a2e2',
  sql:         'photo-1544383835-bda2bc66a2e2',
  data:        'photo-1504639725590-34d0984388bd',
  machine:     'photo-1677442135703-1787eea5ce01',
  artificial:  'photo-1677442135703-1787eea5ce01',
  network:     'photo-1558494949-ef010cbdcc31',
  security:    'photo-1550751827-4bd374c3f58b',
  linux:       'photo-1629654297299-c8506221ca97',
  unix:        'photo-1629654297299-c8506221ca97',
  mobile:      'photo-1512941937669-90a1b58e7e9c',
  android:     'photo-1512941937669-90a1b58e7e9c',
  algorithms:  'photo-1635070041078-e363dbe005cb',
  math:        'photo-1509228468518-180b8ef3c68c',
  game:        'photo-1552820728-8b83bb6b773f',
  devops:      'photo-1667372393119-3d4c48d07fc9',
  cloud:       'photo-1667372393119-3d4c48d07fc9',
  react:       'photo-1627398242454-45a1465c2479',
  software:    'photo-1587620931955-e6b0e4b23571',
  computer:    'photo-1516116216624-53ad0879b08c',
  design:      'photo-1561070791-2526d30994b5',
  typescript:  'photo-1627398242454-45a1465c2479',
  rust:        'photo-1555066931-4365d14bab8c',
  go:          'photo-1555066931-4365d14bab8c',
  cpp:         'photo-1555066931-4365d14bab8c',
  c:           'photo-1555066931-4365d14bab8c',
};

// default image for books that don't match any topic
const DEFAULT_IMAGES = [
  'photo-1481627834876-b7833e8f5570', // books
  'photo-1544716278-ca5e3f4abd8c', // laptop + notebook
  'photo-1516116216624-53ad0879b08c', // computer code
  'photo-1587620931955-e6b0e4b23571', // code on screen
  'photo-1518770660439-4636190af475', // technology
];

const buildUnsplashUrl = (photoId, width = 120, height = 160) =>
  `https://images.unsplash.com/${photoId}?w=${width}&h=${height}&fit=crop&auto=format&q=80`;

// pick the most relevant image based on the book title and subjects
const getRelevantImage = (title, subjects, key) => {
  const searchText = [title, ...(subjects || [])].join(' ').toLowerCase();

  for (const [keyword, photoId] of Object.entries(TOPIC_IMAGES)) {
    if (searchText.includes(keyword)) {
      return buildUnsplashUrl(photoId);
    }
  }

  // fall back to a default image using a hash of the key for consistency
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash << 5) - hash + key.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % DEFAULT_IMAGES.length;
  return buildUnsplashUrl(DEFAULT_IMAGES[index]);
};

export const fetchCourses = async (subject = 'programming', limit = 20) => {
  const response = await fetch(
    `${BASE_URL}/search.json?subject=${subject}&limit=${limit}&fields=key,title,author_name,first_publish_year,cover_i,subject`
  );

  if (!response.ok) throw new Error('Failed to fetch courses.');

  const data = await response.json();

  return data.docs.map((doc) => {
    const fallbackUrl = getRelevantImage(doc.title || '', doc.subject || [], doc.key);
    return {
      key: doc.key,
      title: doc.title || 'No title',
      author: doc.author_name ? doc.author_name[0] : 'Unknown author',
      year: doc.first_publish_year || 'N/A',
      coverId: doc.cover_i || null,
      subjects: doc.subject ? doc.subject.slice(0, 3) : [],
      // try open library first, fall back to topic-relevant unsplash image
      coverUrl: doc.cover_i
        ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
        : fallbackUrl,
      fallbackUrl,
    };
  });
};

export const fetchCourseDetail = async (workKey) => {
  const response = await fetch(`${BASE_URL}${workKey}.json`);

  if (!response.ok) throw new Error('Failed to fetch course details.');

  const data = await response.json();

  const description =
    typeof data.description === 'string'
      ? data.description
      : data.description?.value || 'No description available.';

  return {
    key: workKey,
    title: data.title || 'No title',
    description,
    subjects: data.subjects ? data.subjects.slice(0, 5) : [],
    firstPublishedDate: data.first_publish_date || 'Unknown',
  };
};
