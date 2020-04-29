/** Run these queries to set up vulcanize for custom queries **/

drop type if exists spot_poke_time_result;
create type spot_poke_time_result AS (
    date timestamptz,
    ilk_id int4,
    value numeric,
    block_number int8,
    block_timestamp numeric
);
create or replace function spot_poke_time(s date, e date, g interval)
    returns setof spot_poke_time_result as $$
        WITH input AS (
            SELECT generate_series(s, e, g) AS d
        ),
        ilk_values AS (
            SELECT input.d AS date, ilk_id, MAX(s.header_id) AS header_id FROM maker.spot_poke s CROSS JOIN input LEFT JOIN public.headers h ON (h.id = s.header_id) WHERE h.block_timestamp >= extract(epoch FROM input.d) AND h.block_timestamp < extract(epoch FROM input.d) + 86400 GROUP BY input.d, ilk_id
        )
        SELECT i.date, i.ilk_id, s.value, h.block_number, h.block_timestamp FROM ilk_values i LEFT JOIN maker.spot_poke s ON (s.header_id = i.header_id AND s.ilk_id = i.ilk_id) LEFT JOIN public.headers h ON (h.id = s.header_id)
    $$ language sql stable;