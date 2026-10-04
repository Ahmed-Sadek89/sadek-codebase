# PostgreSQL on Windows: Manage DB, Tables & Relations

A practical beginner guide for running **PostgreSQL (pgsql)** natively on **Windows**, creating databases, designing **tables**, and modeling **relations**.
Useful before you connect NestJS (Prisma/TypeORM) to a real database.

Related Nest docs:

- [Beginner NestJS guide](./nestjs-beginner-guide.md)
- [Model, Service & Controller](./learn-model-service-controller.md)

---

## 1. What you are managing


| Piece                 | Meaning                                           |
| --------------------- | ------------------------------------------------- |
| **PostgreSQL server** | The database engine running as a Windows service  |
| **Database**          | A named container for your app data (`notes_app`) |
| **Schema**            | Namespace inside a DB (default is `public`)       |
| **Table**             | Rows + columns (like a spreadsheet with rules)    |
| **Row**               | One record                                        |
| **Column**            | One field (`id`, `title`, …)                      |
| **Relation**          | How tables link (via foreign keys)                |
| **psql**              | Official CLI client for PostgreSQL                |
| **pgAdmin**           | Official GUI client, installed alongside Postgres |


Typical Nest flow later:

```
Nest Service → Prisma/TypeORM → PostgreSQL tables
```

This file focuses on the **PostgreSQL + Windows** side.

---



## 2. Install PostgreSQL on Windows



### Option A — Official installer (recommended for beginners)

