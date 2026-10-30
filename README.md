# Booking API

REST API för bokningar byggt med Node.js, Express och PostgreSQL.

## Kom igång

1. Starta PostgreSQL (Docker):
   ```bash
   docker run --name booking-postgres \
     -e POSTGRES_USER=bookinguser \
     -e POSTGRES_PASSWORD=bookingpassword \
     -e POSTGRES_DB=bookingdb \
     -p 5432:5432 -d postgres
   ```
2. Installera beroenden: `npm install`
3. Kopiera `.env.example` till `.env` och fyll i dina värden.
4. Starta: `npm start`

Flera instanser:
```bash
PORT=3001 INSTANCE_NAME=api-1 npm start
PORT=3002 INSTANCE_NAME=api-2 npm start
```

## Endpoints

| Metod  | Path             | Beskrivning          |
|--------|------------------|----------------------|
| GET    | /bookings        | Hämta alla           |
| GET    | /bookings/{id}   | Hämta en             |
| POST   | /bookings        | Skapa (201)          |
| PUT    | /bookings/{id}   | Uppdatera            |
| DELETE | /bookings/{id}   | Ta bort (204)        |
| GET    | /instance        | Vilken instans svarar|

Exempel-body:
```json
{
  "name": "Anna Svensson",
  "email": "anna@example.com",
  "date_time": "2026-11-15T18:00:00Z",
  "number_of_people": 4,
  "status": "PENDING"
}
```