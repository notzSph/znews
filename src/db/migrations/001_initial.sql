create table if not exists sources (
  id text primary key,
  name text not null,
  url text not null,
  enabled boolean not null default true,
  last_fetched_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists schema_migrations (
  id text primary key,
  applied_at timestamptz not null default now()
);

create table if not exists raw_news_items (
  id text primary key,
  source_id text not null references sources(id),
  title text not null,
  url text not null,
  summary text,
  published_at timestamptz not null,
  content_hash text not null,
  created_at timestamptz not null default now(),
  unique (source_id, url)
);

create index if not exists raw_news_items_published_at_idx
  on raw_news_items (published_at desc);

create index if not exists raw_news_items_content_hash_idx
  on raw_news_items (content_hash);

create table if not exists event_clusters (
  id text primary key,
  fingerprint text not null,
  title text not null,
  category text not null,
  status text not null,
  first_seen_at timestamptz not null,
  last_seen_at timestamptz not null,
  discord_thread_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists event_clusters_fingerprint_idx
  on event_clusters (fingerprint);

create table if not exists news_events (
  id text primary key,
  raw_item_id text not null references raw_news_items(id),
  cluster_id text references event_clusters(id),
  category text not null,
  headline text not null,
  status text not null,
  direct_tickers text[] not null default '{}',
  secondary_tickers text[] not null default '{}',
  macro_labels text[] not null default '{}',
  source_url text not null,
  published_at timestamptz not null,
  discord_message_id text,
  created_at timestamptz not null default now()
);

create index if not exists news_events_published_at_idx
  on news_events (published_at desc);

create index if not exists news_events_cluster_id_idx
  on news_events (cluster_id);

create table if not exists digest_runs (
  id text primary key,
  digest_type text not null,
  window_start timestamptz not null,
  window_end timestamptz not null,
  discord_message_id text,
  created_at timestamptz not null default now()
);
