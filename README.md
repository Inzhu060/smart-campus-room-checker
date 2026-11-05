# Smart Campus Room Availability Checker (Assignment #04)

Fictional campus room checker: 4 rooms, filters by capacity and equipment,
availability check for the selected room. No login, database or API.

## Structure
- `booking.py`, `test_booking.py`: Python reference logic `can_book()` and 28 unittest tests (from A3)
- `web/`: React + TypeScript + Tailwind page
  - `src/rooms.ts`: room catalog (fictional data)
  - `src/filters.ts`: capacity and equipment filters
  - `src/availability.ts`: validation and availability rules
  - `src/components/`: UI components
  - `src/*.test.ts(x)`: 37 Vitest tests

## Requirements
Python 3, Node.js (tested with v24) and npm.

## Run the Python tests
```
python -m unittest test_booking.py -v
```

## Run the web app
```
cd web
npm install
npm run dev
```
Open http://localhost:5173/

## Run the web tests and build
```
cd web
npm test
npm run build
```
`web/.npmrc` sets `legacy-peer-deps=true` (needed because of a TypeScript/typescript-eslint peer dependency conflict).

## Versions (git)
- `v-initial`: A3 Python version (`can_book` + 28 tests)
- `v-initial-web`: A3 web page from Bolt.new, recreated locally
- `master`: final version