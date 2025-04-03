(ns hermes.db
  (:require [next.jdbc :as jdbc]
            [next.jdbc.result-set :as rs]
            [environ.core :refer [env]]
            [clojure.tools.logging :as log]
            [clojure.string :as str]))

(defonce datasource (atom nil))

(defn parse-database-url
  "Parse DATABASE_URL into a db-spec map.
   Format: postgresql://user:password@host:port/dbname"
  [url]
  (let [uri (java.net.URI. url)
        [user password] (str/split (.getUserInfo uri) #":" 2)]
    {:dbtype "postgresql"
     :host (.getHost uri)
     :port (if (pos? (.getPort uri)) (.getPort uri) 5432)
     :dbname (subs (.getPath uri) 1) ; Remove leading /
     :user user
     :password password}))

(defn get-db-spec
  "Get database connection spec from environment.
   Supports DATABASE_URL (Railway/Heroku style) or individual env vars."
  []
  (if-let [database-url (env :database-url)]
    (parse-database-url database-url)
    {:dbtype "postgresql"
     :host (or (env :db-host) "localhost")
     :port (Integer/parseInt (or (env :db-port) "5432"))
     :dbname (or (env :db-name) "hermes")
     :user (or (env :db-user) "hermes")
     :password (or (env :db-password) "hermes")}))

(defn init-pool!
  "Initialize the connection pool"
  []
  (let [spec (get-db-spec)]
    (log/info "Connecting to database:" (:host spec) ":" (:port spec) "/" (:dbname spec))
    (reset! datasource (jdbc/get-datasource spec))))

(defn close-pool!
  "Close the connection pool"
  []
  (when @datasource
    (reset! datasource nil)))

(defn execute!
  "Execute a SQL statement"
  [sql-params]
  (jdbc/execute! @datasource sql-params
                 {:builder-fn rs/as-unqualified-lower-maps}))

(defn execute-one!
  "Execute a SQL statement and return single result"
  [sql-params]
  (jdbc/execute-one! @datasource sql-params
                     {:builder-fn rs/as-unqualified-lower-maps}))

(defn get-tables
  "Get list of tables in the database"
  []
  (let [result (execute! ["SELECT table_name 
                           FROM information_schema.tables 
                           WHERE table_schema = 'public' 
                           AND table_type = 'BASE TABLE'
                           ORDER BY table_name"])]
    (mapv :table_name result)))

(defn get-schema
  "Get detailed schema information for all tables"
  []
  (let [tables (get-tables)]
    (into {}
          (for [table tables]
            (let [columns (execute!
                           ["SELECT column_name, data_type, is_nullable, column_default
                             FROM information_schema.columns
                             WHERE table_schema = 'public' AND table_name = ?
                             ORDER BY ordinal_position" table])
                  pk (execute!
                      ["SELECT kcu.column_name
                        FROM information_schema.table_constraints tc
                        JOIN information_schema.key_column_usage kcu
                          ON tc.constraint_name = kcu.constraint_name
                        WHERE tc.table_schema = 'public'
                          AND tc.table_name = ?
                          AND tc.constraint_type = 'PRIMARY KEY'" table])
                  fks (execute!
                       ["SELECT kcu.column_name, ccu.table_name AS foreign_table, ccu.column_name AS foreign_column
                         FROM information_schema.table_constraints tc
                         JOIN information_schema.key_column_usage kcu
                           ON tc.constraint_name = kcu.constraint_name
                         JOIN information_schema.constraint_column_usage ccu
                           ON ccu.constraint_name = tc.constraint_name
                         WHERE tc.table_schema = 'public'
                           AND tc.table_name = ?
                           AND tc.constraint_type = 'FOREIGN KEY'" table])]
              [table {:columns columns
                      :primary_keys (mapv :column_name pk)
                      :foreign_keys fks}])))))

(defn get-schema-description
  "Get a text description of the schema for AI context"
  []
  (let [schema (get-schema)]
    (str/join "\n\n"
              (for [[table info] schema]
                (str "Table: " table "\n"
                     "Columns:\n"
                     (str/join "\n"
                               (for [col (:columns info)]
                                 (str "  - " (:column_name col) " (" (:data_type col) ")"
                                      (when (= (:is_nullable col) "NO") " NOT NULL"))))
                     (when (seq (:primary_keys info))
                       (str "\nPrimary Key: " (str/join ", " (:primary_keys info))))
                     (when (seq (:foreign_keys info))
                       (str "\nForeign Keys:\n"
                            (str/join "\n"
                                      (for [fk (:foreign_keys info)]
                                        (str "  - " (:column_name fk) " -> " (:foreign_table fk) "." (:foreign_column fk)))))))))))

(defn run-query
  "Run a SQL query and return results"
  [sql]
  (log/info "Executing SQL:" sql)
  (try
    (let [results (execute! [sql])]
      {:success true
       :data results
       :row_count (count results)})
    (catch Exception e
      (log/error e "SQL execution failed:" sql)
      {:success false
       :error (.getMessage e)})))

