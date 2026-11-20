"use client";

import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  Clock3,
  Clapperboard,
  Film,
  Info,
  MapPin,
  ShieldCheck,
  Star,
  Ticket,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useState, type CSSProperties, type FormEvent } from "react";
import { QRCodeSVG } from "qrcode.react";
import { supabase } from "./supabase";

type MovieTab = "Now showing" | "Coming soon" | "Advance booking";
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
  formats: string[];
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
    formats: ["Regular", "Screen X", "4DX"],
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
    formats: ["Regular", "IMAX", "4DX"],
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
    formats: ["Regular", "Screen X"],
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
    formats: ["Regular", "4DX"],
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
    formats: ["Regular", "Screen X"],
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
    formats: ["Regular", "Screen X", "4DX"],
    poster: "https://en.wikipedia.org/wiki/Special:Redirect/file/Resident_Evil_2026_film_poster.png",
    tint: "#3c2738",
    sourceUrl: "https://en.wikipedia.org/wiki/Resident_Evil_(2026_film)",
    advanceBooking: true,
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
    formats: ["Regular", "IMAX", "4DX"],
    poster: "https://smcine-digital-cdn.app.vista.co/media/entity/get/FilmPosterGraphic/HO00001643?width=200",
    tint: "#573d33",
    sourceUrl: "https://en.wikipedia.org/wiki/Avengers:_Endgame",
    advanceBooking: true,
  },
  {
    id: "hunger-games",
    title: "The Hunger Games: Sunrise on the Reaping",
    shortTitle: "The Hunger Games: Sunrise on the Reaping",
    status: "Advance booking",
    rating: "TBD",
    duration: "Coming soon",
    genres: ["Action", "Drama", "Sci-Fi"],
    director: "Francis Lawrence",
    cast: "Joseph Zada, Whitney Peak, Mckenna Grace, Jesse Plemons",
    synopsis:
      "At the 50th Hunger Games, 16-year-old Haymitch Abernathy is chosen for a Quarter Quell where each district must send twice as many tributes.",
    formats: ["Regular", "IMAX", "4DX"],
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
    formats: ["Regular", "IMAX", "4DX"],
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
    formats: ["Regular", "IMAX", "4DX"],
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
    formats: ["Regular", "Screen X"],
    poster: "https://upload.wikimedia.org/wikipedia/en/c/c5/Runner_%282026_American_film%29_poster.jpg",
    tint: "#3f355a",
    sourceUrl: "https://en.wikipedia.org/wiki/Runner_(2026_American_film)",
    advanceBooking: true,
  },
  {
    id: "forgotten-island",
    title: "Forgotten Island",
    shortTitle: "Forgotten Island",
    status: "Advance booking",
    rating: "TBD",
    duration: "Coming soon",
    genres: ["Animation", "Fantasy", "Adventure"],
    director: "Joel Crawford and Januel Mercado",
    cast: "H.E.R., Liza Soberano, Dave Franco, Lea Salonga",
    synopsis:
      "Best friends Jo and Raissa enter Nakali, a magical island from Filipino folklore, where strange creatures put their friendship and memories to the test.",
    formats: ["Regular", "4DX"],
    poster: "https://en.wikipedia.org/wiki/Special:Redirect/file/Forgotten_Island_poster.jpeg",
    tint: "#53516a",
    sourceUrl: "https://en.wikipedia.org/wiki/Forgotten_Island",
  },
  {
    id: "digger",
    title: "Digger",
    shortTitle: "Digger",
    status: "Advance booking",
    rating: "TBD",
    duration: "Coming soon",
    genres: ["Comedy", "Drama"],
    director: "Alejandro G. Iñárritu",
    cast: "Tom Cruise, Riz Ahmed, John Goodman, Sandra Hüller",
    synopsis:
      "Oil magnate Digger Rockwell faces a disaster caused by his own company, mirrored by an actor playing Digger in a satirical stage production.",
    formats: ["Regular", "IMAX"],
    poster: "https://en.wikipedia.org/wiki/Special:Redirect/file/Digger_(2026_film)_poster.jpg",
    tint: "#42505c",
    sourceUrl: "https://en.wikipedia.org/wiki/Digger_(2026_film)",
  },
  {
    id: "street-fighter",
    title: "Street Fighter",
    shortTitle: "Street Fighter",
    status: "Advance booking",
    rating: "TBD",
    duration: "Coming soon",
    genres: ["Action", "Martial Arts"],
    director: "Kitao Sakurai",
    cast: "Noah Centineo, Andrew Koji, Callina Liang, Jason Momoa",
    synopsis:
      "In 1993, estranged fighters Ryu and Ken are recruited by Chun-Li for the World Warrior Tournament, where they must face each other and their own demons.",
    formats: ["Regular", "Screen X", "4DX"],
    poster: "https://en.wikipedia.org/wiki/Special:Redirect/file/Street_Fighter_2026_film_poster.jpeg",
    tint: "#9f4821",
    sourceUrl: "https://en.wikipedia.org/wiki/Street_Fighter_(2026_film)",
  },
  {
    id: "hexed",
    title: "Hexed",
    shortTitle: "Hexed",
    status: "Advance booking",
    rating: "TBD",
    duration: "Coming soon",
    genres: ["Animation", "Fantasy", "Comedy"],
    director: "Fawn Veerasunthorn and Jason Hand",
    cast: "Hailee Steinfeld, Rashida Jones, Jodie Foster, Walton Goggins",
    synopsis:
      "After discovering her magical abilities, teenager Billie is pulled from suburbia into Hexe, the realm of witches, with her cautious mother Alice.",
    formats: ["Regular", "4DX"],
    poster: "https://en.wikipedia.org/wiki/Special:Redirect/file/Hexed_poster.jpg",
    tint: "#51406c",
    sourceUrl: "https://en.wikipedia.org/wiki/Hexed_(2026_film)",
  },
];

