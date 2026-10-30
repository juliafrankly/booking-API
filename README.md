# Booking API

REST API för bokningar byggt med Node.js, Express och PostgreSQL.

## Krav

- Node.js
- Docker Desktop (används för att starta PostgreSQL)

## Kom igång

### 1. Starta PostgreSQL med Docker

Databasen körs på **port 5433** på värddatorn (5432 inuti containern), för att undvika krock med en eventuell lokal PostgreSQL-installation.

```bash
docker run --name booking-postgres -e POSTGRES_USER=bookinguser -e POSTGRES_PASSWORD=bookingpassword -e POSTGRES_DB=bookingdb -p 5433:5432 -d postgres
```

Starta containern igen vid behov med `docker start booking-postgres`.

### 2. Installera beroenden

```bash
npm install
```

### 3. Skapa `.env`

Kopiera `.env.example` till `.env` och fyll i dina värden:

```
PORT=3000
INSTANCE_NAME=api-1
DB_HOST=localhost
DB_PORT=5433
DB_NAME=bookingdb
DB_USER=bookinguser
DB_PASSWORD=bookingpassword
```

`.env` ligger i `.gitignore` och ska aldrig committas.

### 4. Starta servern

```bash
npm start
```

Tabellen `bookings` skapas automatiskt vid start om den inte redan finns.

## Köra flera instanser

Porten och instansnamnet styrs med miljövariabler, så samma kod kan startas flera gånger (en instans per terminal):

```bash
PORT=3001 INSTANCE_NAME=api-1 npm start
PORT=3002 INSTANCE_NAME=api-2 npm start
```

Alla instanser delar samma databas.

## Miljövariabler

| Variabel        | Beskrivning                     |
|-----------------|---------------------------------|
| `PORT`          | Port som servern lyssnar på     |
| `INSTANCE_NAME` | Namn på den körande instansen   |
| `DB_HOST`       | Databasens värd                 |
| `DB_PORT`       | Databasens port (här 5433)      |
| `DB_NAME`       | Databasens namn                 |
| `DB_USER`       | Databasanvändare                |
| `DB_PASSWORD`   | Databaslösenord                 |

## Endpoints

| Metod  | Path             | Beskrivning                  | Statuskod        |
|--------|------------------|------------------------------|------------------|
| GET    | /bookings        | Hämta alla bokningar         | 200              |
| GET    | /bookings/{id}   | Hämta en bokning             | 200, 404         |
| POST   | /bookings        | Skapa en bokning             | 201, 400         |
| PUT    | /bookings/{id}   | Uppdatera en bokning         | 200, 400, 404    |
| DELETE | /bookings/{id}   | Ta bort en bokning           | 204, 404         |
| GET    | /instance        | Visa vilken instans som svarar | 200            |

Ogiltigt id eller ogiltig data ger 400.

## Bokningsobjekt

```json
{
  "name": "Anna Svensson",
  "email": "anna@example.com",
  "date_time": "2026-11-15T18:00:00Z",
  "number_of_people": 4,
  "status": "PENDING"
}
```

`status` kan vara `PENDING`, `CONFIRMED` eller `CANCELLED` (standard: `PENDING`). `PUT` kräver att alla fält skickas med.

## Exempel

```bash
curl localhost:3000/instance

curl -X POST localhost:3000/bookings -H "Content-Type: application/json" \
  -d '{"name":"Anna Svensson","email":"anna@example.com","date_time":"2026-11-15T18:00:00Z","number_of_people":4}'

curl localhost:3000/bookings
curl localhost:3000/bookings/1
curl -X DELETE localhost:3000/bookings/1
```