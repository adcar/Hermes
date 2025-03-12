(ns hermes.core
  (:require [ring.adapter.jetty :as jetty]
            [hermes.api :as api]
            [hermes.db :as db]
            [clojure.tools.logging :as log]
            [environ.core :refer [env]])
  (:gen-class))

(defonce server (atom nil))

(defn start-server
  "Start the web server on the specified port"
  [port]
  (log/info "Starting Hermes server on port" port)
  (reset! server
          (jetty/run-jetty #'api/app
                           {:port port
                            :join? false})))

(defn stop-server
  "Stop the running server"
  []
  (when @server
    (log/info "Stopping Hermes server")
    (.stop @server)
    (reset! server nil)))

(defn -main
  "Main entry point"
  [& args]
  (let [port (Integer/parseInt (or (env :port) "3001"))]
    (log/info "Initializing database connection...")
    (db/init-pool!)
    (log/info "Database connection initialized")
    (start-server port)
    (log/info (str "Hermes is running at http://localhost:" port))
    (.addShutdownHook (Runtime/getRuntime)
                      (Thread. (fn []
                                 (log/info "Shutting down...")
                                 (stop-server)
                                 (db/close-pool!))))))

