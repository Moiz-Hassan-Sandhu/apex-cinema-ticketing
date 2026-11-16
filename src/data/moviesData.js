/**
 * Apex Cinema Lounge - Official Movie Catalog (FR03)
 * Real official theatrical poster artwork downloaded locally to /posters/
 * 12 richly detailed screenings with stable IDs, runtimes, formats, and showtimes
 */

export const MOVIES_DATA = [
  {
    id: 'movie-01',
    title: 'Dune: Part Two',
    genre: 'Sci-Fi',
    rating: 'PG-13',
    runtime: '2h 46m',
    language: 'English (Dolby Atmos)',
    imdbRating: 8.6,
    reviewsCount: 1420,
    director: 'Denis Villeneuve',
    cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson', 'Javier Bardem'],
    synopsis: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family in an epic galactic war.',
    format: 'IMAX 3D',
    basePrice: 1500,
    isAvailable: true,
    poster: '/posters/dune2.jpg',
    showtimes: [
      { id: 'st-01', time: '13:15', hall: 'Hall 1 (IMAX 70mm)', isMatinee: true, availableSeats: 34 },
      { id: 'st-02', time: '16:45', hall: 'Hall 1 (IMAX 70mm)', isMatinee: false, availableSeats: 18 },
      { id: 'st-03', time: '20:30', hall: 'Hall 1 (IMAX 70mm)', isMatinee: false, availableSeats: 6 }
    ]
  },
  {
    id: 'movie-02',
    title: 'Oppenheimer',
    genre: 'Drama',
    rating: '18+', // Operating Rule 2: 18+ Adult film
    runtime: '3h 00m',
    language: 'English',
    imdbRating: 8.9,
    reviewsCount: 2180,
    director: 'Christopher Nolan',
    cast: ['Cillian Murphy', 'Emily Blunt', 'Matt Damon', 'Robert Downey Jr.'],
    synopsis: 'The dramatic chronicle of J. Robert Oppenheimer and his role in the Manhattan Project, pioneering the atomic weapon that altered human history.',
    format: 'Dolby Atmos',
    basePrice: 1400,
    isAvailable: true,
    poster: '/posters/oppenheimer.jpg',
    showtimes: [
      { id: 'st-04', time: '14:00', hall: 'Hall 2 (Dolby Atmos)', isMatinee: true, availableSeats: 26 },
      { id: 'st-05', time: '18:00', hall: 'Hall 2 (Dolby Atmos)', isMatinee: false, availableSeats: 12 },
      { id: 'st-06', time: '21:45', hall: 'Hall 2 (Dolby Atmos)', isMatinee: false, availableSeats: 4 }
    ]
  },
  {
    id: 'movie-03',
    title: 'Spider-Man: Across the Spider-Verse',
    genre: 'Animation',
    rating: 'PG',
    runtime: '2h 20m',
    language: 'English',
    imdbRating: 8.7,
    reviewsCount: 1690,
    director: 'Joaquim Dos Santos, Kemp Powers',
    cast: ['Shameik Moore', 'Hailee Steinfeld', 'Oscar Isaac', 'Daniel Kaluuya'],
    synopsis: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.',
    format: 'Standard 2D',
    basePrice: 1200,
    isAvailable: true,
    poster: '/posters/spiderman.jpg',
    showtimes: [
      { id: 'st-07', time: '12:30', hall: 'Hall 3 (Grand Theater)', isMatinee: true, availableSeats: 40 },
      { id: 'st-08', time: '15:30', hall: 'Hall 3 (Grand Theater)', isMatinee: true, availableSeats: 22 },
      { id: 'st-09', time: '19:00', hall: 'Hall 3 (Grand Theater)', isMatinee: false, availableSeats: 14 }
    ]
  },
  {
    id: 'movie-04',
    title: 'The Batman',
    genre: 'Action',
    rating: 'PG-13',
    runtime: '2h 56m',
    language: 'English',
    imdbRating: 7.9,
    reviewsCount: 1980,
    director: 'Matt Reeves',
    cast: ['Robert Pattinson', 'Zoë Kravitz', 'Colin Farrell', 'Paul Dano'],
    synopsis: 'When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city\'s hidden corruption.',
    format: 'IMAX 3D',
    basePrice: 1650,
    isAvailable: true,
    poster: '/posters/batman.jpg',
    showtimes: [
      { id: 'st-10', time: '13:00', hall: 'Hall 1 (IMAX 70mm)', isMatinee: true, availableSeats: 28 },
      { id: 'st-11', time: '17:30', hall: 'Hall 1 (IMAX 70mm)', isMatinee: false, availableSeats: 16 },
      { id: 'st-12', time: '21:15', hall: 'Hall 1 (IMAX 70mm)', isMatinee: false, availableSeats: 8 }
    ]
  },
  {
    id: 'movie-05',
    title: 'Interstellar (10th Anniversary)',
    genre: 'Sci-Fi',
    rating: 'PG-13',
    runtime: '2h 49m',
    language: 'English (IMAX Original)',
    imdbRating: 8.7,
    reviewsCount: 3100,
    director: 'Christopher Nolan',
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain'],
    synopsis: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival on a new hospitable world.',
    format: 'IMAX 3D',
    basePrice: 1600,
    isAvailable: true,
    poster: '/posters/interstellar.jpg',
    showtimes: [
      { id: 'st-13', time: '14:30', hall: 'Hall 1 (IMAX 70mm)', isMatinee: true, availableSeats: 32 },
      { id: 'st-14', time: '18:15', hall: 'Hall 1 (IMAX 70mm)', isMatinee: false, availableSeats: 15 },
      { id: 'st-15', time: '22:00', hall: 'Hall 1 (IMAX 70mm)', isMatinee: false, availableSeats: 5 }
    ]
  },
  {
    id: 'movie-06',
    title: 'John Wick: Chapter 4',
    genre: 'Action',
    rating: '18+', // Operating Rule 2: 18+ Adult film
    runtime: '2h 49m',
    language: 'English',
    imdbRating: 7.9,
    reviewsCount: 1120,
    director: 'Chad Stahelski',
    cast: ['Keanu Reeves', 'Donnie Yen', 'Bill Skarsgård', 'Laurence Fishburne'],
    synopsis: 'John Wick uncovers a path to defeating The High Table, facing off against lethal adversaries with international alliances across Paris, Osaka, and Berlin.',
    format: 'Dolby Atmos',
    basePrice: 1350,
    isAvailable: true,
    poster: '/posters/johnwick4.jpg',
    showtimes: [
      { id: 'st-16', time: '15:00', hall: 'Hall 2 (Dolby Atmos)', isMatinee: true, availableSeats: 25 },
      { id: 'st-17', time: '18:30', hall: 'Hall 2 (Dolby Atmos)', isMatinee: false, availableSeats: 10 },
      { id: 'st-18', time: '22:15', hall: 'Hall 2 (Dolby Atmos)', isMatinee: false, availableSeats: 2 }
    ]
  },
  {
    id: 'movie-07',
    title: 'The Legend of Maula Jatt',
    genre: 'Action',
    rating: 'PG-13',
    runtime: '2h 33m',
    language: 'Punjabi (English Subtitles)',
    imdbRating: 8.5,
    reviewsCount: 1850,
    director: 'Bilal Lashari',
    cast: ['Fawad Khan', 'Hamza Ali Abbasi', 'Mahira Khan', 'Humaima Malick'],
    synopsis: 'A deep-seated rivalry between fierce prizefighter Maula Jatt and ruthless clan chieftain Noori Natt shakes the realm in an epic showdown of vengeance.',
    format: 'VIP Lounge',
    basePrice: 1800,
    isAvailable: true,
    poster: '/posters/maulajatt.jpg',
    showtimes: [
      { id: 'st-19', time: '13:45', hall: 'VIP Gold Lounge', isMatinee: true, availableSeats: 16 },
      { id: 'st-20', time: '17:15', hall: 'VIP Gold Lounge', isMatinee: false, availableSeats: 8 },
      { id: 'st-21', time: '20:45', hall: 'VIP Gold Lounge', isMatinee: false, availableSeats: 3 }
    ]
  },
  {
    id: 'movie-08',
    title: 'Past Lives',
    genre: 'Drama',
    rating: 'PG-13',
    runtime: '1h 45m',
    language: 'Korean & English',
    imdbRating: 8.1,
    reviewsCount: 650,
    director: 'Celine Song',
    cast: ['Greta Lee', 'Teo Yoo', 'John Magaro'],
    synopsis: 'Two childhood friends are separated after one family emigrates from Seoul. Two decades later, they are reunited for one fateful week in New York.',
    format: 'Standard 2D',
    basePrice: 1100,
    isAvailable: true,
    poster: '/posters/pastlives.jpg',
    showtimes: [
      { id: 'st-22', time: '12:00', hall: 'Hall 3 (Grand Theater)', isMatinee: true, availableSeats: 38 },
      { id: 'st-23', time: '16:00', hall: 'Hall 3 (Grand Theater)', isMatinee: false, availableSeats: 20 },
      { id: 'st-24', time: '19:30', hall: 'Hall 3 (Grand Theater)', isMatinee: false, availableSeats: 11 }
    ]
  },
  {
    id: 'movie-09',
    title: 'Blade Runner 2049',
    genre: 'Sci-Fi',
    rating: '18+', // Operating Rule 2: 18+ Adult film
    runtime: '2h 44m',
    language: 'English',
    imdbRating: 8.0,
    reviewsCount: 1450,
    director: 'Denis Villeneuve',
    cast: ['Ryan Gosling', 'Harrison Ford', 'Ana de Armas', 'Sylvia Hoeks'],
    synopsis: 'Officer K, a new blade runner for the LAPD, unearths a long-buried secret that has the potential to plunge what\'s left of society into chaos.',
    format: 'Dolby Atmos',
    basePrice: 1450,
    isAvailable: true,
    poster: '/posters/bladerunner2049.jpg',
    showtimes: [
      { id: 'st-25', time: '14:15', hall: 'Hall 2 (Dolby Atmos)', isMatinee: true, availableSeats: 22 },
      { id: 'st-26', time: '18:00', hall: 'Hall 2 (Dolby Atmos)', isMatinee: false, availableSeats: 14 },
      { id: 'st-27', time: '21:30', hall: 'Hall 2 (Dolby Atmos)', isMatinee: false, availableSeats: 5 }
    ]
  },
  {
    id: 'movie-10',
    title: 'The Boy and the Heron',
    genre: 'Animation',
    rating: 'PG',
    runtime: '2h 04m',
    language: 'Japanese (Subtitled)',
    imdbRating: 8.0,
    reviewsCount: 890,
    director: 'Hayao Miyazaki',
    cast: ['Soma Santoki', 'Masaki Suda', 'Aimyon'],
    synopsis: 'A young boy enters an extraordinary mystical world shared by the living and the dead, guided by a peculiar talking heron in a tale of grief and courage.',
    format: 'Standard 2D',
    basePrice: 1150,
    isAvailable: true,
    poster: '/posters/boyheron.jpg',
    showtimes: [
      { id: 'st-28', time: '11:30', hall: 'Hall 3 (Grand Theater)', isMatinee: true, availableSeats: 42 },
      { id: 'st-29', time: '14:45', hall: 'Hall 3 (Grand Theater)', isMatinee: true, availableSeats: 30 },
      { id: 'st-30', time: '18:15', hall: 'Hall 3 (Grand Theater)', isMatinee: false, availableSeats: 19 }
    ]
  },
  {
    id: 'movie-11',
    title: 'Killers of the Flower Moon',
    genre: 'Drama',
    rating: '18+', // Operating Rule 2: 18+ Adult film
    runtime: '3h 26m',
    language: 'English',
    imdbRating: 7.9,
    reviewsCount: 760,
    director: 'Martin Scorsese',
    cast: ['Leonardo DiCaprio', 'Robert De Niro', 'Lily Gladstone'],
    synopsis: 'When oil is discovered in 1920s Oklahoma under Osage Nation land, the Osage people are murdered one by one until the newly-formed FBI steps in.',
    format: 'VIP Lounge',
    basePrice: 1750,
    isAvailable: true,
    poster: '/posters/killersflowermoon.jpg',
    showtimes: [
      { id: 'st-31', time: '13:00', hall: 'VIP Gold Lounge', isMatinee: true, availableSeats: 14 },
      { id: 'st-32', time: '17:00', hall: 'VIP Gold Lounge', isMatinee: false, availableSeats: 6 },
      { id: 'st-33', time: '21:00', hall: 'VIP Gold Lounge', isMatinee: false, availableSeats: 2 }
    ]
  },
  {
    id: 'movie-12',
    title: 'Godzilla Minus One',
    genre: 'Sci-Fi',
    rating: 'PG-13',
    runtime: '2h 05m',
    language: 'Japanese (Subtitled)',
    imdbRating: 8.3,
    reviewsCount: 1100,
    director: 'Takashi Yamazaki',
    cast: ['Ryunosuke Kamiki', 'Minami Hamabe', 'Yuki Yamada'],
    synopsis: 'Post-war Japan is at its lowest point when an unexpected giant threat emerges from the ocean depths, challenging a devastated nation to unite.',
    format: 'IMAX 3D',
    basePrice: 1550,
    isAvailable: true,
    poster: '/posters/godzillaminusone.jpg',
    showtimes: [
      { id: 'st-34', time: '12:45', hall: 'Hall 1 (IMAX 70mm)', isMatinee: true, availableSeats: 30 },
      { id: 'st-35', time: '16:15', hall: 'Hall 1 (IMAX 70mm)', isMatinee: false, availableSeats: 15 },
      { id: 'st-36', time: '19:45', hall: 'Hall 1 (IMAX 70mm)', isMatinee: false, availableSeats: 7 }
    ]
  }
];

