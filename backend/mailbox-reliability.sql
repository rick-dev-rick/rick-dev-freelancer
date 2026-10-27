alter table public.mail_messages add column request_id uuid;
create unique index mail_messages_request on public.mail_messages(thread_id, request_id) where request_id is not null;
create function public.mail_append(p_id uuid,p_author text,p_body text,p_request uuid)
returns uuid language plpgsql security invoker set search_path = '' as $$
declare v_id uuid;
begin
 perform id from public.mail_threads where id=p_id for update;
 if not found then raise exception 'thread_not_found'; end if;
 select id into v_id from public.mail_messages where thread_id=p_id and request_id=p_request;
 if v_id is not null then return v_id; end if;
 if (select count(*) from public.mail_messages where thread_id=p_id) >= 200 then raise exception 'thread_full'; end if;
 insert into public.mail_messages(thread_id,author,body,request_id) values(p_id,p_author,p_body,p_request) returning id into v_id;
 update public.mail_threads set updated_at=now(),last_author=p_author where id=p_id;
 return v_id;
end; $$;
revoke all on function public.mail_append(uuid,text,text,uuid) from public, anon, authenticated;
grant execute on function public.mail_append(uuid,text,text,uuid) to service_role;
revoke execute on function public.mail_append(uuid,text,text) from service_role;
