-- Japs Community core schema
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  display_name text,
  avatar_url text,
  bio text,
  is_guest boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.profiles add column if not exists is_guest boolean not null default false;
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 120),
  content text not null check (char_length(content) between 1 and 5000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  content text not null check (char_length(content) between 1 and 2000),
  parent_id uuid references public.comments(id) on delete cascade,
  created_at timestamptz not null default now()
);
create table if not exists public.likes (
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);
create table if not exists public.follows (
  follower_id uuid not null references public.profiles(id) on delete cascade,
  following_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower_id, following_id),
  check (follower_id <> following_id)
);
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  actor_id uuid references public.profiles(id) on delete set null,
  type text not null,
  post_id uuid references public.posts(id) on delete cascade,
  comment_id uuid references public.comments(id) on delete cascade,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.comments enable row level security;
alter table public.likes enable row level security;
alter table public.follows enable row level security;
alter table public.notifications enable row level security;

create policy "profiles are public" on public.profiles for select using (true);
create policy "users insert own profile" on public.profiles for insert to authenticated with check ((select auth.uid()) = id);
create policy "users update own profile" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy "posts are public" on public.posts for select using (true);
create policy "users create own posts" on public.posts for insert to authenticated with check ((select auth.uid()) = author_id);
create policy "users update own posts" on public.posts for update to authenticated using ((select auth.uid()) = author_id) with check ((select auth.uid()) = author_id);
create policy "users delete own posts" on public.posts for delete to authenticated using ((select auth.uid()) = author_id);
create policy "comments are public" on public.comments for select using (true);
create policy "users create comments" on public.comments for insert to authenticated with check ((select auth.uid()) = author_id);
create policy "users update own comments" on public.comments for update to authenticated using ((select auth.uid()) = author_id) with check ((select auth.uid()) = author_id);
create policy "users delete own comments" on public.comments for delete to authenticated using ((select auth.uid()) = author_id);
create policy "likes are public" on public.likes for select using (true);
create policy "users create own likes" on public.likes for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "users delete own likes" on public.likes for delete to authenticated using ((select auth.uid()) = user_id);
create policy "follows are public" on public.follows for select using (true);
create policy "users create own follows" on public.follows for insert to authenticated with check ((select auth.uid()) = follower_id);
create policy "users delete own follows" on public.follows for delete to authenticated using ((select auth.uid()) = follower_id);
create policy "users read own notifications" on public.notifications for select to authenticated using ((select auth.uid()) = user_id);
create policy "users update own notifications" on public.notifications for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

grant usage on schema public to anon, authenticated;
grant select on public.profiles, public.posts, public.comments, public.likes, public.follows to anon, authenticated;
grant insert, update, delete on public.profiles, public.posts, public.comments, public.likes, public.follows to authenticated;
grant select, update on public.notifications to authenticated;
grant usage, select on all sequences in schema public to authenticated;

create index if not exists posts_created_at_idx on public.posts(created_at desc);
create index if not exists comments_post_id_idx on public.comments(post_id, created_at);
create index if not exists notifications_user_id_idx on public.notifications(user_id, created_at desc);
create index if not exists profiles_is_guest_idx on public.profiles(is_guest);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username, display_name, is_guest)
  values (
    new.id,
    null,
    case when coalesce(new.is_anonymous, false) then '익명' else coalesce(new.raw_user_meta_data->>'display_name', split_part(coalesce(new.email, ''), '@', 1)) end,
    coalesce(new.is_anonymous, false)
  )
  on conflict (id) do update set is_guest = excluded.is_guest;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();
