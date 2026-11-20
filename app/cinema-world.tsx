"use client";

import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Clapperboard,
  Download,
  Film,
  Info,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Star,
  Ticket,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from "react";
import { QRCodeSVG } from "qrcode.react";
import { supabase } from "./supabase";

type MovieTab = "Now showing" | "Coming soon" | "Advance booking";
type MovieFormat = "2D" | "3D" | "IMAX" | "Director's Club";
const cinemaBranches = [
  { name: "SM Mall of Asia", city: "Pasay City", address: "Seaside Blvd, Mall of Asia Complex, Pasay City" },
  { name: "SM Megamall", city: "Mandaluyong City", address: "EDSA cor. Doña Julia Vargas Ave., Ortigas Center, Mandaluyong City" },
  { name: "SM North EDSA", city: "Quezon City", address: "North Ave. cor. EDSA, Bagong Pag-asa, Quezon City" },
  { name: "SM Fairview", city: "Quezon City", address: "Quirino Highway cor. Regalado Ave., Greater Lagro, Quezon City" },
  { name: "SM Aura Premier", city: "Taguig City", address: "26th St. cor. McKinley Parkway, Bonifacio Global City, Taguig City" },
  { name: "Ayala Malls Manila Bay", city: "Parañaque City", address: "Diosdado Macapagal Blvd. cor. Aseana Ave., Parañaque City" },
  { name: "Ayala Malls TriNoma", city: "Quezon City", address: "EDSA cor. North Ave., Bagong Pag-asa, Quezon City" },
  { name: "Glorietta", city: "Makati City", address: "Ayala Center, East St., Makati City" },
  { name: "Greenbelt", city: "Makati City", address: "Legazpi St., Legazpi Village, Makati City" },
  { name: "Fisher Mall", city: "Quezon City", address: "Quezon Ave. cor. Roosevelt Ave., Quezon City" },
] as const;
type CinemaBranch = typeof cinemaBranches[number]["name"];
const paymentMethods = ["Credit / Debit Card", "GCash", "Maya", "Bank Transfer"] as const;
type PaymentMethod = typeof paymentMethods[number];
type PaymentDetails = {
  cardholderName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
  reference: string;
};
const emptyPaymentDetails: PaymentDetails = {
  cardholderName: "",
  cardNumber: "",
  expiry: "",
  cvv: "",
  reference: "",
};

type Movie = {
  id: string;
  title: string;
  shortTitle: string;
  status: MovieTab;
  rating: string;
  duration: string;
  genres: string[];
  director: string;
  cast: string;
  synopsis: string;
  formats: [MovieFormat, ...MovieFormat[]];
  poster: string;
  tint: string;
  sourceUrl: string;
  advanceBooking?: boolean;
  monochrome?: boolean;
};
type PosterStyle = CSSProperties & {
  "--poster-image": string;
};

