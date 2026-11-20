"use client";

import { ArrowLeft, Bell, CalendarDays, Film, RefreshCw, Ticket, Users } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

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
  status?: string;
};

const demoBookings: Booking[] = [
  { id: "cw-1048", movie_title: "Spider-Man: Brand New Day", show_date: "2026-07-31", show_time: "7:00 PM", seats: ["F6", "F7"], contact_name: "Mia Santos", contact_email: "mia@example.com", total_amount: 760, created_at: "2026-06-20" },
  { id: "cw-1047", movie_title: "The Odyssey", show_date: "2026-07-17", show_time: "3:30 PM", seats: ["C4"], contact_name: "Daniel Cruz", contact_email: "daniel@example.com", total_amount: 850, created_at: "2026-06-19" },
  { id: "cw-1046", movie_title: "Toy Story 5", show_date: "2026-06-19", show_time: "1:15 PM", seats: ["B2", "B3", "B4"], contact_name: "Lara Reyes", contact_email: "lara@example.com", total_amount: 1140, created_at: "2026-06-18" },
];

const movieSummary = [
  { label: "Total movie listings", value: "15", detail: "Across all categories", icon: Film },
  { label: "Now showing", value: "5", detail: "Available to book today", icon: Ticket },
  { label: "Advance bookings", value: "10", detail: "Upcoming releases", icon: CalendarDays },
  { label: "Cinema locations", value: "10", detail: "Across Metro Manila", icon: Users },
];

export default function AdminPage() {
  const [bookings, setBookings] = useState<Booking[]>(demoBookings);
  const [loading, setLoading] = useState(false);
  const [notificationsRead, setNotificationsRead] = useState(false);

  function readReservationRecords() {
    const stored = JSON.parse(
      window.localStorage.getItem("cinemaWorldReservations") ?? "[]",
    ) as Booking[];
    return [...stored, ...demoBookings].slice(0, 20);
  }

  useEffect(() => {
    const timer = window.setTimeout(() => setBookings(readReservationRecords()), 0);
    const handleStorage = () => setBookings(readReservationRecords());
    window.addEventListener("storage", handleStorage);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  function refreshBookings() {
    setLoading(true);
    window.setTimeout(() => {
      setBookings(readReservationRecords());
      setLoading(false);
    }, 350);
  }

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <div>
          <Link className="admin-back-link" href="/"><ArrowLeft size={15} /> Back to CinemaWorld</Link>
          <p className="section-kicker">CinemaWorld operations</p>
          <h1>Admin dashboard</h1>
          <p className="admin-intro">Monitor movie listings, cinema locations, and recent reservations from one place.</p>
        </div>
        <div className="admin-header-actions">
          <button className="admin-notification-button" type="button" aria-label="View booking notifications" onClick={() => setNotificationsRead(true)}>
            <Bell size={16} />
            {!notificationsRead && bookings.some((booking) => booking.status === "New") && <span>{bookings.filter((booking) => booking.status === "New").length}</span>}
          </button>
          <button className="admin-refresh-button" type="button" onClick={refreshBookings} disabled={loading}>
            <RefreshCw size={15} /> {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
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

      <section className="admin-panel admin-notifications-panel" aria-labelledby="booking-notifications-heading">
        <div className="admin-panel-heading">
          <div>
            <p className="section-kicker">Notifications</p>
            <h2 id="booking-notifications-heading">New booking records</h2>
          </div>
          {!notificationsRead && <span className="admin-live-badge">Unread</span>}
        </div>
        {bookings.some((booking) => booking.status === "New") ? (
          <div className="admin-notification-list">
            {bookings.filter((booking) => booking.status === "New").slice(0, 5).map((booking) => (
              <article className="admin-notification" key={booking.id}>
                <span className="admin-notification-icon"><Ticket size={16} /></span>
                <div>
                  <strong>{booking.contact_name} booked {booking.movie_title}</strong>
                  <p>{booking.seats.join(", ")} · {booking.show_date} · {booking.show_time}</p>
                </div>
                <span className="admin-notification-reference">{booking.id}</span>
              </article>
            ))}
          </div>
        ) : (
          <p className="admin-empty-state">New reservations will appear here.</p>
        )}
      </section>

      <section className="admin-panel">
        <div className="admin-panel-heading">
          <div>
            <p className="section-kicker">Bookings</p>
            <h2>Recent reservations</h2>
          </div>
          <span className="admin-live-badge">Demo data</span>
        </div>
        {loading ? (
          <p className="admin-empty-state">Refreshing reservations...</p>
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
