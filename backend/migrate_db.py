import psycopg2

conn = psycopg2.connect("postgresql://om:RSuXLz2wZZJqNZ7-YsKXqg@silk-ninja-32317.j77.aws-us-east-1.cockroachlabs.cloud:26257/defaultdb?sslmode=require")
conn.autocommit = True
cur = conn.cursor()

migrations = [
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS current_title STRING DEFAULT '';",
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOL DEFAULT true;",
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();",
    "ALTER TABLE career_memories ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();",
    "ALTER TABLE skills ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();",
]

for m in migrations:
    try:
        cur.execute(m)
        print(f"Applied: {m}")
    except Exception as e:
        print(f"Note on '{m}': {e}")

print("All CockroachDB Cloud migrations completed!")
cur.close()
conn.close()
