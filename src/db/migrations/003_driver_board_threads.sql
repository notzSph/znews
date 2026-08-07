alter table driver_boards
  add column if not exists discord_thread_id text;
