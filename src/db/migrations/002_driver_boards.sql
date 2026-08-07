alter table news_events
  add column if not exists drivers text[] not null default '{}',
  add column if not exists transmission_channels text[] not null default '{}',
  add column if not exists board_driver text;

create index if not exists news_events_board_driver_published_at_idx
  on news_events (board_driver, published_at desc);

create table if not exists driver_boards (
  driver text primary key,
  discord_message_id text not null,
  updated_at timestamptz not null default now()
);
