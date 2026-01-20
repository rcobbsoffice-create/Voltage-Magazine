-- Create Profiles Table (extends Auth)
create table public.profiles (
  id uuid references auth.users not null primary key,
  username text unique,
  role text default 'USER', -- 'ADMIN', 'WRITER'
  avatar_url text,
  bio text,
  expertise text[], -- Array of strings
  rating float default 0,
  completed_jobs int default 0,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS for Profiles
alter table public.profiles enable row level security;
create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);
create policy "Users can insert their own profile." on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on public.profiles for update using (auth.uid() = id);

-- Create Articles Table
create table public.articles (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  title text not null,
  excerpt text,
  content text,
  cover_image text,
  is_premium boolean default false,
  author_id uuid references public.profiles(id), -- Optional link to real user
  author_json jsonb, -- Fallback for AI/Guest authors
  status text default 'draft', -- 'draft', 'published'
  created_at timestamp with time zone default timezone('utc'::text, now()),
  published_at timestamp with time zone
);

-- Enable RLS for Articles
alter table public.articles enable row level security;
create policy "Published articles are viewable by everyone." on public.articles for select using (status = 'published');
create policy "Anon can create drafts (for now)." on public.articles for insert with check (true); 
-- NOTE: In production, lock Insert down to 'WRITER' role only.
