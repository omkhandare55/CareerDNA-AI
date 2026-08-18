import psycopg2

conn = psycopg2.connect("postgresql://om:RSuXLz2wZZJqNZ7-YsKXqg@silk-ninja-32317.j77.aws-us-east-1.cockroachlabs.cloud:26257/defaultdb?sslmode=require")
cur = conn.cursor()

cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';")
tables = [r[0] for r in cur.fetchall()]
print(f"Verified CockroachDB Cloud Tables ({len(tables)}): {tables}")

# Check Vector Index
cur.execute("SELECT index_name, table_name FROM information_schema.statistics WHERE index_name LIKE '%vector%' OR index_name LIKE '%embedding%';")
indexes = cur.fetchall()
print(f"Verified HNSW Vector Indexes: {indexes}")

cur.close()
conn.close()
