/** Run these queries to set up vulcanize for custom queries **/

create index if not exists headers_block_timestamp_idx ON public.headers (block_timestamp);

drop function if exists api.spot_poke_time;
drop type if exists api.spot_poke_time_result cascade;
create type api.spot_poke_time_result AS (
    date timestamptz,
    ilk_id int4,
    value numeric,
    block_number int8,
    block_timestamp numeric
);
create function api.spot_poke_time(start_time date, end_time date, granularity interval)
    returns setof api.spot_poke_time_result as $$
        WITH input AS (
            SELECT generate_series(start_time, end_time, granularity) AS d
        ),
        ilk_values AS (
            SELECT input.d AS date, ilk_id, MAX(s.header_id) AS header_id FROM maker.spot_poke s CROSS JOIN input LEFT JOIN public.headers h ON (h.id = s.header_id) WHERE h.block_timestamp < extract(epoch FROM (input.d + granularity)) GROUP BY input.d, ilk_id
        )
        SELECT i.date, i.ilk_id, s.value, h.block_number, h.block_timestamp FROM ilk_values i LEFT JOIN maker.spot_poke s ON (s.header_id = i.header_id AND s.ilk_id = i.ilk_id) LEFT JOIN public.headers h ON (h.id = s.header_id)
    $$ language sql stable;

drop function if exists api.pot_pie_time;
drop type if exists api.pot_pie_time_result cascade;
create type api.pot_pie_time_result AS (
    date timestamptz,
    pie numeric,
    block_number int8,
    block_timestamp numeric
);
create function api.pot_pie_time(start_time date, end_time date, granularity interval)
    returns setof api.pot_pie_time_result as $$
        WITH input AS (
            SELECT generate_series(start_time, end_time, granularity) AS d
        ),
        pie_values AS (
            SELECT input.d AS date, MAX(p.header_id) AS header_id FROM maker.pot_pie p CROSS JOIN input LEFT JOIN public.headers h ON (h.id = p.header_id) WHERE h.block_timestamp < extract(epoch FROM input.d + granularity) GROUP BY input.d
        )
        SELECT i.date, p.pie, h.block_number, h.block_timestamp FROM pie_values i LEFT JOIN maker.pot_pie p ON (p.header_id = i.header_id) LEFT JOIN public.headers h ON (h.id = p.header_id)
    $$ language sql stable;

drop function if exists api.ilk_ink_time;
drop type if exists api.ilk_ink_time_result cascade;
create type api.ilk_ink_time_result AS (
    date timestamptz,
    ilk_id int4,
    ink numeric,
    block_number int8,
    block_timestamp numeric
);
create function api.ilk_ink_time(start_time date, end_time date, granularity interval)
    returns setof api.ilk_ink_time_result as $$
        WITH input AS (
            SELECT generate_series(start_time, end_time, granularity) AS d
        ),
        latest_urns AS (
            SELECT DISTINCT ON (urn_id) ink, header_id, urn_id FROM maker.vat_urn_ink u LEFT JOIN public.headers h ON (h.id = u.header_id) ORDER BY urn_id, block_number DESC
        )
        SELECT input.d AS date, ilk_id, SUM(u.ink) AS ink, MAX(h.block_number) AS block_number, MAX(h.block_timestamp) AS block_timestamp FROM latest_urns u CROSS JOIN input LEFT JOIN maker.urns urns ON (urns.id = u.urn_id) LEFT JOIN public.headers h ON (h.id = u.header_id) WHERE h.block_timestamp < extract(epoch FROM (input.d + granularity)) GROUP BY input.d, ilk_id
    $$ language sql stable;