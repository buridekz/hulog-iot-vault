-- One live gate code.
-- The phone writes pin and active. The vault clears active after a real drop.
-- open_once asks the vault to open one time and then forget the request.
-- It is not a keypad code.

create table public.live_code (
  id smallint primary key,
  pin text not null default '',
  active boolean not null default false,
  open_once boolean not null default false,
  constraint live_code_one_row check (id = 1),
  constraint live_code_pin_shape check (pin = '' or pin ~ '^[0-9]{6}$'),
  constraint live_code_active_needs_pin check (active = false or pin ~ '^[0-9]{6}$')
);

comment on table public.live_code is
  'One live gate code. The phone writes pin and active. The vault clears active after a real drop. open_once asks the vault to open once and then forget the request. It is not a keypad code.';

alter table public.live_code enable row level security;

revoke all on table public.live_code from anon, authenticated;
grant select, update on table public.live_code to anon;

create policy "read the one live code"
on public.live_code
for select
to anon
using (id = 1);

create policy "update the one live code"
on public.live_code
for update
to anon
using (id = 1)
with check (id = 1);

insert into public.live_code (id, pin, active, open_once)
values (1, '', false, false);