const tabs: MovieTab[] = ["Now showing", "Coming soon", "Advance booking"];
const showtimes = ["10:30 AM", "1:15 PM", "4:00 PM", "7:20 PM", "9:45 PM"];
const seatRows = ["A", "B", "C", "D", "E", "F"];
const pricePerSeat = 450;

function dateKey(date: Date) {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return localDate.toISOString().slice(0, 10);
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
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState<"selection" | "review" | "notice" | "confirmed">("selection");
  const [selectedDate, setSelectedDate] = useState(() => dateKey(new Date()));
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [bookingBusy, setBookingBusy] = useState(false);
  const [bookingCode, setBookingCode] = useState("");
  const [authOpen, setAuthOpen] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [authBusy, setAuthBusy] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const dates = Array.from({ length: 5 }, (_, offset) => {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    return date;
  });
  const visibleMovies = movies.filter((movie) => {
    if (activeTab === "Coming soon") return movie.status !== "Now showing";
    if (activeTab === "Advance booking") return movie.advanceBooking === true;
    return movie.status === "Now showing";
  });
  const featuredMovie = movies[0];
  const bookingStepNumber = bookingStep === "selection" ? 1 : bookingStep === "review" ? 2 : 3;

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
    if (!bookingOpen && !authOpen && !selectedMovie) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setBookingOpen(false);
        setAuthOpen(false);
        setSelectedMovie(null);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [authOpen, bookingOpen, selectedMovie]);

  function openMovie(movie: Movie) {
    setSelectedMovie(movie);
    setBookingOpen(false);
  }

  function openBooking(movie: Movie) {
    setSelectedMovie(movie);
    setSelectedDate(dateKey(new Date()));
    setSelectedTime("");
    setSelectedSeats([]);
    setContactName("");
    setContactEmail(userEmail ?? "");
    setBookingError("");
    setBookingCode("");
    setBookingStep("selection");
    setBookingOpen(true);
  }

  function toggleSeat(seat: string) {
    setSelectedSeats((current) =>
      current.includes(seat) ? current.filter((item) => item !== seat) : [...current, seat].sort(),
    );
  }

  function continueToReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBookingError("");
    setBookingStep("review");
  }

  async function confirmBooking() {
    if (!selectedMovie) return;
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
        total_amount: selectedSeats.length * pricePerSeat,
      });
      if (error) {
        setBookingBusy(false);
        setBookingError("We couldn't save this booking. Please check your connection and try again.");
        return;
      }
    }

    setBookingCode(`CW-${Math.random().toString(36).slice(2, 8).toUpperCase()}`);
    setBookingBusy(false);
    setBookingStep("confirmed");
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
          <a href="#formats">Screening formats</a>
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
          <div className="hero-copy">
            <h1 className="hero-title" id="hero-title"><span>Cherish Movie Moments With Friends and Family!</span></h1>
            <p className="hero-description">We'll take care of everything else right here at CinemaWorld!</p>
            <div className="hero-ctas">
              <a className="primary-button" href="#movies">Explore movies <ArrowRight /></a>
            </div>
            <div className="hero-note"><ShieldCheck size={14} /> Secure checkout · Mobile tickets accepted</div>
          </div>
          <div className="hero-art" aria-label={`Featured film: ${featuredMovie.title}`}>
            <span className="orbit-dot orbit-dot-one" />
            <span className="orbit-dot orbit-dot-two" />
            <span className="orbit-dot orbit-dot-three" />
            <div className="hero-poster" style={posterStyle(featuredMovie)}>
              <div className="hero-poster-content">
                <span className="poster-kicker"><Film size={11} /> Featured film</span>
                <h2>{featuredMovie.shortTitle}</h2>
                <p>Only in cinemas · Now showing</p>
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
                    <span className="movie-status">{movie.status === "Now showing" ? "In cinemas" : "Book ahead"}</span>
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

          <div className="catalog-footer" id="formats">
            <span>{visibleMovies.length} films · Updated weekly</span>
            <div className="format-strip" aria-label="Available screening formats">
              <span className="format-chip">REGULAR</span><span className="format-chip">IMAX</span><span className="format-chip">SCREEN X</span><span className="format-chip">4DX</span>
            </div>
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
                <button className="primary-button" type="button" onClick={() => openBooking(selectedMovie)}><Ticket size={15} /> Buy a ticket</button>
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
                <h2 id="booking-dialog-title">{bookingStep === "confirmed" ? "Digital ticket" : bookingStep === "notice" ? "A little heads-up" : "Book your seats"}</h2>
                {bookingStep !== "confirmed" && <div className="booking-progress" aria-label={`Step ${bookingStepNumber} of 3`}>
                  <span className={`progress-step ${bookingStepNumber === 1 ? "is-active" : "is-done"}`}><span className="progress-dot">{bookingStepNumber > 1 ? <Check size={10} /> : "1"}</span> Choose seats</span>
                  <span className="progress-line" />
                  <span className={`progress-step ${bookingStepNumber === 2 ? "is-active" : bookingStepNumber > 2 ? "is-done" : ""}`}><span className="progress-dot">{bookingStepNumber > 2 ? <Check size={10} /> : "2"}</span> Review</span>
                  <span className="progress-line" />
                  <span className={`progress-step ${bookingStepNumber === 3 ? "is-active" : ""}`}><span className="progress-dot">3</span> Heads up</span>
                </div>}
              </div>
              <button className="icon-button" type="button" aria-label="Close booking" onClick={() => { setBookingOpen(false); setSelectedMovie(null); }}><X size={17} /></button>
            </div>

            <div className="dialog-body">
              {bookingStep === "confirmed" ? (
                <div className="digital-ticket">
                  <div className="digital-ticket-main">
                    <div className="digital-ticket-copy">
                      <p className="section-kicker">CinemaWorld · Admit {selectedSeats.length}</p>
                      <h3>{selectedMovie.title}</h3>
                      <p className="digital-ticket-format">{selectedMovie.formats[0]} · Standard admission</p>
                      <div className="digital-ticket-details">
                        <div><span>DATE</span><strong>{formatDate(selectedDate)}</strong></div>
                        <div><span>SHOWTIME</span><strong>{selectedTime}</strong></div>
                        <div><span>SEATS</span><strong>{selectedSeats.join(", ")}</strong></div>
                        <div><span>GUEST</span><strong>{contactName}</strong></div>
                      </div>
                    </div>
                    <div className="digital-ticket-qr">
                      <QRCodeSVG
                        value={JSON.stringify({ cinema: "CinemaWorld", code: bookingCode, movie: selectedMovie.title, date: selectedDate, time: selectedTime, seats: selectedSeats })}
                        size={112}
                        level="M"
                        aria-label={`Ticket QR code ${bookingCode}`}
                      />
                      <span>SCAN AT ENTRY</span>
                    </div>
                  </div>
                  <div className="digital-ticket-footer"><span>BOOKING CODE</span><strong>{bookingCode}</strong><span>Confirmation sent to {contactEmail}</span></div>
                  <div className="dialog-actions" style={{ justifyContent: "center" }}><button className="primary-button" type="button" onClick={() => { setBookingOpen(false); setSelectedMovie(null); }}>Done</button></div>
                </div>
              ) : bookingStep === "selection" ? (
                <form onSubmit={continueToReview}>
                  <div className="form-section">
                    <div className="form-label"><CalendarDays size={13} /> Choose a day</div>
                    <div className="date-row">{dates.map((date, offset) => {
                      const key = dateKey(date);
                      return <button className="date-option" type="button" key={key} aria-pressed={selectedDate === key} onClick={() => setSelectedDate(key)}>
                        <span>{offset === 0 ? "Today" : offset === 1 ? "Tomorrow" : date.toLocaleDateString("en-US", { weekday: "short" })}</span>
                        <strong>{date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</strong>
                      </button>;
                    })}</div>
                  </div>
                  <div className="form-section">
                    <div className="form-label"><Clock3 size={13} /> Show time</div>
                    <div className="time-row">{showtimes.map((time) => <button className="time-option" type="button" key={time} aria-pressed={selectedTime === time} onClick={() => setSelectedTime(time)}>{time}</button>)}</div>
                  </div>
                  <div className="form-section">
                    <div className="form-label">Select your seats</div>
                    <div className="screen-layout"><div className="screen-glow" /><div className="screen-label">Screen</div></div>
                    <div className="seat-grid" aria-label="Seat selection">{seatRows.flatMap((row, rowIndex) =>
                      Array.from({ length: 8 }, (unused, seatIndex) => {
                        void unused;
                        const seat = `${row}${seatIndex + 1}`;
                        const seatNumber = rowIndex * 8 + seatIndex;
                        const unavailable = seatNumber % 11 === 3 || seatNumber % 17 === 8;
                        return <button className="seat" type="button" key={seat} aria-label={`Seat ${seat}${unavailable ? ", occupied" : ""}`} aria-pressed={selectedSeats.includes(seat)} disabled={unavailable} onClick={() => toggleSeat(seat)}>{seat}</button>;
                      }),
                    )}</div>
                    <div className="seat-legend"><span><i className="legend-swatch" /> Available</span><span><i className="legend-swatch selected" /> Selected</span><span><i className="legend-swatch occupied" /> Occupied</span></div>
                  </div>
                  <div className="contact-fields">
                    <label><span className="field-label">Name</span><input className="text-field" autoComplete="name" required value={contactName} onChange={(event) => setContactName(event.target.value)} placeholder="Your name" /></label>
                    <label><span className="field-label">Email for tickets</span><input className="text-field" autoComplete="email" type="email" required value={contactEmail} onChange={(event) => setContactEmail(event.target.value)} placeholder="you@example.com" /></label>
                  </div>
                  <div className="dialog-actions">
                    <span className="summary-row"><span>{selectedSeats.length} selected</span><strong>{currency(selectedSeats.length * pricePerSeat)}</strong></span>
                    <button className="primary-button" type="submit" disabled={!selectedTime || selectedSeats.length === 0}>Review booking <ArrowRight size={15} /></button>
                  </div>
                </form>
              ) : bookingStep === "notice" ? (
                <div className="heads-up-popup">
                  <div className="heads-up-intro"><span className="heads-up-icon"><Info size={17} /></span><p>Thank you for choosing CinemaWorld. Review these important details before your ticket is issued.</p></div>
                  <ul className="heads-up-list">
                    <li><Check size={14} /> Confirm your movie, date, time, and seats are correct.</li>
                    <li><Ticket size={14} /> Tickets are non-refundable unless the show is cancelled or rescheduled.</li>
                    <li><Clock3 size={14} /> Arrive at least 15 minutes before showtime and scan your ticket at entry.</li>
                    <li><Info size={14} /> Your booking confirmation will be sent to {contactEmail}.</li>
                    <li><Info size={14} /> Outside food and drinks are not allowed in the cinema.</li>
                    <li><Info size={14} /> Latecomers may not be admitted after the movie has started.</li>
                  </ul>
                  {bookingError && <p className="error-message" role="alert">{bookingError}</p>}
                  <div className="dialog-actions">
                    <button className="quiet-button" type="button" onClick={() => { setBookingError(""); setBookingStep("review"); }}><ArrowLeft size={14} /> Back to review</button>
                    <button className="primary-button" type="button" disabled={bookingBusy} onClick={() => void confirmBooking()}>{bookingBusy ? "Issuing ticket..." : "I understand · Show ticket"} {!bookingBusy && <Ticket size={15} />}</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="booking-summary">
                    <div className="summary-row"><span>Movie</span><strong>{selectedMovie.title}</strong></div>
                    <div className="summary-row"><span>Date &amp; time</span><strong>{formatDate(selectedDate)} · {selectedTime}</strong></div>
                    <div className="summary-row"><span>Seats</span><strong>{selectedSeats.join(", ")}</strong></div>
                    <div className="summary-row"><span>Confirmation email</span><strong>{contactEmail}</strong></div>
                    <div className="summary-row total"><span>Total · {selectedSeats.length} {selectedSeats.length === 1 ? "ticket" : "tickets"}</span><strong>{currency(selectedSeats.length * pricePerSeat)}</strong></div>
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
    </div>
  );
}