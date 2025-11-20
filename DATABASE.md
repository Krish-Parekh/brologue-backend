<!-- Database design -->
create table public.users (
  id text not null,
  first_name text null,
  last_name text null,
  email text null,
  avatar_url text null,
  created_at timestamp without time zone null default now(),
  updated_at timestamp without time zone null default now(),
  constraint users_pkey primary key (id),
  constraint users_email_unique unique (email)
) TABLESPACE pg_default;

create table public.week_progress (
  user_id text not null,
  week_id integer not null,
  started_at timestamp without time zone null default now(),
  completed_at timestamp without time zone null,
  unlocked_at timestamp without time zone null default now(),
  constraint week_progress_user_id_week_id_unique unique (user_id, week_id),
  constraint week_progress_user_id_users_id_fk foreign KEY (user_id) references users (id)
) TABLESPACE pg_default;

create table public.daily_week_progress (
  user_id text not null,
  week_id integer not null,
  day_number integer not null,
  notes text null,
  created_at timestamp without time zone not null default now(),
  updated_at timestamp without time zone not null default now(),
  constraint daily_week_progress_user_id_week_id_day_number_unique unique (user_id, week_id, day_number),
  constraint daily_week_progress_user_id_users_id_fk foreign KEY (user_id) references users (id)
) TABLESPACE pg_default;


Initial Flow
1. `users` will be created using webhook from the clerk and supabase.
2. We can create a trigger on every insertion to the `users` table, we need to create an entry in our `week_progress` table with the default values and unlock the week 1.

Daily Week Progress
1. There would be a post request using which we need to keep updating this table. This table would be insertion heavy.

2. We need to create a trigger here, if the COUNT(day_number) == 7 on insertion, we create a row inside the week_progress and we by create new rows with default values and also updated previous value completed_at and created new week with unlock_at.

Progress Analytics
1. We can calculate daily progress on the fly, by processing all the created_at dates and find the largest streak amongst it.
