-- Average fetch time
SELECT
  AVG(f.time) AS average
FROM
  fetch_events f;

-- Most expensive fetch calls
SELECT
  f.time,
  f.url,
  f.method
FROM
  fetch_events f
ORDER BY
  f.time DESC
LIMIT
  10;

-- Average fetch time per url
SELECT
  AVG(f.time) AS average,
  f.url,
  f.method
FROM
  fetch_events f
GROUP BY
  f.url,
  f.method
ORDER BY
  average DESC
LIMIT
  10;

-- Most called fetch urls and their average
SELECT
  AVG(f.time) AS average,
  f.url,
  f.method
FROM
  fetch_events f
GROUP BY
  f.url,
  f.method
ORDER BY
  average DESC
LIMIT
  10;