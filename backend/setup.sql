create table public.mail_threads (
 id uuid primary key default gen_random_uuid(),
 token_hash text not null unique check (token_hash ~ '^[a-f0-9]{64}$'),
 name text not null check (char_length(name) between 1 and 100),
 business text not null default '' check (char_length(business) <= 150),
 service text not null check (char_length(service) between 1 and 100),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 last_author text not null default 'client' check (last_author in ('client','admin'))
);
create table public.mail_messages (
 id uuid primary key default gen_random_uuid(),
 thread_id uuid not null references public.mail_threads(id) on delete cascade,
 author text not null check (author in ('client','admin')),
 body text not null check (char_length(body) between 1 and 5000),
 created_at timestamptz not null default now()
);
create index mail_messages_thread_time on public.mail_messages(thread_id, created_at);
create index mail_threads_updated on public.mail_threads(updated_at desc);
create table public.mail_rate_limits (
 bucket text primary key,
 hits integer not null default 1,
 expires_at timestamptz not null
);
alter table public.mail_threads enable row level security;
alter table public.mail_messages enable row level security;
alter table public.mail_rate_limits enable row level security;
revoke all on public.mail_threads, public.mail_messages, public.mail_rate_limits from anon, authenticated;
grant all on public.mail_threads, public.mail_messages, public.mail_rate_limits to service_role;

create function public.mail_take_rate(p_bucket text,p_limit integer,p_window integer)
returns boolean language plpgsql security invoker set search_path = '' as $$
declare v_hits integer;
begin
 insert into public.mail_rate_limits(bucket,hits,expires_at) values(p_bucket,1,now()+make_interval(secs=>p_window))
 on conflict(bucket) do update set
 hits=case when public.mail_rate_limits.expires_at < now() then 1 else public.mail_rate_limits.hits+1 end,
 expires_at=case when public.mail_rate_limits.expires_at < now() then now()+make_interval(secs=>p_window) else public.mail_rate_limits.expires_at end
 returning hits into v_hits;
 return v_hits <= p_limit;
end; $$;

create function public.mail_create(p_hash text,p_name text,p_business text,p_service text,p_body text)
returns uuid language plpgsql security invoker set search_path = '' as $$
declare v_id uuid;
begin
 insert into public.mail_threads(token_hash,name,business,service) values(p_hash,p_name,p_business,p_service)
 on conflict(token_hash) do nothing returning id into v_id;
 if v_id is null then
   select id into v_id from public.mail_threads where token_hash=p_hash;
 else
   insert into public.mail_messages(thread_id,author,body) values(v_id,'client',p_body);
 end if;
 return v_id;
end; $$;

create function public.mail_append(p_id uuid,p_author text,p_body text)
returns uuid language plpgsql security invoker set search_path = '' as $$
declare v_id uuid;
begin
 perform id from public.mail_threads where id=p_id for update;
 if not found then raise exception 'thread_not_found'; end if;
 if (select count(*) from public.mail_messages where thread_id=p_id) >= 200 then raise exception 'thread_full'; end if;
 insert into public.mail_messages(thread_id,author,body) values(p_id,p_author,p_body) returning id into v_id;
 update public.mail_threads set updated_at=now(),last_author=p_author where id=p_id;
 return v_id;
end; $$;
revoke all on function public.mail_take_rate(text,integer,integer), public.mail_create(text,text,text,text,text), public.mail_append(uuid,text,text) from public, anon, authenticated;
grant execute on function public.mail_take_rate(text,integer,integer), public.mail_create(text,text,text,text,text), public.mail_append(uuid,text,text) to service_role;
