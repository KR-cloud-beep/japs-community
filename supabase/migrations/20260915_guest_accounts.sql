-- Japs Community: anonymous guest accounts
alter table public.profiles add column if not exists is_guest boolean not null default false;
create index if not exists profiles_is_guest_idx on public.profiles(is_guest);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
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

update public.profiles p
set is_guest = coalesce(u.is_anonymous, false),
    display_name = case when coalesce(u.is_anonymous, false) then '익명' else p.display_name end
from auth.users u
where u.id = p.id;