const movies: Movie[] = [
  {
    id: "spider-man",
    title: "Spider-Man: Brand New Day",
    shortTitle: "Spider-Man",
    status: "Now showing",
    rating: "PG-13",
    duration: "2h 16m",
    genres: ["Action", "Fantasy", "Adventure", "Sci-Fi"],
    director: "Destin Daniel Cretton",
    cast: "Tom Holland, Zendaya, Sadie Sink",
    synopsis:
      "Peter Parker protects New York on his own, but the strain of his double life changes his powers as he faces a new telepathic threat.",
    formats: ["2D", "3D", "Director's Club"],
    poster: "https://upload.wikimedia.org/wikipedia/en/9/9a/Spider-Man_Brand_New_Day_poster.jpg",
    tint: "#492374",
    sourceUrl: "https://en.wikipedia.org/wiki/Spider-Man:_Brand_New_Day",
  },
  {
    id: "odyssey",
    title: "The Odyssey",
    shortTitle: "The Odyssey",
    status: "Now showing",
    rating: "PG-13",
    duration: "2h 49m",
    genres: ["Action", "Fantasy", "Adventure"],
    director: "Christopher Nolan",
    cast: "Matt Damon, Anne Hathaway, Tom Holland, Zendaya",
    synopsis:
      "After the Trojan War, Odysseus, king of Ithaca, faces a perilous journey home and encounters mythical beings as he tries to reunite with Penelope.",
    formats: ["2D", "IMAX", "Director's Club"],
    poster: "https://upload.wikimedia.org/wikipedia/en/9/90/The_Odyssey_%282026_film%29_poster.jpg",
    tint: "#25455a",
    sourceUrl: "https://en.wikipedia.org/wiki/The_Odyssey_(2026_film)",
  },
  {
    id: "toy-story-5",
    title: "Toy Story 5",
    shortTitle: "Toy Story 5",
    status: "Now showing",
    rating: "G",
    duration: "1h 42m",
    genres: ["Animation", "Adventure", "Comedy"],
    director: "Andrew Stanton",
    cast: "Tom Hanks, Tim Allen, Joan Cusack",
    synopsis:
      "When Bonnie's new tablet becomes her favorite plaything, Jessie, Woody, Buzz, and the other toys face the challenge of keeping their place in her life.",
    formats: ["2D", "3D"],
    poster: "https://upload.wikimedia.org/wikipedia/en/0/08/Toy_Story_5_poster.jpg",
    tint: "#375e81",
    sourceUrl: "https://en.wikipedia.org/wiki/Toy_Story_5",
  },
  {
    id: "minions",
    title: "Minions & Monsters",
    shortTitle: "Minions & Monsters",
    status: "Now showing",
    rating: "PG",
    duration: "1h 28m",
    genres: ["Animation", "Comedy", "Family"],
    director: "Pierre Coffin",
    cast: "Pierre Coffin, Trey Parker, Allison Janney, Jeff Bridges",
    synopsis:
      "In 1920s Hollywood, a band of Minions sets out to make a monster movie of its own, with their filmmaking plans unleashing real chaos.",
    formats: ["2D", "Director's Club"],
    poster: "https://upload.wikimedia.org/wikipedia/en/9/9d/Minions_%26_Monsters_poster.jpg",
    tint: "#85651b",
    sourceUrl: "https://en.wikipedia.org/wiki/Minions_%26_Monsters",
  },
  {
    id: "insidious",
    title: "Insidious: Out of the Further",
    shortTitle: "Insidious",
    status: "Now showing",
    rating: "R-16",
    duration: "1h 46m",
    genres: ["Horror", "Mystery", "Thriller"],
    director: "Jacob Chase",
    cast: "Amelia Eve, Brandon Perea, Maisie Richardson-Sellers, Lin Shaye",
    synopsis:
      "Gemma can carry spirits from the Further into the living world. When malevolent forces begin to hunt her, she turns to Elise Rainier for help.",
    formats: ["2D", "3D"],
    poster: "https://upload.wikimedia.org/wikipedia/en/5/5c/Insidious-out-of-the-further-poster.png",
    tint: "#4c2029",
    sourceUrl: "https://en.wikipedia.org/wiki/Insidious:_Out_of_the_Further",
  },
  {
    id: "resident-evil",
    title: "Resident Evil",
    shortTitle: "Resident Evil",
    status: "Advance booking",
    rating: "R-16",
    duration: "Coming soon",
    genres: ["Action", "Horror", "Sci-Fi"],
    director: "Zach Cregger",
    cast: "Austin Abrams, Zach Cherry, Kali Reis, Paul Walter Hauser",
    synopsis:
      "Medical courier Bryan races through Raccoon City during an outbreak of infected creatures, trying to complete an urgent delivery and survive.",
    formats: ["2D", "3D", "Director's Club"],
    poster: "https://en.wikipedia.org/wiki/Special:Redirect/file/Resident_Evil_2026_film_poster.png",
    tint: "#3c2738",
    sourceUrl: "https://en.wikipedia.org/wiki/Resident_Evil_(2026_film)",
  },
  {
    id: "avengers-encore",
    title: "Avengers: Endgame Encore",
    shortTitle: "Avengers: Endgame",
    status: "Advance booking",
    rating: "PG-13",
    duration: "3h 02m",
    genres: ["Action", "Adventure", "Sci-Fi"],
    director: "Anthony and Joe Russo",
    cast: "Robert Downey Jr., Chris Evans, Scarlett Johansson",
    synopsis:
      "The surviving Avengers and their allies attempt to reverse Thanos's actions after he erased half of all life in the universe.",
    formats: ["2D", "IMAX", "3D"],
    poster: "https://smcine-digital-cdn.app.vista.co/media/entity/get/FilmPosterGraphic/HO00001643?width=200",
    tint: "#573d33",
    sourceUrl: "https://en.wikipedia.org/wiki/Avengers:_Endgame",
    advanceBooking: true,
  },
  {
    id: "hunger-games",
    title: "The Hunger Games: Sunrise on the Reaping",
    shortTitle: "The Hunger Games: Sunrise on the Reaping",
    status: "Coming soon",
    rating: "TBD",
    duration: "Coming soon",
    genres: ["Action", "Drama", "Sci-Fi"],
    director: "Francis Lawrence",
    cast: "Joseph Zada, Whitney Peak, Mckenna Grace, Jesse Plemons",
    synopsis:
      "At the 50th Hunger Games, 16-year-old Haymitch Abernathy is chosen for a Quarter Quell where each district must send twice as many tributes.",
    formats: ["2D", "IMAX", "Director's Club"],
    poster: "https://en.wikipedia.org/wiki/Special:Redirect/file/The_Hunger_Games_-_Sunrise_on_the_Reaping_poster.jpg",
    tint: "#6f574c",
    sourceUrl: "https://en.wikipedia.org/wiki/The_Hunger_Games:_Sunrise_on_the_Reaping",
  },
  {
    id: "dune-three",
    title: "Dune: Part Three",
    shortTitle: "Dune: Part Three",
    status: "Advance booking",
    rating: "TBD",
    duration: "Coming soon",
    genres: ["Sci-Fi", "Adventure", "Drama"],
    director: "Denis Villeneuve",
    cast: "Timothée Chalamet, Zendaya, Jason Momoa, Florence Pugh",
    synopsis:
      "Years into Paul's rule as Emperor, an insurgency and a conspiracy threaten the Imperium and everyone he loves.",
    formats: ["2D", "IMAX", "Director's Club"],
    poster: "https://en.wikipedia.org/wiki/Special:Redirect/file/Dune_Part_Three_poster.jpg",
    tint: "#b9a27d",
    sourceUrl: "https://en.wikipedia.org/wiki/Dune:_Part_Three",
  },
  {
    id: "avengers-doomsday",
    title: "Avengers: Doomsday",
    shortTitle: "Avengers: Doomsday",
    status: "Advance booking",
    rating: "TBD",
    duration: "Coming soon",
    genres: ["Action", "Adventure", "Sci-Fi"],
    director: "Anthony and Joe Russo",
    cast: "Robert Downey Jr., Chris Evans, Chris Hemsworth, Pedro Pascal",
    synopsis:
      "As universes converge and begin to collapse, the Avengers unite with the Fantastic Four, Wakandans, New Avengers, and X-Men against Doctor Doom.",
    formats: ["2D", "IMAX", "Director's Club"],
    poster: "https://en.wikipedia.org/wiki/Special:Redirect/file/Avengers_Doomsday_poster.jpg",
    tint: "#233329",
    sourceUrl: "https://en.wikipedia.org/wiki/Avengers:_Doomsday",
  },
  {
    id: "runner",
    title: "Runner",
    shortTitle: "Runner",
    status: "Advance booking",
    rating: "15",
    duration: "1h 38m",
    genres: ["Action", "Comedy", "Thriller"],
    director: "Scott Waugh",
    cast: "Alan Ritchson, Owen Wilson, Rodrigo Santoro",
    synopsis:
      "A former Army Special Forces operative and a medical courier race to deliver a transplant liver to a sick girl while cartel pursuers close in.",
    formats: ["2D", "3D"],
    poster: "https://upload.wikimedia.org/wikipedia/en/c/c5/Runner_%282026_American_film%29_poster.jpg",
    tint: "#3f355a",
    sourceUrl: "https://en.wikipedia.org/wiki/Runner_(2026_American_film)",
  },
  {
    id: "forgotten-island",
    title: "Forgotten Island",
    shortTitle: "Forgotten Island",
    status: "Coming soon",
    rating: "TBD",
    duration: "Coming soon",
    genres: ["Animation", "Fantasy", "Adventure"],
    director: "Joel Crawford and Januel Mercado",
    cast: "H.E.R., Liza Soberano, Dave Franco, Lea Salonga",
    synopsis:
      "Best friends Jo and Raissa enter Nakali, a magical island from Filipino folklore, where strange creatures put their friendship and memories to the test.",
    formats: ["2D", "Director's Club"],
    poster: "https://en.wikipedia.org/wiki/Special:Redirect/file/Forgotten_Island_poster.jpeg",
    tint: "#53516a",
    sourceUrl: "https://en.wikipedia.org/wiki/Forgotten_Island",
  },
  {
    id: "digger",
    title: "Digger",
    shortTitle: "Digger",
    status: "Coming soon",
    rating: "TBD",
    duration: "Coming soon",
    genres: ["Comedy", "Drama"],
    director: "Alejandro G. Iñárritu",
    cast: "Tom Cruise, Riz Ahmed, John Goodman, Sandra Hüller",
    synopsis:
      "Oil magnate Digger Rockwell faces a disaster caused by his own company, mirrored by an actor playing Digger in a satirical stage production.",
    formats: ["2D", "IMAX"],
    poster: "https://en.wikipedia.org/wiki/Special:Redirect/file/Digger_(2026_film)_poster.jpg",
    tint: "#42505c",
    sourceUrl: "https://en.wikipedia.org/wiki/Digger_(2026_film)",
  },
  {
    id: "street-fighter",
    title: "Street Fighter",
    shortTitle: "Street Fighter",
    status: "Coming soon",
    rating: "TBD",
    duration: "Coming soon",
    genres: ["Action", "Martial Arts"],
    director: "Kitao Sakurai",
    cast: "Noah Centineo, Andrew Koji, Callina Liang, Jason Momoa",
    synopsis:
      "In 1993, estranged fighters Ryu and Ken are recruited by Chun-Li for the World Warrior Tournament, where they must face each other and their own demons.",
    formats: ["2D", "3D", "Director's Club"],
    poster: "https://en.wikipedia.org/wiki/Special:Redirect/file/Street_Fighter_2026_film_poster.jpeg",
    tint: "#9f4821",
    sourceUrl: "https://en.wikipedia.org/wiki/Street_Fighter_(2026_film)",
  },
  {
    id: "hexed",
    title: "Hexed",
    shortTitle: "Hexed",
    status: "Coming soon",
    rating: "TBD",
    duration: "Coming soon",
    genres: ["Animation", "Fantasy", "Comedy"],
    director: "Fawn Veerasunthorn and Jason Hand",
    cast: "Hailee Steinfeld, Rashida Jones, Jodie Foster, Walton Goggins",
    synopsis:
      "After discovering her magical abilities, teenager Billie is pulled from suburbia into Hexe, the realm of witches, with her cautious mother Alice.",
    formats: ["2D", "Director's Club"],
    poster: "https://en.wikipedia.org/wiki/Special:Redirect/file/Hexed_poster.jpg",
    tint: "#51406c",
    sourceUrl: "https://en.wikipedia.org/wiki/Hexed_(2026_film)",
  },
];

