
CREATE OR REPLACE FUNCTION increment(row_id UUID, table_name TEXT, column_name TEXT)
RETURNS INTEGER AS $$
DECLARE
   current_value INTEGER;
BEGIN
   EXECUTE format('SELECT %I FROM %I WHERE id = $1', column_name, table_name)
   INTO current_value
   USING row_id;

   IF current_value IS NULL THEN
      current_value := 0;
   END IF;

   RETURN current_value + 1;
END;
$$ LANGUAGE plpgsql;
