create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  movie_title text not null,
  show_date date not null,
  show_time text not null,
  seats text[] not null check (cardinality(seats) > 0),
  contact_name text not null,
  contact_email text not null,
  total_amount numeric(8, 2) not null check (total_amount >= 0),
  created_at timestamptz not null default now()
);

alter table public.bookings enable row level security;

create policy "Guests and members can create bookings"
  on public.bookings for insert
  to anon, authenticated
  with check (
    (auth.uid() is null and user_id is null)
    or user_id = auth.uid()
  );

create policy "Members can view their own bookings"
  on public.bookings for select
  to authenticated
  using (user_id = auth.uid());