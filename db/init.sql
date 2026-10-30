CREATE TABLE IF NOT EXISTS bookings (
  id               SERIAL PRIMARY KEY,
  name             VARCHAR(100) NOT NULL,
  email            VARCHAR(255) NOT NULL,
  date_time        TIMESTAMPTZ  NOT NULL,
  number_of_people INTEGER      NOT NULL CHECK (number_of_people > 0),
  status           VARCHAR(20)  NOT NULL DEFAULT 'PENDING'
                   CHECK (status IN ('PENDING', 'CONFIRMED', 'CANCELLED')),
  created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);