const tabs: MovieTab[] = ["Now showing", "Coming soon", "Advance booking"];
const featuredMovies = movies.filter((movie) => movie.status === "Now showing");
const screeningFormats = [
  {
    id: "2d",
    name: "2D",
    price: 380,
    showtimes: ["10:30 AM", "1:15 PM", "4:00 PM", "7:00 PM", "9:45 PM"],
    description: "Enjoy every story in a classic, comfortable cinema setting.",
    rows: 8,
    seatsPerRow: 12,
    layout: "standard",
  },
  {
    id: "3d",
    name: "3D",
    price: 410,
    showtimes: ["11:15 AM", "2:10 PM", "5:05 PM", "8:00 PM"],
    description: "Step into the action with immersive depth on the big screen.",
    badge: "3D glasses included · Immersive depth",
    rows: 8,
    seatsPerRow: 12,
    layout: "standard",
  },
  {
    id: "imax",
    name: "IMAX",
    price: 850,
    showtimes: ["12:00 PM", "3:30 PM", "7:15 PM", "10:30 PM"],
    description: "Experience a larger image and powerful sound in a wide auditorium.",
    rows: 12,
    seatsPerRow: 18,
    layout: "imax",
  },
  {
    id: "directors-club",
    name: "Director's Club",
    price: 550,
    showtimes: ["1:00 PM", "4:30 PM", "8:15 PM"],
    description: "Settle into an intimate VIP auditorium with spacious recliner seating.",
    rows: 5,
    seatsPerRow: 6,
    layout: "directors-club",
  },
] as const;
const screeningFormatDetails: Record<MovieFormat, (typeof screeningFormats)[number]> = {
  "2D": screeningFormats[0],
  "3D": screeningFormats[1],
  IMAX: screeningFormats[2],
  "Director's Club": screeningFormats[3],
};

function dateKey(date: Date) {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return localDate.toISOString().slice(0, 10);
}

