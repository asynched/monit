-- Errors by device name
SELECT
  COUNT(e.id) AS errors,
  d.name
FROM
  error_events e
  INNER JOIN devices d ON e.device_id = d.id
GROUP BY
  d.name;

-- Errors by device type
SELECT
  COUNT(e.id) AS errors,
  d.type
FROM
  error_events e
  INNER JOIN devices d ON e.device_id = d.id
GROUP BY
  d.type;

-- Errors by filename
SELECT
  COUNT(e.id) AS errors,
  e.filename,
  e.line_number,
  e.column_number
FROM
  error_events e
GROUP BY
  e.filename;