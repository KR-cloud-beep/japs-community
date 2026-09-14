-- Japs Community: categories, follows, and automatic notifications
-- Run after the core schema in supabase/schema.sql.

alter table public.posts add column if not exists category text not null default 'free';
alter table public.profiles add column if not exists role text not null default 'user';

alter table public.posts drop constraint if exists posts_category_check;
alter table public.posts add constraint posts_category_check check (category in ('free','question','information','announcement'));

create index if not exists posts_category_created_at_idx on public.posts(category, created_at desc);
create index if not exists follows_following_id_idx on public.follows(following_id);

-- Notification creation is done in the database so it cannot be skipped by the client.
create or replace function public.notify_post_like()
returns trigger language plpgsql security definer set search_path = public
as $$
declare target_user uuid;
begin
  select author_id into target_user from public.posts where id = new.post_id;
  if target_user is not null and target_user <> new.user_id then
    insert into public.notifications(user_id, actor_id, type, post_id)
    values (target_user, new.user_id, 'like', new.post_id);
  end if;
  return new;
end;
$$;

drop trigger if exists on_post_like on public.likes;
create trigger on_post_like after insert on public.likes for each row execute procedure public.notify_post_like();

create or replace function public.notify_comment()
returns trigger language plpgsql security definer set search_path = public
as $$
declare target_user uuid;
begin
  select author_id into target_user from public.posts where id = new.post_id;
  if target_user is not null and target_user <> new.author_id then
    insert into public.notifications(user_id, actor_id, type, post_id, comment_id)
    values (target_user, new.author_id, 'comment', new.post_id, new.id);
  end if;
  return new;
end;
$$;

drop trigger if exists on_comment_created on public.comments;
create trigger on_comment_created after insert on public.comments for each row execute procedure public.notify_comment();

create or replace function public.notify_follow()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.notifications(user_id, actor_id, type)
  values (new.following_id, new.follower_id, 'follow');
  return new;
end;
$$;

drop trigger if exists on_follow_created on public.follows;
create trigger on_follow_created after insert on public.follows for each row execute procedure public.notify_follow();

-- Allow the authenticated API to insert notifications only through triggers, not directly.
revoke insert, delete on public.notifications from anon, authenticated;
