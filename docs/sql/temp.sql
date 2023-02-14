create or replace function bytea_import(p_path text, p_result out bytea) language plpgsql as $$
declare
  l_oid oid;
begin
  select lo_import(p_path) into l_oid;
  select lo_get(l_oid) INTO p_result;
  perform lo_unlink(l_oid);
end; $$;


CREATE TABLE payment_temp(
    transaction_id VARCHAR NOT NULL,
    screenshot bytea NOT NULL
);

INSERT INTO payment_temp(transaction_id, screenshot)
VALUES (
    '001', 
    bytea_import('/home/akash/Desktop/psql_images/img.png')::bytea
);