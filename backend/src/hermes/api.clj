(ns hermes.api
  (:require [reitit.ring :as ring]
            [ring.middleware.json :refer [wrap-json-body wrap-json-response]]
            [ring.middleware.cors :refer [wrap-cors]]
            [ring.util.response :as response]
            [hermes.db :as db]
            [hermes.ai :as ai]
            [clojure.tools.logging :as log]))

(defn health-handler
  "Health check endpoint"
  [_request]
  (response/response {:status "ok" :service "hermes"}))

(defn schema-handler
  "Returns the database schema for AI context"
  [_request]
  (try
    (let [schema (db/get-schema)]
      (response/response {:schema schema}))
    (catch Exception e
      (log/error e "Failed to get schema")
      (-> (response/response {:error "Failed to get database schema"})
          (response/status 500)))))

(defn query-handler
  "Handle natural language queries"
  [request]
  (let [body (:body request)
        question (get body "question")]
    (if (empty? question)
      (-> (response/response {:error "Question is required"})
          (response/status 400))
      (try
        (log/info "Processing question:" question)
        (let [result (ai/process-question question)]
          (response/response result))
        (catch Exception e
          (log/error e "Failed to process question:" question)
          (-> (response/response {:error (str "Failed to process question: " (.getMessage e))})
              (response/status 500)))))))

(defn tables-handler
  "Get list of tables in the database"
  [_request]
  (try
    (let [tables (db/get-tables)]
      (response/response {:tables tables}))
    (catch Exception e
      (log/error e "Failed to get tables")
      (-> (response/response {:error "Failed to get tables"})
          (response/status 500)))))

(def routes
  [["/api"
    ["/health" {:get health-handler}]
    ["/schema" {:get schema-handler}]
    ["/tables" {:get tables-handler}]
    ["/query" {:post query-handler}]]])

(def app
  (-> (ring/ring-handler
       (ring/router routes)
       (ring/create-default-handler))
      (wrap-json-body)
      (wrap-json-response)
      (wrap-cors :access-control-allow-origin [#".*"]
                 :access-control-allow-methods [:get :post :put :delete :options]
                 :access-control-allow-headers [:content-type :authorization])))