function getOccupiedSeatIndexes(screeningKey: string, seatCount: number) {
  let seed = 2_166_136_261;
  for (let index = 0; index < screeningKey.length; index += 1) {
    seed = Math.imul(seed ^ screeningKey.charCodeAt(index), 16_777_619);
  }

  let value = seed >>> 0;
  const random = () => {
    value += 0x6d2b79f5;
    let result = value;
    result = Math.imul(result ^ (result >>> 15), result | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
    return ((result ^ (result >>> 14)) >>> 0) / 4_294_967_296;
  };

  const occupiedSeats = new Set<number>();
  for (let seatIndex = 0; seatIndex < seatCount; seatIndex += 1) {
    if (random() < 0.18) occupiedSeats.add(seatIndex);
  }
  return occupiedSeats;
}

function formatDate(value: string) {
  return new Date(`${value}T12:00:00`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function currency(value: number) {
  return new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(value);
}

function posterStyle(movie: Movie): PosterStyle {
  return {
    backgroundColor: movie.tint,
    backgroundImage: `linear-gradient(180deg, rgb(12 7 22 / 7%), rgb(12 7 22 / 20%)), url("${movie.poster}")`,
    "--poster-image": `url("${movie.poster}")`,
  };
}

export default function CinemaWorld() {
  const [activeTab, setActiveTab] = useState<MovieTab>("Now showing");
  const [heroMovieIndex, setHeroMovieIndex] = useState(0);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState<"selection" | "review" | "notice" | "confirmed">("selection");
  const [selectedFormat, setSelectedFormat] = useState<MovieFormat>("2D");
  const [selectedCinema, setSelectedCinema] = useState<CinemaBranch>("SM Mall of Asia");
  const [selectedDate, setSelectedDate] = useState(() => dateKey(new Date()));
  const [datePage, setDatePage] = useState(0);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>(emptyPaymentDetails);
  const [bookingError, setBookingError] = useState("");
  const [bookingBusy, setBookingBusy] = useState(false);
  const [bookingCode, setBookingCode] = useState("");
  const [ticketActionError, setTicketActionError] = useState("");
  const [ticketEmailStatus, setTicketEmailStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const ticketCardRef = useRef<HTMLDivElement | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [authBusy, setAuthBusy] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviewName, setReviewName] = useState("");
  const [reviewEmail, setReviewEmail] = useState("");
  const [reviewText, setReviewText] = useState("");

  const today = new Date();
  const dates = Array.from({ length: 10 }, (_, offset) => {
    const date = new Date(today);
    date.setDate(date.getDate() + offset);
    return date;
  });
  const calendarDayCount = Math.max(
    0,
    (Date.UTC(2026, 11, 31) - Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())) / 86_400_000 + 1,
  );
  const calendarDates = Array.from(
    { length: calendarDayCount },
    (_, offset) => new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset),
  );
  const datePageCount = Math.ceil(calendarDates.length / 7);
  const currentDatePage = Math.min(datePage, Math.max(0, datePageCount - 1));
  const visibleDates = calendarDates.slice(currentDatePage * 7, currentDatePage * 7 + 7);
  const firstVisibleDate = visibleDates[0] ?? today;
  const lastVisibleDate = visibleDates[visibleDates.length - 1] ?? today;
  const visibleDatesShareMonth = firstVisibleDate.getFullYear() === lastVisibleDate.getFullYear()
    && firstVisibleDate.getMonth() === lastVisibleDate.getMonth();
  const calendarMonthLabel = visibleDatesShareMonth
    ? firstVisibleDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : `${firstVisibleDate.toLocaleDateString("en-US", { month: "long" })} / ${lastVisibleDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}`;
  const todayKey = dateKey(today);
  const isComingSoonPreview = selectedMovie?.status === "Coming soon";
  const isDecemberAdvanceBooking = selectedMovie?.id === "avengers-doomsday" || selectedMovie?.id === "dune-three";
  const availableDateKeys = new Set(
    isComingSoonPreview
      ? []
      : isDecemberAdvanceBooking
        ? calendarDates.filter((date) => dateKey(date) >= "2026-12-16").map(dateKey)
        : selectedMovie?.status === "Advance booking"
          ? calendarDates
            .filter((date) => date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth())
            .map(dateKey)
          : dates.map(dateKey),
  );
  const visibleMovies = movies.filter((movie) => movie.status === activeTab);
  const featuredMovie = movies[0];
  const activeHeroMovie = featuredMovies[heroMovieIndex];
  const selectedFormatDetails = screeningFormatDetails[selectedFormat];
  const bookingSeatRows = Array.from({ length: selectedFormatDetails.rows }, (_, rowIndex) => String.fromCharCode(65 + rowIndex));
  const halfSeatCount = selectedFormatDetails.seatsPerRow / 2;
  const seatGridTemplateColumns = selectedFormatDetails.layout === "directors-club"
    ? "repeat(2, minmax(0, 1fr)) minmax(12px, 1.5fr) repeat(2, minmax(0, 1fr)) minmax(12px, 1.5fr) repeat(2, minmax(0, 1fr))"
    : `repeat(${halfSeatCount}, minmax(0, 1fr)) minmax(${selectedFormatDetails.layout === "imax" ? 20 : 16}px, 1.3fr) repeat(${halfSeatCount}, minmax(0, 1fr))`;
  const occupiedSeatIndexes = selectedMovie
    ? getOccupiedSeatIndexes(
      `${selectedCinema}|${selectedMovie.id}|${selectedDate}|${selectedFormat}|${selectedTime}`,
      selectedFormatDetails.rows * selectedFormatDetails.seatsPerRow,
    )
    : new Set<number>();
  const hasPaymentDetails = selectedPaymentMethod === "Credit / Debit Card"
    ? Boolean(paymentDetails.cardholderName.trim() && paymentDetails.cardNumber.trim() && paymentDetails.expiry.trim() && paymentDetails.cvv.trim())
    : Boolean(selectedPaymentMethod && paymentDetails.reference.trim());
  const isCheckoutReady = Boolean(
    selectedSeats.length
      && contactName.trim()
      && contactEmail.trim()
      && contactNumber.trim()
      && selectedPaymentMethod
      && hasPaymentDetails,
  );
  const bookingStepNumber = bookingStep === "selection" ? 1 : bookingStep === "review" ? 2 : 3;

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setHeroMovieIndex((index) => (index + 1) % featuredMovies.length);
    }, 4000);
    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (!supabase) return;
    let isActive = true;
    void supabase.auth.getSession().then(({ data }) => {
      if (isActive) setUserEmail(data.session?.user.email ?? null);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user.email ?? null);
    });
    return () => {
      isActive = false;
      data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!bookingOpen && !authOpen && !selectedMovie && !reviewOpen) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setBookingOpen(false);
        setAuthOpen(false);
        setSelectedMovie(null);
        setReviewOpen(false);
        setReviewSubmitted(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [authOpen, bookingOpen, reviewOpen, selectedMovie]);

  useEffect(() => {
    if (!reviewOpen || !reviewSubmitted) return;
    const timeoutId = window.setTimeout(() => {
      setReviewOpen(false);
      setReviewSubmitted(false);
    }, 2200);
    return () => window.clearTimeout(timeoutId);
  }, [reviewOpen, reviewSubmitted]);

  function openReview() {
    setReviewName("");
    setReviewEmail("");
    setReviewText("");
    setReviewSubmitted(false);
    setReviewOpen(true);
  }

  function closeReview() {
    setReviewOpen(false);
    setReviewSubmitted(false);
  }

  function submitReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setReviewName("");
    setReviewEmail("");
    setReviewText("");
    setReviewSubmitted(true);
  }

  function openMovie(movie: Movie) {
    setSelectedMovie(movie);
    setBookingOpen(false);
  }

  function openBooking(movie: Movie) {
    setSelectedMovie(movie);
    setSelectedCinema("SM Mall of Asia");
    if (movie.id === "avengers-doomsday" || movie.id === "dune-three") {
      const releaseDate = "2026-12-16";
      const releaseDateIndex = calendarDates.findIndex((date) => dateKey(date) === releaseDate);
      setSelectedDate(releaseDate);
      setDatePage(Math.max(0, Math.floor(releaseDateIndex / 7)));
    } else {
      setSelectedDate(dateKey(new Date()));
      setDatePage(0);
    }
    setSelectedFormat(movie.formats[0]);
    setSelectedTime(screeningFormatDetails[movie.formats[0]].showtimes[0]);
    setSelectedSeats([]);
    setContactName("");
    setContactEmail(userEmail ?? "");
    setContactNumber("");
    setSelectedPaymentMethod(null);
    setPaymentDetails(emptyPaymentDetails);
    setBookingError("");
    setBookingCode("");
    setTicketActionError("");
    setTicketEmailStatus("idle");
    setBookingStep("selection");
    setBookingOpen(true);
  }

  function chooseBookingFormat(format: MovieFormat) {
    if (format === selectedFormat) return;
    setSelectedFormat(format);
    setSelectedTime(screeningFormatDetails[format].showtimes[0]);
    setSelectedSeats([]);
  }

  function toggleSeat(seat: string) {
    setSelectedSeats((current) =>
      current.includes(seat) ? current.filter((item) => item !== seat) : [...current, seat].sort(),
    );
  }

  function choosePaymentMethod(method: PaymentMethod) {
    if (method === selectedPaymentMethod) return;
    setSelectedPaymentMethod(method);
    setPaymentDetails(emptyPaymentDetails);
  }

  function continueToReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBookingError("");
    if (!isCheckoutReady) {
      setBookingError("Enter your guest details, choose a payment method, and complete its required payment details.");
      return;
    }
    setBookingStep("review");
  }

  async function confirmBooking() {
    if (!selectedMovie || !isCheckoutReady) {
      setBookingError("Complete all required guest and payment details before confirming your booking.");
      return;
    }
    setBookingBusy(true);
    setBookingError("");

    if (supabase) {
      const { data } = await supabase.auth.getUser();
      const { error } = await supabase.from("bookings").insert({
        user_id: data.user?.id ?? null,
        movie_title: selectedMovie.title,
        show_date: selectedDate,
        show_time: selectedTime,
        seats: selectedSeats,
        contact_name: contactName,
        contact_email: contactEmail,
        total_amount: selectedSeats.length * selectedFormatDetails.price,
      });
      if (error) {
        setBookingBusy(false);
        setBookingError("We couldn't save this booking. Please check your connection and try again.");
        return;
      }
    }

    const referenceNumber = Math.floor(1000 + Math.random() * 9000);
    setBookingCode(`CW-${selectedDate.slice(0, 4)}-${referenceNumber}`);
    setBookingBusy(false);
    setBookingStep("confirmed");
  }

  function downloadETicket() {
    setTicketActionError("");
    if (!selectedMovie || !selectedPaymentMethod || !bookingCode) {
      setTicketActionError("Your e-ticket is not ready to download yet.");
      return;
    }

    const qrSvg = ticketCardRef.current?.querySelector("svg");
    if (!qrSvg) {
      setTicketActionError("The ticket QR code could not be found.");
      return;
    }

    const qrSvgCopy = qrSvg.cloneNode(true) as SVGSVGElement;
    qrSvgCopy.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    qrSvgCopy.setAttribute("width", "640");
    qrSvgCopy.setAttribute("height", "640");
    const qrUrl = URL.createObjectURL(
      new Blob([new XMLSerializer().serializeToString(qrSvgCopy)], { type: "image/svg+xml;charset=utf-8" }),
    );
    const qrImage = new Image();
    qrImage.onload = () => {
      URL.revokeObjectURL(qrUrl);

      const canvas = document.createElement("canvas");
      canvas.width = 1800;
      canvas.height = 1125;
      const context = canvas.getContext("2d");
      if (!context) {
        setTicketActionError("Your browser could not create the ticket image.");
        return;
      }

      const background = context.createLinearGradient(0, 0, canvas.width, canvas.height);
      background.addColorStop(0, "#10091c");
      background.addColorStop(0.55, "#241337");
      background.addColorStop(1, "#130b22");
      context.fillStyle = background;
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.strokeStyle = "rgba(224, 160, 255, 0.6)";
      context.lineWidth = 3;
      context.strokeRect(28, 28, canvas.width - 56, canvas.height - 56);

      context.fillStyle = "#f6eafa";
      context.font = "700 54px Arial, sans-serif";
      context.fillText("CINEMAWORLD", 90, 118);
      context.fillStyle = "#cbb4df";
      context.font = "600 21px Arial, sans-serif";
      context.fillText("DIGITAL E-TICKET  ·  ADMISSION PASS", 92, 162);
      context.strokeStyle = "rgba(222, 171, 255, 0.25)";
      context.lineWidth = 2;
      context.beginPath();
      context.moveTo(90, 198);
      context.lineTo(1710, 198);
      context.stroke();

      const drawField = (label: string, value: string, x: number, y: number, maxWidth = 500) => {
        context.fillStyle = "#b9a7ce";
        context.font = "700 18px Arial, sans-serif";
        context.fillText(label.toUpperCase(), x, y);
        context.fillStyle = "#f6f0fb";
        context.font = "600 28px Arial, sans-serif";
        context.fillText(value, x, y + 40, maxWidth);
      };

      drawField("Movie", selectedMovie.title, 90, 255, 1080);
      drawField("Cinema branch", selectedCinema, 90, 390);
      drawField("Format", selectedFormat, 610, 390);
      drawField("Date", formatDate(selectedDate), 90, 500);
      drawField("Showtime", selectedTime, 610, 500);
      drawField("Seats", selectedSeats.join(", "), 90, 610);
      drawField("Guest name", contactName, 610, 610);
      drawField("Email", contactEmail, 90, 720);
      drawField("Contact", contactNumber, 610, 720);
      drawField("Payment method", selectedPaymentMethod, 90, 830);
      drawField("Total price", currency(selectedSeats.length * selectedFormatDetails.price), 610, 830);

      context.fillStyle = "rgba(255, 255, 255, 0.96)";
      context.fillRect(1280, 265, 380, 380);
      context.drawImage(qrImage, 1292, 277, 356, 356);
      context.textAlign = "center";
      context.fillStyle = "#d9c7eb";
      context.font = "700 19px Arial, sans-serif";
      context.fillText("SCAN AT ENTRY", 1470, 700);
      context.fillStyle = "#f0d7f0";
      context.font = "700 24px Arial, sans-serif";
      context.fillText(bookingCode, 1470, 748);
      context.textAlign = "left";

      context.strokeStyle = "rgba(222, 171, 255, 0.25)";
      context.beginPath();
      context.moveTo(90, 950);
      context.lineTo(1710, 950);
      context.stroke();
      context.fillStyle = "#cbb4df";
      context.font = "700 18px Arial, sans-serif";
      context.fillText("BOOKING REFERENCE", 90, 1000);
      context.fillStyle = "#f3afea";
      context.font = "700 32px Arial, sans-serif";
      context.fillText(bookingCode, 90, 1050);

      canvas.toBlob((ticketBlob) => {
        if (!ticketBlob) {
          setTicketActionError("Your browser could not export the ticket image.");
          return;
        }
        const downloadUrl = URL.createObjectURL(ticketBlob);
        const downloadLink = document.createElement("a");
        downloadLink.href = downloadUrl;
        downloadLink.download = `CinemaWorld-Ticket-${bookingCode}.png`;
        document.body.append(downloadLink);
        downloadLink.click();
        downloadLink.remove();
        window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
      }, "image/png");
    };
    qrImage.onerror = () => {
      URL.revokeObjectURL(qrUrl);
      setTicketActionError("The ticket QR code could not be added to the image.");
    };
    qrImage.src = qrUrl;
  }

  async function sendTicketEmail() {
    setTicketActionError("");
    if (!selectedMovie || !selectedPaymentMethod || !bookingCode || !isCheckoutReady) {
      setTicketEmailStatus("error");
      setTicketActionError("The booking details are incomplete, so the email could not be sent.");
      return;
    }

    setTicketEmailStatus("sending");
    await new Promise((resolve) => window.setTimeout(resolve, 650));
    setTicketEmailStatus("sent");
  }

  async function sendSignInLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAuthMessage("");
    if (!supabase) {
      setAuthMessage("Add your Supabase URL and anon key to .env.local to enable email sign-in.");
      return;
    }
    setAuthBusy(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: authEmail,
      options: { emailRedirectTo: window.location.origin },
    });
    setAuthBusy(false);
    setAuthMessage(error ? error.message : "Your sign-in link is on its way. Check your email.");
  }

  async function signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
  }

  const cinemaSelector = (
    <div className="form-section">
      <label className="form-label" htmlFor="booking-cinema"><MapPin size={13} /> Select cinema</label>
      <div className="cinema-select-wrap">
        <select
          className="cinema-select"
          id="booking-cinema"
          value={selectedCinema}
          onChange={(event) => {
            const branch = cinemaBranches.find((option) => option.name === event.currentTarget.value);
            if (branch && branch.name !== selectedCinema) {
              setSelectedCinema(branch.name);
              setSelectedSeats([]);
            }
          }}
        >
          {cinemaBranches.map((branch) => <option key={branch.name} value={branch.name}>{branch.name}</option>)}
        </select>
        <ChevronDown className="cinema-select-chevron" size={15} aria-hidden="true" />
      </div>
    </div>
  );
  const activeTabId = `tab-${activeTab.toLowerCase().replaceAll(" ", "-")}`;

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand" href="#home" aria-label="CinemaWorld home">
          <span className="brand-mark"><Clapperboard size={19} strokeWidth={1.7} /></span>
          <span>CinemaWorld</span>
        </a>
        <nav className="main-nav" aria-label="Main navigation">
          <a href="#movies" onClick={() => setActiveTab("Now showing")}>Now showing</a>
          <a href="#movies" onClick={() => setActiveTab("Coming soon")}>Coming soon</a>
          <a href="#movies" onClick={() => setActiveTab("Advance booking")}>Advance booking</a>
        </nav>
        <div className="header-actions">
          <span className="header-location"><MapPin size={13} /> Manila, PH</span>
          {userEmail ? (
            <button className="text-button" type="button" onClick={() => void signOut()} title={`Sign out ${userEmail}`}>
              <UserRound size={15} /> Sign out
            </button>
          ) : (
            <button className="text-button" type="button" onClick={() => { setAuthOpen(true); setAuthMessage(""); }}>
              <UserRound size={15} /> Sign in
            </button>
          )}
        </div>
      </header>

      <main>
        <section className="hero" id="home" aria-labelledby="hero-title">
          <div className="hero-trailer" aria-hidden="true">
            <iframe
              src="https://www.youtube.com/embed/8TZMtslA3UY?autoplay=1&mute=1&controls=0&loop=1&playlist=8TZMtslA3UY&modestbranding=1&rel=0"
              title="Spider-Man: Brand New Day official trailer"
              allow="autoplay; encrypted-media"
              tabIndex={-1}
            />
          </div>
          <div className="hero-copy">
            <h1 className="hero-title" id="hero-title"><span>Cherish Movie Moments With Friends and Family!</span></h1>
            <p className="hero-description">We'll take care of everything else right here at CinemaWorld!</p>
            <div className="hero-ctas">
              <a className="primary-button" href="#movies">Explore movies <ArrowRight /></a>
            </div>
            <div className="hero-note"><ShieldCheck size={14} /> Secure checkout · Mobile tickets accepted</div>
          </div>
          <div className="hero-art" aria-label={`Featured film: ${activeHeroMovie.title}`}>
            <span className="orbit-dot orbit-dot-one" />
            <span className="orbit-dot orbit-dot-two" />
            <span className="orbit-dot orbit-dot-three" />
            <div className="hero-poster" key={activeHeroMovie.id} style={posterStyle(activeHeroMovie)}>
              <div className="hero-poster-content">
                <span className="poster-kicker"><Film size={11} /> Featured film</span>
                <h2>{activeHeroMovie.shortTitle}</h2>
                <p>Only in cinemas · {activeHeroMovie.status}</p>
              </div>
            </div>
            <div className="hero-label">Top Trending Movie</div>
          </div>
        </section>

        <section className="movie-section" id="movies" aria-labelledby="movies-heading">
          <div className="section-topline">
            <div>
              <h2 className="section-heading" id="movies-heading">Movies</h2>
              <p className="section-description">All the movies we currently offer just for you!</p>
            </div>
            <div className="catalog-controls">
              <div className="catalog-tabs" role="tablist" aria-label="Movie categories">
                {tabs.map((tab) => {
                  const tabId = `tab-${tab.toLowerCase().replaceAll(" ", "-")}`;
                  return (
                    <button className="catalog-tab" id={tabId} key={tab} type="button" role="tab" aria-selected={activeTab === tab} onClick={() => setActiveTab(tab)}>
                      {tab}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="movie-grid" role="tabpanel" aria-labelledby={activeTabId}>
            {visibleMovies.map((movie) => (
              <button className="movie-card" key={movie.id} type="button" onClick={() => openMovie(movie)}>
                <span className={`movie-poster${movie.monochrome ? " movie-poster--monochrome" : ""}`} style={posterStyle(movie)}>
                  <span className="movie-poster-top">
                    <span className="movie-rating"><Star size={10} fill="currentColor" /> {movie.rating}</span>
                    <span className="movie-status">{movie.status === "Now showing" ? "In cinemas" : movie.status === "Advance booking" ? "Book ahead" : "Coming soon"}</span>
                  </span>
                  <span className="movie-poster-copy"><small>{movie.genres.slice(0, 2).join(" · ")}</small><strong>{movie.shortTitle}</strong></span>
                </span>
                <span className="movie-info">
                  <span className="movie-copy"><h3>{movie.title}</h3><p>{movie.duration} <span aria-hidden="true">·</span> {movie.formats[0]}</p></span>
                  <ArrowUpRight className="movie-arrow" size={15} aria-hidden="true" />
                </span>
              </button>
            ))}
          </div>

          <div className="catalog-footer">
            <span>{visibleMovies.length} films · Updated weekly</span>
          </div>
        </section>

      </main>

      <footer className="site-footer">
        <span className="footer-brand"><img src="." /> CinemaWorld</span>
        <span>© 2026 CinemaWorld Cinemas</span>
      </footer>

      {selectedMovie && !bookingOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedMovie(null); }}>
          <section className="dialog" role="dialog" aria-modal="true" aria-labelledby="movie-dialog-title">
            <div className="dialog-top">
              <div><p className="section-kicker">{selectedMovie.status}</p><h2 id="movie-dialog-title">Movie details</h2></div>
              <button className="icon-button" type="button" aria-label="Close movie details" onClick={() => setSelectedMovie(null)}><X size={17} /></button>
            </div>
            <div className="dialog-body movie-dialog-content">
              <div className={`detail-poster${selectedMovie.monochrome ? " detail-poster--monochrome" : ""}`} style={posterStyle(selectedMovie)}><span>{selectedMovie.shortTitle}</span></div>
              <div className="detail-copy">
                <div className="detail-meta"><span>{selectedMovie.rating}</span><span>{selectedMovie.duration}</span>{selectedMovie.genres.map((genre) => <span key={genre}>{genre}</span>)}</div>
                <p>{selectedMovie.synopsis}</p>
                <p className="detail-credit"><span className="notice-emphasis">Director:</span> {selectedMovie.director}</p>
                <p className="detail-credit"><span className="notice-emphasis">Cast:</span> {selectedMovie.cast}</p>
                <a className="detail-source" href={selectedMovie.sourceUrl} target="_blank" rel="noreferrer">
                  Film details &amp; poster source <ArrowUpRight size={12} />
                </a>
                <div className="format-strip detail-formats">{selectedMovie.formats.map((format) => <span className="format-chip" key={format}>{format}</span>)}</div>
                <button className="primary-button" type="button" onClick={() => openBooking(selectedMovie)}>
                  {selectedMovie.status === "Coming soon" ? <Film size={15} /> : <Ticket size={15} />}
                  {selectedMovie.status === "Coming soon" ? "View screening formats" : "Buy a ticket"}
                </button>
              </div>
            </div>
          </section>
        </div>
      )}

      {bookingOpen && selectedMovie && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) { setBookingOpen(false); setSelectedMovie(null); } }}>
          <section className="dialog" role="dialog" aria-modal="true" aria-labelledby="booking-dialog-title">
            <div className="dialog-top">
              <div>
                <p className="section-kicker">{bookingStep === "confirmed" ? "Your mobile pass" : bookingStep === "notice" ? "Before the show" : selectedMovie.title}</p>
                <h2 id="booking-dialog-title">{isComingSoonPreview ? "Coming Soon" : bookingStep === "confirmed" ? "Digital ticket" : bookingStep === "notice" ? "A little heads-up" : "Book your seats"}</h2>
                {bookingStep !== "confirmed" && !isComingSoonPreview && <div className="booking-progress" aria-label={`Step ${bookingStepNumber} of 3`}>
                  <span className={`progress-step ${bookingStepNumber === 1 ? "is-active" : "is-done"}`}><span className="progress-dot">{bookingStepNumber > 1 ? <Check size={10} /> : "1"}</span> Choose cinema &amp; seats</span>
                  <span className="progress-line" />
                  <span className={`progress-step ${bookingStepNumber === 2 ? "is-active" : bookingStepNumber > 2 ? "is-done" : ""}`}><span className="progress-dot">{bookingStepNumber > 2 ? <Check size={10} /> : "2"}</span> Review</span>
                  <span className="progress-line" />
                  <span className={`progress-step ${bookingStepNumber === 3 ? "is-active" : ""}`}><span className="progress-dot">3</span> Heads up</span>
                </div>}
              </div>
              <button className="icon-button" type="button" aria-label="Close booking" onClick={() => { setBookingOpen(false); setSelectedMovie(null); }}><X size={17} /></button>
            </div>

            <div className="dialog-body">
              {isComingSoonPreview ? (
                <div className="coming-soon-preview">
                  {cinemaSelector}
                  <div className="coming-soon-banner" role="status">
                    <strong>Coming Soon to CinemaWorld</strong>
                    <span>Screening schedules are not yet available.</span>
                  </div>
                  <div className="form-section">
                    <div className="form-label"><Film size={13} /> Available screening formats</div>
                    <div className="booking-format-grid" aria-label="Available screening formats">
                      {selectedMovie.formats.map((format) => (
                        <div className="booking-format-option booking-format-option--preview" key={format}>
                          <span>{format}</span>
                          <strong>₱{screeningFormatDetails[format].price}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : bookingStep === "confirmed" ? (
                <div className="ticket-confirmation-content">
                  <div className="digital-ticket" ref={ticketCardRef}>
                    <div className="digital-ticket-main">
                      <div className="digital-ticket-copy">
                        <p className="section-kicker">CinemaWorld · Admit {selectedSeats.length}</p>
                        <h3>{selectedMovie.title}</h3>
                        <p className="digital-ticket-format">{selectedFormat} · Cinema admission</p>
                        <div className="digital-ticket-details">
                          <div><span>CINEMA</span><strong>{selectedCinema}</strong></div>
                          <div><span>MOVIE</span><strong>{selectedMovie.title}</strong></div>
                          <div><span>FORMAT</span><strong>{selectedFormat}</strong></div>
                          <div><span>DATE</span><strong>{formatDate(selectedDate)}</strong></div>
                          <div><span>SHOWTIME</span><strong>{selectedTime}</strong></div>
                          <div><span>SEATS</span><strong>{selectedSeats.join(", ")}</strong></div>
                          <div><span>GUEST NAME</span><strong>{contactName}</strong></div>
                          <div><span>EMAIL</span><strong>{contactEmail}</strong></div>
                          <div><span>CONTACT</span><strong>{contactNumber}</strong></div>
                          <div><span>PAYMENT METHOD</span><strong>{selectedPaymentMethod}</strong></div>
                          <div><span>TOTAL PRICE</span><strong>{currency(selectedSeats.length * selectedFormatDetails.price)}</strong></div>
                        </div>
                      </div>
                      <div className="digital-ticket-qr">
                        <QRCodeSVG
                          value={JSON.stringify({ cinema: "CinemaWorld", branch: selectedCinema, code: bookingCode, movie: selectedMovie.title, date: selectedDate, time: selectedTime, seats: selectedSeats, paymentMethod: selectedPaymentMethod, total: selectedSeats.length * selectedFormatDetails.price })}
                          size={112}
                          level="M"
                          aria-label={`Ticket QR code ${bookingCode}`}
                        />
                        <span>SCAN AT ENTRY</span>
                      </div>
                    </div>
                    <div className="digital-ticket-footer"><span>BOOKING REFERENCE</span><strong>{bookingCode}</strong><span>Confirmation sent to {contactEmail}</span></div>
                  </div>
                  {ticketActionError && <p className="error-message ticket-action-error" role="alert">{ticketActionError}</p>}
                  <div className="dialog-actions ticket-action-bar">
                    <button className="ticket-secondary-button" type="button" onClick={downloadETicket}><Download size={15} /> Download E-Ticket</button>
                    <button
                      className={`ticket-secondary-button ticket-email-button${ticketEmailStatus === "sent" ? " is-success" : ticketEmailStatus === "error" ? " is-error" : ""}`}
                      type="button"
                      disabled={ticketEmailStatus === "sending" || ticketEmailStatus === "sent"}
                      aria-busy={ticketEmailStatus === "sending"}
                      onClick={() => void sendTicketEmail()}
                    >
                      <Mail size={15} />
                      {ticketEmailStatus === "sending" ? "Sending..." : ticketEmailStatus === "sent" ? "Email Sent!" : ticketEmailStatus === "error" ? "Retry Email" : "Send me an Email"}
                    </button>
                    <button className="primary-button" type="button" onClick={() => { setBookingOpen(false); setSelectedMovie(null); }}>Done</button>
                  </div>
                </div>
              ) : bookingStep === "selection" ? (
                <form onSubmit={continueToReview}>
                  {cinemaSelector}
                  <div className="form-section">
                    <div className="form-label"><CalendarDays size={13} /> Choose a day</div>
                    <div className="calendar-month">{calendarMonthLabel}</div>
                    <div className="date-carousel">
                      <button className="date-nav" type="button" aria-label="Previous dates" disabled={currentDatePage === 0} onClick={() => setDatePage(currentDatePage - 1)}><ArrowLeft size={15} /></button>
                      <div className="date-grid">{visibleDates.map((date) => {
                        const key = dateKey(date);
                        const unavailable = key < todayKey || !availableDateKeys.has(key);
                        return <button className="date-option" type="button" key={key} aria-label={date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })} aria-pressed={selectedDate === key} disabled={unavailable} onClick={() => {
                          if (selectedDate !== key) {
                            setSelectedDate(key);
                            setSelectedSeats([]);
                          }
                        }}>
                          <span>{key === todayKey ? "Today" : date.toLocaleDateString("en-US", { weekday: "short" })}</span>
                          <strong>{date.getDate()}</strong>
                        </button>;
                      })}</div>
                      <button className="date-nav" type="button" aria-label="Next dates" disabled={currentDatePage >= datePageCount - 1} onClick={() => setDatePage(currentDatePage + 1)}><ArrowRight size={15} /></button>
                    </div>
                  </div>
                  <div className="form-section">
                    <div className="form-label"><Film size={13} /> Select format</div>
                    <div className="booking-format-grid" role="group" aria-label="Available screening formats">
                      {selectedMovie.formats.map((format) => (
                        <button className={`booking-format-option${selectedFormat === format ? " is-active" : ""}`} type="button" key={format} aria-pressed={selectedFormat === format} onClick={() => chooseBookingFormat(format)}>
                          <span>{format}</span>
                          <strong>₱{screeningFormatDetails[format].price}</strong>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="form-section">
                    <div className="form-label"><Clock3 size={13} /> Show time</div>
                    <div className="time-row">{selectedFormatDetails.showtimes.map((time) => <button className="time-option" type="button" key={time} aria-pressed={selectedTime === time} onClick={() => {
                      if (selectedTime !== time) {
                        setSelectedTime(time);
                        setSelectedSeats([]);
                      }
                    }}>{time}</button>)}</div>
                  </div>
                  <div className="form-section">
                    <div className="form-label">Select your seats</div>
                    <div className={`screen-layout screen-layout--${selectedFormatDetails.layout}`}><div className="screen-glow" /><div className="screen-label">Screen</div></div>
                    <div className={`seat-grid seat-grid--${selectedFormatDetails.layout}`} style={{ gridTemplateColumns: seatGridTemplateColumns }} aria-label={`${selectedFormat} seat selection`}>{bookingSeatRows.flatMap((row, rowIndex) =>
                      Array.from({ length: selectedFormatDetails.seatsPerRow }, (_, seatIndex) => {
                        const seat = `${row}${seatIndex + 1}`;
                        const seatNumber = rowIndex * selectedFormatDetails.seatsPerRow + seatIndex;
                        const unavailable = occupiedSeatIndexes.has(seatNumber);
                        const seatColumn = selectedFormatDetails.layout === "directors-club"
                          ? seatIndex + Math.floor(seatIndex / 2) + 1
                          : seatIndex < halfSeatCount ? seatIndex + 1 : seatIndex + 2;
                        return <button className="seat" style={{ gridColumn: seatColumn }} type="button" key={seat} aria-label={`Seat ${seat}${unavailable ? ", occupied" : ""}`} aria-pressed={selectedSeats.includes(seat)} disabled={unavailable} onClick={() => toggleSeat(seat)}>{seat}</button>;
                      }),
                    )}</div>
                    <div className="seat-legend"><span><i className="legend-swatch" /> Available</span><span><i className="legend-swatch selected" /> Selected</span><span className="occupied-label"><i className="legend-swatch occupied" /> Occupied</span></div>
                  </div>
                  <div className="contact-fields">
                    <label><span className="field-label">Full Name</span><input className="text-field" type="text" autoComplete="name" required value={contactName} onChange={(event) => setContactName(event.target.value)} placeholder="Juan Dela Cruz" /></label>
                    <label><span className="field-label">Email Address</span><input className="text-field" autoComplete="email" type="email" required value={contactEmail} onChange={(event) => setContactEmail(event.target.value)} placeholder="juan@example.com" /></label>
                    <label><span className="field-label">Contact Number</span><input className="text-field" autoComplete="tel" type="tel" required value={contactNumber} onChange={(event) => setContactNumber(event.target.value)} placeholder="0917 123 4567" /></label>
                  </div>
                  <div className="form-section payment-section">
                    <div className="form-label">Select payment method</div>
                    <div className="payment-method-grid" role="radiogroup" aria-label="Select payment method">
                      {paymentMethods.map((method) => (
                        <button
                          className={`payment-method-option${selectedPaymentMethod === method ? " is-active" : ""}`}
                          type="button"
                          key={method}
                          role="radio"
                          aria-checked={selectedPaymentMethod === method}
                          onClick={() => choosePaymentMethod(method)}
                        >
                          {method}
                        </button>
                      ))}
                    </div>
                    {selectedPaymentMethod && (
                      <div className="payment-panel">
                        {selectedPaymentMethod === "Credit / Debit Card" ? (
                          <div className="payment-card-fields">
                            <label><span className="field-label">Cardholder Name</span><input className="text-field" autoComplete="cc-name" required value={paymentDetails.cardholderName} onChange={(event) => setPaymentDetails((current) => ({ ...current, cardholderName: event.target.value }))} placeholder="Juan Dela Cruz" /></label>
                            <label><span className="field-label">Card Number</span><input className="text-field" type="text" inputMode="numeric" autoComplete="cc-number" required value={paymentDetails.cardNumber} onChange={(event) => setPaymentDetails((current) => ({ ...current, cardNumber: event.target.value }))} placeholder="4532 •••• •••• 8891" /></label>
                            <label><span className="field-label">Expiry</span><input className="text-field" type="text" inputMode="numeric" autoComplete="cc-exp" required value={paymentDetails.expiry} onChange={(event) => setPaymentDetails((current) => ({ ...current, expiry: event.target.value }))} placeholder="12/28" /></label>
                            <label><span className="field-label">CVV</span><input className="text-field" type="text" inputMode="numeric" autoComplete="cc-csc" maxLength={4} required value={paymentDetails.cvv} onChange={(event) => setPaymentDetails((current) => ({ ...current, cvv: event.target.value }))} placeholder="123" /></label>
                          </div>
                        ) : (
                          <>
                            <div className="merchant-info">
                              {selectedPaymentMethod === "GCash" ? (
                                <>
                                  <p><span>Account Name</span><strong>CinemaWorld Philippines</strong></p>
                                  <p><span>GCash Number</span><strong>0917 842 9910</strong></p>
                                </>
                              ) : selectedPaymentMethod === "Maya" ? (
                                <>
                                  <p><span>Account Name</span><strong>CinemaWorld Philippines</strong></p>
                                  <p><span>Maya Number</span><strong>0918 553 7420</strong></p>
                                </>
                              ) : (
                                <>
                                  <p><span>Bank</span><strong>BDO / BPI</strong></p>
                                  <p><span>Account Name</span><strong>CinemaWorld Cinemas Inc.</strong></p>
                                  <p><span>Account No.</span><strong>0048-9210-4482</strong></p>
                                </>
                              )}
                            </div>
                            <label className="payment-reference-field">
                              <span className="field-label">{selectedPaymentMethod === "Bank Transfer" ? "Sender Account Name / Reference No." : `${selectedPaymentMethod} Mobile Number / Reference No.`}</span>
                              <input className="text-field" type={selectedPaymentMethod === "Bank Transfer" ? "text" : "tel"} required value={paymentDetails.reference} onChange={(event) => setPaymentDetails((current) => ({ ...current, reference: event.target.value }))} placeholder={selectedPaymentMethod === "Bank Transfer" ? "Sender account name or reference number" : "09XX XXX XXXX"} />
                            </label>
                          </>
                        )}
                      </div>
                    )}
                    <div className="payment-reassurance"><ShieldCheck size={16} aria-hidden="true" /><span>Simulated online payment gateway for presentation purposes — your e-ticket will be generated upon confirmation.</span></div>
                  </div>
                  <div className="dialog-actions">
                    <span className="summary-row"><span>{selectedSeats.length} selected</span><strong>{currency(selectedSeats.length * selectedFormatDetails.price)}</strong></span>
                    <button className="primary-button" type="submit" disabled={!isCheckoutReady}>Review booking <ArrowRight size={15} /></button>
                  </div>
                </form>
              ) : bookingStep === "notice" ? (
                <div className="heads-up-popup">
                  <div className="heads-up-intro"><span className="heads-up-icon"><Info size={17} /></span><p>Thank you for choosing CinemaWorld. Review these important details before your ticket is issued.</p></div>
                  <ul className="heads-up-list">
                    <li><Check size={14} /> Confirm your cinema, movie, format, date, time, seats, and payment method are correct.</li>
                    <li><Ticket size={14} /> Tickets are non-refundable unless the show is cancelled or rescheduled.</li>
                    <li><Clock3 size={14} /> Arrive at least 15 minutes before showtime and scan your ticket at entry.</li>
                    <li><Info size={14} /> Your booking confirmation will be sent to {contactEmail}.</li>
                    <li><Info size={14} /> Outside food and drinks are not allowed in the cinema.</li>
                    <li><Info size={14} /> Latecomers may not be admitted after the movie has started.</li>
                  </ul>
                  {bookingError && <p className="error-message" role="alert">{bookingError}</p>}
                  <div className="dialog-actions">
                    <button className="quiet-button" type="button" onClick={() => { setBookingError(""); setBookingStep("review"); }}><ArrowLeft size={14} /> Back to review</button>
                    <button className="primary-button" type="button" disabled={!isCheckoutReady || bookingBusy} onClick={() => void confirmBooking()}>{bookingBusy ? "Processing..." : "Confirm Booking / Pay Now"} {!bookingBusy && <Ticket size={15} />}</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="booking-summary">
                    <div className="summary-row"><span>Movie</span><strong>{selectedMovie.title}</strong></div>
                    <div className="summary-row"><span>Cinema</span><strong>{selectedCinema}</strong></div>
                    <div className="summary-row"><span>Screening format</span><strong>{selectedFormat} · {currency(selectedFormatDetails.price)} / ticket</strong></div>
                    <div className="summary-row"><span>Date</span><strong>{formatDate(selectedDate)}</strong></div>
                    <div className="summary-row"><span>Showtime</span><strong>{selectedTime}</strong></div>
                    <div className="summary-row"><span>Seats</span><strong>{selectedSeats.join(", ")}</strong></div>
                    <div className="summary-row"><span>Full name</span><strong>{contactName}</strong></div>
                    <div className="summary-row"><span>Email address</span><strong>{contactEmail}</strong></div>
                    <div className="summary-row"><span>Contact number</span><strong>{contactNumber}</strong></div>
                    <div className="summary-row"><span>Payment method</span><strong>{selectedPaymentMethod}</strong></div>
                    <div className="summary-row total"><span>Total · {selectedSeats.length} {selectedSeats.length === 1 ? "ticket" : "tickets"}</span><strong>{currency(selectedSeats.length * selectedFormatDetails.price)}</strong></div>
                  </div>
                  {bookingError && <p className="error-message" role="alert">{bookingError}</p>}
                  <div className="dialog-actions">
                    <button className="quiet-button" type="button" onClick={() => { setBookingError(""); setBookingStep("selection"); }}><ArrowLeft size={14} /> Back</button>
                    <button className="primary-button" type="button" onClick={() => setBookingStep("notice")}>Confirm details <ArrowRight size={15} /></button>
                  </div>
                </>
              )}
            </div>
          </section>
        </div>
      )}

      {authOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setAuthOpen(false); }}>
          <section className="dialog auth-dialog" role="dialog" aria-modal="true" aria-labelledby="auth-dialog-title">
            <div className="dialog-top"><div><p className="section-kicker">Welcome back</p><h2 id="auth-dialog-title">Sign in to CinemaWorld</h2></div><button className="icon-button" type="button" aria-label="Close sign in" onClick={() => setAuthOpen(false)}><X size={17} /></button></div>
            <div className="dialog-body">
              <p className="auth-copy">We’ll email you a secure sign-in link. No password to remember.</p>
              <form className="auth-form" onSubmit={(event) => void sendSignInLink(event)}>
                <label><span className="field-label">Email address</span><input className="text-field" autoComplete="email" type="email" required value={authEmail} onChange={(event) => setAuthEmail(event.target.value)} placeholder="you@example.com" /></label>
                <button className="primary-button" type="submit" disabled={authBusy}>{authBusy ? "Sending..." : "Send sign-in link"} {!authBusy && <ArrowRight size={15} />}</button>
              </form>
              {authMessage && <p className={authMessage.startsWith("Add your") ? "error-message" : "success-message"} role="status">{authMessage}</p>}
            </div>
          </section>
        </div>
      )}

      {reviewOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeReview(); }}>
          <section className="dialog review-dialog" role="dialog" aria-modal="true" aria-labelledby="review-dialog-title">
            <div className="dialog-top">
              <div><p className="section-kicker">Your voice matters</p><h2 id="review-dialog-title">Customer Review</h2></div>
              <button className="icon-button" type="button" aria-label="Close customer review" onClick={closeReview}><X size={17} /></button>
            </div>
            <div className="dialog-body">
              {reviewSubmitted ? (
                <div className="review-success" role="status">
                  <span className="review-success-icon"><Check size={18} /></span>
                  <h3>Thank you for your feedback!</h3>
                  <p>We appreciate you taking the time to share your thoughts.</p>
                </div>
              ) : (
                <form className="review-form" onSubmit={submitReview}>
                  <label>
                    <span className="field-label">Name</span>
                    <input className="text-field" autoComplete="name" required value={reviewName} onChange={(event) => setReviewName(event.target.value)} placeholder="Enter your name" />
                  </label>
                  <label>
                    <span className="field-label">Email Address</span>
                    <input className="text-field" autoComplete="email" type="email" required value={reviewEmail} onChange={(event) => setReviewEmail(event.target.value)} placeholder="Enter your email address" />
                  </label>
                  <label>
                    <span className="field-label">Customer Review / Opinions</span>
                    <textarea className="review-textarea" rows={5} required value={reviewText} onChange={(event) => setReviewText(event.target.value)} placeholder="Share your experience with us..." />
                  </label>
                  <button className="primary-button" type="submit">Submit Review <ArrowRight size={15} /></button>
                </form>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}