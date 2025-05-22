
docker run --name postgres-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_DB=faculty_hub_db \
  -v postgres-data:/var/lib/postgresql/data \
  -p 127.0.0.1:5432:5432 \
  -d postgres