1. Download the installer from [postgresql.org/download/windows](https://www.postgresql.org/download/windows/) (EDB installer).
2. Run it and keep the defaults, except note down:
  - **Installation directory** (default: `C:\Program Files\PostgreSQL\<version>`)
  - **Data directory** (default: `C:\Program Files\PostgreSQL\<version>\data`)
  - **Password for the** `postgres` **superuser** — remember this
  - **Port** (default: `5432`)
3. Leave **Stack Builder** unchecked unless you need extra tools.
4. The installer registers PostgreSQL as a **Windows service** and adds `psql`/`pg_dump`/etc. to a `bin` folder.



### Option B — winget (Windows Package Manager)

```powershell
winget install PostgreSQL.PostgreSQL
```



### Add `psql` to PATH (if not already added)

Add this folder to your Windows `PATH` environment variable (adjust version number):

```text
C:\Program Files\PostgreSQL\16\bin
```

Then open a **new** terminal and check:

```powershell
psql --version
```

---



## 3. Start / stop / status (service management)

On Windows, PostgreSQL runs as a background **Windows Service**, usually named `postgresql-x64-16` (version number varies).

### Using the Services app (GUI)

1. Press `Win + R`, type `services.msc`, press Enter.
2. Find **postgresql-x64-16** in the list.
3. Right-click → **Start / Stop / Restart**.
4. Set **Startup type** to `Automatic` so it starts on boot.



### Using PowerShell / Command Prompt (as Administrator)

```powershell
# status
Get-Service postgresql-x64-16

# start
net start postgresql-x64-16

# stop
net stop postgresql-x64-16

# restart
net stop postgresql-x64-16
net start postgresql-x64-16
```

Confirm it's listening on the default port `5432`:

```powershell
netstat -ano | findstr 5432
# or, if pg_isready is on PATH
pg_isready
```

---



## 4. First login: the `postgres` superuser

Unlike Linux, Windows has no OS-level `postgres` user trick — you log in with the **database role** `postgres` and the password you set during install.

```powershell
psql -U postgres
```

It will prompt for the password you set at install time. You should see:

```text
postgres=#
```

Useful meta-commands inside `psql`:


| Command           | What it does                     |
| ----------------- | -------------------------------- |
| `\l`              | List databases                   |
| `\c dbname`       | Connect to a database            |
| `\dt`             | List tables                      |
| `\d table_name`   | Describe a table (columns, keys) |
| `\du`             | List roles/users                 |
| `\q`              | Quit                             |
| `\?`              | Help for psql commands           |
| `\h CREATE TABLE` | SQL help for a statement         |


**Tip:** you can also do all of this visually in **pgAdmin**, which installs alongside PostgreSQL and gives you a query tool, table designer, and ER-diagram-like tree view.

---



## 5. Create a role (user) and a database for your app



### Option A — `psql` (logged in as `postgres`)

```powershell
psql -U postgres
```

```sql
CREATE USER nestuser WITH PASSWORD 'strongpassword';
CREATE DATABASE notes_app OWNER nestuser;
GRANT ALL PRIVILEGES ON DATABASE notes_app TO nestuser;
```



### Option B — command-line helper tools

```powershell
createuser -U postgres --interactive nestuser
createdb -U postgres notes_app -O nestuser
```

For local learning on Windows, a simple password is fine. **Never commit real passwords** to git.

### Connect as your app user

```powershell
psql -h localhost -U nestuser -d notes_app
```

If it asks for a password and auth fails, see [Section 12: authentication on Windows (](#12-authentication-on-windows-pg_hbaconf)`pg_hba.conf`[)](#12-authentication-on-windows-pg_hbaconf).

---



## 6. Connection string (what Nest/Prisma will use)

Format:

```text
postgresql://USER:PASSWORD@HOST:PORT/DATABASE
```

Example:

```text
postgresql://nestuser:strongpassword@localhost:5432/notes_app
```

In a Nest project `.env`:

```env
DATABASE_URL="postgresql://nestuser:strongpassword@localhost:5432/notes_app?schema=public"
```

Add `.env` to `.gitignore`.

---



## 7. Tables: the basics

A table defines columns and constraints.

### Create a simple table

```sql
CREATE TABLE notes (
  id          SERIAL PRIMARY KEY,
  title       VARCHAR(200) NOT NULL,
  content     TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

What each part means:


| Piece           | Meaning                                |
| --------------- | -------------------------------------- |
| `SERIAL`        | Auto-increment integer (`1, 2, 3…`)    |
| `PRIMARY KEY`   | Unique identity of each row            |
| `VARCHAR(200)`  | Short string with max length           |
| `TEXT`          | Unlimited-ish text                     |
| `NOT NULL`      | Required value                         |
| `DEFAULT NOW()` | Fill automatically if omitted          |
| `TIMESTAMPTZ`   | Timestamp with time zone (recommended) |




### Inspect the table

```sql
\d notes
```



### Insert / read / update / delete

```sql
INSERT INTO notes (title, content)
VALUES ('Learn Nest', 'Controllers and services');

SELECT * FROM notes;

SELECT id, title FROM notes WHERE id = 1;

UPDATE notes
SET content = 'Updated content'
WHERE id = 1;

DELETE FROM notes WHERE id = 1;
```



### Change a table later (migrations mindset)

```sql
ALTER TABLE notes ADD COLUMN is_pinned BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE notes RENAME COLUMN content TO body;
ALTER TABLE notes DROP COLUMN is_pinned;
```

In real Nest apps, prefer **migrations** (Prisma Migrate / TypeORM migrations) over random manual `ALTER` in production. Manual SQL is great for learning.

### Drop a table

```sql
DROP TABLE notes;
-- or safely:
DROP TABLE IF EXISTS notes;
```

---



## 8. Keys and constraints (rules for clean data)


| Constraint    | Purpose                          |
| ------------- | -------------------------------- |
| `PRIMARY KEY` | Uniquely identifies a row        |
| `FOREIGN KEY` | Points to a row in another table |
| `UNIQUE`      | No duplicates in that column/set |
| `NOT NULL`    | Value required                   |
| `CHECK`       | Custom rule (`price >= 0`)       |
| `DEFAULT`     | Value when none provided         |


Example:

```sql
CREATE TABLE users (
  id         SERIAL PRIMARY KEY,
  email      VARCHAR(255) NOT NULL UNIQUE,
  name       VARCHAR(120) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---



## 9. Relations between tables

Relations answer: *“How do these records connect?”*

PostgreSQL expresses relations with **foreign keys**.

### 9.1 One-to-Many (most common)

One **user** has many **notes**.
Each note belongs to one user.

```
users (1) ──────< notes (many)
```

```sql
CREATE TABLE users (
  id    SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  name  VARCHAR(120) NOT NULL
);

CREATE TABLE notes (
  id         SERIAL PRIMARY KEY,
  title      VARCHAR(200) NOT NULL,
  content    TEXT NOT NULL,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notes_user_id ON notes(user_id);
```

Important parts:

- `user_id … REFERENCES users(id)` → foreign key
- `ON DELETE CASCADE` → if user is deleted, their notes are deleted too
- Index on `user_id` → faster lookups by user

Insert related data:

```sql
INSERT INTO users (email, name)
VALUES ('ahmed@example.com', 'Ahmed')
RETURNING id;

-- suppose returned id = 1
INSERT INTO notes (title, content, user_id)
VALUES ('My first note', 'Hello DB', 1);
```

Join query (read notes with author):

```sql
SELECT
  notes.id,
  notes.title,
  users.name AS author
FROM notes
JOIN users ON users.id = notes.user_id;
```

---



### 9.2 One-to-One

One **user** has one **profile**.

```
users (1) ────── (1) profiles
```

```sql
CREATE TABLE profiles (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  bio        TEXT,
  avatar_url TEXT
);
```

`UNIQUE` on `user_id` enforces **at most one** profile per user.

---



### 9.3 Many-to-Many

One **note** can have many **tags**, and one **tag** can belong to many **notes**.

You need a **join table** (also called pivot table):

```
notes (many) ──────< note_tags >────── (many) tags
```

```sql
CREATE TABLE tags (
  id   SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE note_tags (
  note_id INTEGER NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
  tag_id  INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (note_id, tag_id)
);
```

Attach tags:

```sql
INSERT INTO tags (name) VALUES ('nestjs'), ('postgres');

INSERT INTO note_tags (note_id, tag_id) VALUES (1, 1), (1, 2);
```

Query notes with tags:

```sql
SELECT
  notes.title,
  tags.name AS tag
FROM notes
JOIN note_tags ON note_tags.note_id = notes.id
JOIN tags ON tags.id = note_tags.tag_id
WHERE notes.id = 1;
```

---



## 10. Relation decision cheat sheet


| Real-world sentence                       | Relation     | How to model                            |
| ----------------------------------------- | ------------ | --------------------------------------- |
| A user has many notes                     | One-to-Many  | FK on the “many” side (`notes.user_id`) |
| A note belongs to one user                | Many-to-One  | Same as above (other direction)         |
| A user has one profile                    | One-to-One   | FK + `UNIQUE`                           |
| Notes have many tags / tags on many notes | Many-to-Many | Join table                              |


**Rule of thumb:**

- Put the foreign key on the **child / dependent** table for 1:N
- Use a **join table** for N:N
- Add `UNIQUE` on the FK for 1:1

---



## 11. Referential actions (`ON DELETE` / `ON UPDATE`)

When a parent row changes, what happens to children?


| Action                   | Meaning                                   |
| ------------------------ | ----------------------------------------- |
| `CASCADE`                | Also delete/update children               |
| `RESTRICT` / `NO ACTION` | Block parent delete if children exist     |
| `SET NULL`               | Set FK to `NULL` (column must allow null) |
| `SET DEFAULT`            | Set FK to its default                     |


Examples:

```sql
-- deleting a user deletes their notes
user_id INTEGER REFERENCES users(id) ON DELETE CASCADE

-- deleting a user is blocked while notes still exist
user_id INTEGER REFERENCES users(id) ON DELETE RESTRICT
```

Choose deliberately. For learning notes owned by users, `CASCADE` is common.

---



## 12. Authentication on Windows (`pg_hba.conf`)

If this fails:

```powershell
psql -h localhost -U nestuser -d notes_app
```

you may be hitting auth config.

PostgreSQL auth lives in `pg_hba.conf`, typically at:

```text
C:\Program Files\PostgreSQL\16\data\pg_hba.conf
```

Open it with a text editor **run as Administrator** (e.g. Notepad, VS Code). Common local lines:

```text
# TYPE  DATABASE  USER  ADDRESS         METHOD
host    all       all   127.0.0.1/32    scram-sha-256
host    all       all   ::1/128         scram-sha-256
```

After editing, reload the config — either:

```powershell
net stop postgresql-x64-16
net start postgresql-x64-16
```

or from inside `psql` (no restart needed):

```sql
SELECT pg_reload_conf();
```

Notes:

- On Windows there's no `peer` auth like on Linux, since there's no matching OS-user socket trick — you always authenticate with a **role name + password** over TCP.
- `-h localhost` is usually implicit but fine to include explicitly.
- Nest/Prisma should use `localhost` + password URL.

Set/reset a role password:

```sql
ALTER USER nestuser WITH PASSWORD 'strongpassword';
```

---



## 13. Useful day-to-day management commands

Run these from **PowerShell** or **Command Prompt** (with the PostgreSQL `bin` folder on PATH).

### Backup one database

```powershell
pg_dump -h localhost -U nestuser -d notes_app -F c -f notes_app.dump
```



### Restore

```powershell
pg_restore -h localhost -U nestuser -d notes_app --clean notes_app.dump
```

Plain SQL dump:

```powershell
pg_dump -h localhost -U nestuser -d notes_app > notes_app.sql
psql -h localhost -U nestuser -d notes_app -f notes_app.sql
```



### List databases / size

```sql
\l
SELECT pg_size_pretty(pg_database_size('notes_app'));
```



### Kill idle connections (sometimes useful)

```sql
SELECT pid, usename, state, query
FROM pg_stat_activity
WHERE datname = 'notes_app';
```

---



## 14. Practice lab (do this once)

Run PostgreSQL, then execute this script in `notes_app`:

```sql
DROP TABLE IF EXISTS note_tags;
DROP TABLE IF EXISTS notes;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS profiles;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id    SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  name  VARCHAR(120) NOT NULL
);

CREATE TABLE profiles (
  id      SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  bio     TEXT
);

CREATE TABLE notes (
  id      SERIAL PRIMARY KEY,
  title   VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE tags (
  id   SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE note_tags (
  note_id INTEGER NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
  tag_id  INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (note_id, tag_id)
);

INSERT INTO users (email, name) VALUES ('ahmed@example.com', 'Ahmed') RETURNING id;
INSERT INTO profiles (user_id, bio) VALUES (1, 'Learning Nest + Postgres');
INSERT INTO notes (title, content, user_id) VALUES
  ('Nest Controllers', 'Keep them thin', 1),
  ('Postgres FKs', 'Relations use foreign keys', 1);
INSERT INTO tags (name) VALUES ('nestjs'), ('sql');
INSERT INTO note_tags (note_id, tag_id) VALUES (1, 1), (2, 2), (2, 1);

-- verify joins
SELECT u.name, n.title, t.name AS tag
FROM users u
JOIN notes n ON n.user_id = u.id
LEFT JOIN note_tags nt ON nt.note_id = n.id
LEFT JOIN tags t ON t.id = nt.tag_id
ORDER BY n.id, t.name;
```

If that query returns rows with user, note titles, and tags, you understand enough relational modeling to use Prisma/TypeORM confidently.

**Tip:** you can paste this whole script into pgAdmin's Query Tool instead of `psql` if you prefer a GUI.

---



## 15. From raw SQL to Nest

Same relations in Prisma-style thinking:

```prisma
model User {
  id      Int      @id @default(autoincrement())
  email   String   @unique
  name    String
  profile Profile?
  notes   Note[]
}

model Profile {
  id     Int    @id @default(autoincrement())
  bio    String?
  userId Int    @unique
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Note {
  id      Int        @id @default(autoincrement())
  title   String
  content String
  userId  Int
  user    User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  tags    NoteTag[]
}

model Tag {
  id    Int       @id @default(autoincrement())
  name  String    @unique
  notes NoteTag[]
}

model NoteTag {
  noteId Int
  tagId  Int
  note   Note @relation(fields: [noteId], references: [id], onDelete: Cascade)
  tag    Tag  @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([noteId, tagId])
}
```

You do **not** need Prisma yet to learn tables. Knowing SQL relations first makes ORM schemas obvious.

---



## 16. Beginner checklist

- [ ] PostgreSQL installed on Windows
- [ ] I can start the `postgresql-x64-16` service and `pg_isready` succeeds
- [ ] I can enter `psql` and use `\l`, `\dt`, `\d`
- [ ] I created a user + database for my app
- [ ] I created a table with `PRIMARY KEY`
- [ ] I modeled a **one-to-many** with `REFERENCES`
- [ ] I modeled a **many-to-many** with a join table
- [ ] I can `SELECT` with `JOIN`
- [ ] I have a `DATABASE_URL` ready for Nest

---



## 17. Common Windows problems


| Problem                          | Likely fix                                                                                                          |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `connection refused` on `5432`   | Start the service via `services.msc` or `net start postgresql-x64-16`                                               |
| `password authentication failed` | Reset password; check `pg_hba.conf`; confirm role name/password                                                     |
| `psql` not recognized            | Add PostgreSQL's `bin` folder to your `PATH`, open a new terminal                                                   |
| Service won't start              | Check Windows Event Viewer → Application logs for the exact error                                                   |
| Port `5432` already in use       | Another Postgres instance or app is bound to it; check with `netstat -ano | findstr 5432`                           |
| Nest can't connect               | Confirm URL user/db/password/port; test with `psql` first                                                           |
| Permission denied on tables      | Connect to correct DB; check table owner/`GRANT`s                                                                   |
| Firewall blocking connections    | Allow the PostgreSQL service/port through Windows Defender Firewall (usually only needed for remote, not localhost) |


Grant example after creating tables as another role:

```sql
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO nestuser;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO nestuser;
```

---



## 18. Safe local habits

1. Use a **dedicated database per project** (`notes_app`, not your personal everything DB).
2. Keep credentials in `.env`, never in git.
3. Practice `ON DELETE` choices before enabling cascade in real apps.
4. Prefer migrations once you start Nest — treat raw SQL as learning and emergency tooling.
5. Take a dump before big experiments: `pg_dump …`.

---

