alter table public.mail_threads add column status text not null default 'open' check(status in ('open','closed'));
alter table public.mail_threads add column closed_at timestamptz;
create index mail_threads_status_updated on public.mail_threads(status,updated_at desc);

create function public.mail_set_status(p_id uuid,p_status text)
returns uuid language plpgsql security invoker set search_path = '' as $$
begin
 if p_status not in ('open','closed') or p_status is null then raise exception 'invalid_status'; end if;
 perform id from public.mail_threads where id=p_id for update;
 if not found then raise exception 'thread_not_found'; end if;
 update public.mail_threads set status=p_status,
   closed_at=case when p_status='closed' then now() else null end,
   updated_at=now()
 where id=p_id and status<>p_status;
 return p_id;
end; $$;
revoke all on function public.mail_set_status(uuid,text) from public,anon,authenticated;
grant execute on function public.mail_set_status(uuid,text) to service_role;

create or replace function public.mail_append(p_id uuid,p_author text,p_body text,p_request uuid)
returns uuid language plpgsql security invoker set search_path = '' as $$
declare v_id uuid;
begin
 perform id from public.mail_threads where id=p_id for update;
 if not found then raise exception 'thread_not_found'; end if;
 select id into v_id from public.mail_messages where thread_id=p_id and request_id=p_request;
 if v_id is not null then return v_id; end if;
 if (select count(*) from public.mail_messages where thread_id=p_id) >= 200 then raise exception 'thread_full'; end if;
 insert into public.mail_messages(thread_id,author,body,request_id) values(p_id,p_author,p_body,p_request) returning id into v_id;
 update public.mail_threads set updated_at=now(),last_author=p_author,status='open',closed_at=null where id=p_id;
 return v_id;
end; $$;