export const GENRES = ['All Genres', 'Action', 'Sci-Fi', 'Drama', 'Animation'];
export const FORMATS = ['All Formats', 'IMAX 3D', 'Dolby Atmos', 'VIP Lounge', 'Standard 2D'];
export const AGE_RATINGS = [
  'All Ratings',
  'Family (PG)',
  'Teens (PG-13)',
  '18+ Adults Only'
];

/**
 * Standard Seating Layout Generator (Auditorium Grid Rows A to F, 8 seats per row)
 * Splits into Left (1-4) and Right (5-8) with a center aisle
 * Rows A-D: Standard Seating
 * Rows E-F: Premium VIP Leather Recliners (+PKR 200)
 */
export function generateHallSeats(basePrice = 1200, alreadyTaken = ['B3', 'B4', 'D5', 'E2']) {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
  const seats = [];

  rows.forEach((rowLetter, rowIdx) => {
    const isVipRow = rowIdx >= 4;
    const seatPrice = isVipRow ? basePrice + 200 : basePrice;

    for (let num = 1; num <= 8; num++) {
      const id = `${rowLetter}${num}`;
      const isTaken = alreadyTaken.includes(id);

      seats.push({
        id,
        row: rowLetter,
        number: num,
        tier: isVipRow ? 'VIP Recliner' : 'Standard',
        price: seatPrice,
        isReserved: isTaken
      });
    }
  });

  return seats;
}
