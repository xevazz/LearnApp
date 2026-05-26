// using Open Library API - free and no auth required
const BASE_URL = 'https://openlibrary.org';

// book-themed Unsplash photos used as fallback when Open Library has no cover
const BOOK_FALLBACK_IMAGES = [
  'photo-1481627834876-b7833e8f5570', // colorful books stacked
  'photo-1512820790803-83ca734da794', // open book on table
  'photo-1507842217343-583bb7270b66', // library bookshelves
  'photo-1524995997946-a1c2e315a42f', // books on shelf
  'photo-1456513080510-7bf3a84b82f8', // open book close-up
  'photo-1495446815901-a7297e633e8d', // stacked books
  'photo-1532012197267-da84d127e765', // books fanned out
  'photo-1589998059171-988d887df646', // open book with glasses
];

const buildUnsplashUrl = (photoId, width = 120, height = 160) =>
  `https://images.unsplash.com/${photoId}?w=${width}&h=${height}&fit=crop&auto=format&q=80`;

// pick a consistent book image using a hash of the key so the same book always shows the same fallback
const getBookFallbackImage = (key) => {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash << 5) - hash + key.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % BOOK_FALLBACK_IMAGES.length;
  return buildUnsplashUrl(BOOK_FALLBACK_IMAGES[index]);
};

export const fetchCourses = async (subject = 'programming', limit = 20) => {
  const response = await fetch(
    `${BASE_URL}/search.json?subject=${subject}&limit=${limit}&fields=key,title,author_name,first_publish_year,cover_i,subject`
  );

  if (!response.ok) throw new Error('Failed to fetch courses.');

  const data = await response.json();

  return data.docs.map((doc) => {
    const fallbackUrl = getBookFallbackImage(doc.key);
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
