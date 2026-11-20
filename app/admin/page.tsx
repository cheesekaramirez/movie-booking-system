"use client";

import { ArrowLeft, CalendarDays, Film, RefreshCw, Ticket, Users } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../supabase";

type Booking = {
  id: string;
  movie_title: string;
  show_date: string;
  show_time: string;
  seats: string[];
  contact_name: string;
  contact_email: string;
  total_amount: number;
  created_at: string;
};

const movieSummary = [
  { label: "Total movie listings", value: "15", detail: "Across all categories", icon: Film },
  { label: "Now showing", value: "5", detail: "Available to book today", icon: Ticket },
  { label: "Advance bookings", value: "10", detail: "Upcoming releases", icon: CalendarDays },
  { label: "Cinema locations", value: "10", detail: "Across Metro Manila", icon: Users },
];

export default function AdminPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function loadBookings() {
    setLoading(true);
    setMessage("");

    if (!supabase) {
      setLoading(false);
      setMessage("Connect Supabase to load live reservations. The dashboard is ready for local preview.");
      return;
    }

    const { data, error } = await supabase
      .from("bookings")
      .select("id, movie_title, show_date, show_time, seats, contact_name, contact_email, total_amount, created_at")
      .order("created_at", { ascending: false })
      .limit(8);

    if (error) {
      setLoading(false);
      setMessage("Reservations could not be loaded. Check your admin account and database permissions.");
      return;
    }

    setBookings((data ?? []) as Booking[]);
    setLoading(false);
  }

  useEffect(() => {
    const timer = window.setTimeout(() => void loadBookings(), 0);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <div>
          <Link className="admin-back-link" href="/"><ArrowLeft size={15} /> Back to CinemaWorld</Link>
          <p className="section-kicker">CinemaWorld operations</p>
          <h1>Admin dashboard</h1>
          <p className="admin-intro">Monitor movie listings, cinema locations, and recent reservations from one place.</p>
        </div>
        <button className="admin-refresh-button" type="button" onClick={() => void loadBookings()} disabled={loading}>
          <RefreshCw size={15} /> {loading ? "Refreshing..." : "Refresh"}
        </button>
      </header>

      <section className="admin-stat-grid" aria-label="CinemaWorld overview">
        {movieSummary.map(({ label, value, detail, icon: Icon }) => (
          <article className="admin-stat-card" key={label}>
            <span className="admin-stat-icon"><Icon size={18} /></span>
            <span className="admin-stat-label">{label}</span>
            <strong>{value}</strong>
            <small>{detail}</small>
          </article>
        ))}
      </section>

      <section className="admin-panel">
        <div className="admin-panel-heading">
          <div>
            <p className="section-kicker">Bookings</p>
            <h2>Recent reservations</h2>
          </div>
          <span className="admin-live-badge">Live data</span>
        </div>
        {message && <p className="admin-message" role="status">{message}</p>}
        {loading ? (
          <p className="admin-empty-state">Loading reservations...</p>
        ) : bookings.length === 0 ? (
          <p className="admin-empty-state">No reservations are available yet.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr><th>Guest</th><th>Movie</th><th>Schedule</th><th>Seats</th><th>Total</th></tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td><strong>{booking.contact_name}</strong><span>{booking.contact_email}</span></td>
                    <td>{booking.movie_title}</td>
                    <td>{booking.show_date}<span>{booking.show_time}</span></td>
                    <td>{booking.seats.join(", ")}</td>
                    <td>₱{Number(booking.total_amount).toLocaleString("en-PH", { minimumFractionDigits: 2 })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="admin-panel admin-management-panel">
        <div className="admin-panel-heading">
          <div>
            <p className="section-kicker">Management</p>
            <h2>Quick actions</h2>
          </div>
        </div>
        <div className="admin-action-grid">
          <div><Film size={18} /><strong>Movie listings</strong><span>Review titles, genres, formats, and release dates.</span></div>
          <div><CalendarDays size={18} /><strong>Screening schedules</strong><span>Keep showtimes and cinema availability up to date.</span></div>
          <div><Users size={18} /><strong>Customer support</strong><span>Use reservation details to help guests with their bookings.</span></div>
        </div>
      </section>
    </main>
  );
}
