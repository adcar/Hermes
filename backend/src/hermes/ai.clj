(ns hermes.ai
  (:require [clj-http.client :as http]
            [cheshire.core :as json]
            [environ.core :refer [env]]
            [hermes.db :as db]
            [clojure.tools.logging :as log]
            [clojure.string :as str])
  (:import [java.time LocalDate]
           [java.time.format DateTimeFormatter]))

(def openai-api-url "https://api.openai.com/v1/chat/completions")

(defn current-date-str
  "Get the current date as a formatted string"
  []
  (.format (LocalDate/now) (DateTimeFormatter/ofPattern "MMMM d, yyyy")))

(defn current-year
  "Get the current year"
  []
  (.getYear (LocalDate/now)))

(defn get-api-key []
  (or (env :openai-api-key)
      (throw (ex-info "OPENAI_API_KEY environment variable not set" {}))))

(defn call-openai
  "Call OpenAI API with messages"
  [messages & {:keys [model temperature max-tokens]
               :or {model "gpt-4o"
                    temperature 0.1
                    max-tokens 2000}}]
  (let [response (http/post openai-api-url
                            {:headers {"Authorization" (str "Bearer " (get-api-key))
                                       "Content-Type" "application/json"}
                             :body (json/generate-string
                                    {:model model
                                     :messages messages
                                     :temperature temperature
                                     :max_tokens max-tokens})
                             :as :json})]
    (get-in response [:body :choices 0 :message :content])))

(defn system-prompt
  "Generate the system prompt with current date context"
  []
  (str "You are a data analyst assistant that helps users query a PostgreSQL database using natural language.

CURRENT DATE: " (current-date-str) "
CURRENT YEAR: " (current-year) "

When users ask about 'this year', 'this month', 'today', etc., use the current date above as reference.
When they say 'last year', that means " (dec (current-year)) ".

Your job is to:
1. Understand the user's question about their business data
2. Generate a valid PostgreSQL query to answer it
3. Analyze the results and provide a helpful response
4. Suggest the best way to visualize the data

IMPORTANT RULES:
- Only generate SELECT queries - never INSERT, UPDATE, DELETE, DROP, etc.
- Always use proper SQL syntax for PostgreSQL
- Use appropriate aggregations, GROUP BY, ORDER BY as needed
- Limit results to 100 rows maximum unless specifically asked for more
- Format dates nicely in results when applicable
- Consider NULL values in your queries

When responding, use this JSON format:
{
  \"sql\": \"YOUR SQL QUERY HERE\",
  \"explanation\": \"Brief explanation of what the query does\",
  \"visualization\": \"chart\" | \"table\" | \"text\" | \"number\",
  \"chart_type\": \"bar\" | \"line\" | \"pie\" | \"area\" (only if visualization is 'chart'),
  \"x_axis\": \"column name for x axis\" (only if chart),
  \"y_axis\": \"column name for y axis\" (only if chart)
}

Visualization guidelines:
- Use 'number' for single value results (e.g., \"What's total revenue?\")
- Use 'chart' for time series or comparisons (e.g., \"Revenue by month\", \"Sales by category\")
- Use 'table' for detailed records or multiple columns (e.g., \"Show all orders from last week\")
- Use 'text' for complex answers that need explanation

Chart type guidelines:
- 'line' for time series data
- 'bar' for comparisons between categories
- 'pie' for showing proportions/percentages (use sparingly)
- 'area' for cumulative or stacked time series"))

(defn generate-sql-prompt
  "Generate the prompt for SQL generation"
  [schema question]
  [{:role "system" :content (system-prompt)}
   {:role "user" :content (str "Database Schema:\n\n" schema "\n\n---\n\nUser Question: " question)}])

(def analysis-system-prompt
  "You are a data analyst providing insights from query results.

Response format (JSON):
{
  \"show_answer\": true or false,
  \"answer\": \"Your natural language answer\",
  \"insights\": [\"Optional observations or patterns\"],
  \"follow_up_questions\": [\"Suggested follow-up questions\"]
}

CRITICAL RULE FOR show_answer:
Set show_answer to FALSE if your answer would list, enumerate, or describe the individual rows.
If you find yourself writing '1) X, 2) Y, 3) Z' or 'The top customers are A, B, C...' - that means show_answer must be FALSE.

show_answer = FALSE when:
- Answer would be a list/listicle of items from the results
- Answer repeats data visible in the table/chart
- Query is 'show me', 'list', 'top N', 'who are', 'what are' - these are self-explanatory
- The visualization already answers the question completely

show_answer = TRUE only when:
- Explaining something non-obvious or unexpected
- Results are empty and need explanation
- Answering a 'why' or 'how' question
- Important caveats the user should know

Guidelines:
- Format numbers nicely (use commas, currency symbols where appropriate)
- Put specific observations in the insights array
- Suggest 1-3 relevant follow-up questions")

(defn analyze-results-prompt
  "Generate prompt for analyzing query results"
  [question sql results visualization]
  [{:role "system" :content analysis-system-prompt}
   {:role "user" :content (str "Original Question: " question
                               "\n\nSQL Query Executed:\n" sql
                               "\n\nVisualization type: " visualization
                               "\n\nResults (first 50 rows):\n" (json/generate-string (take 50 results) {:pretty true})
                               "\n\nTotal rows: " (count results))}])

(defn parse-json-response
  "Parse JSON from AI response, handling markdown code blocks.
   If parsing fails and it looks like a clarification request, return a special response."
  [response]
  (try
    (let [;; First, try to extract content from ```json ... ``` code block
          code-block-match (re-find #"```json\s*([\s\S]*?)```" response)
          ;; If we found a code block, use its contents; otherwise use the full response
          content (if code-block-match
                    (second code-block-match)
                    response)
          ;; Clean up any remaining markdown and trim
          cleaned (-> content
                      (str/replace #"```\s*" "")
                      str/trim)
          ;; Try to find a JSON object - look for balanced braces starting with {"
          ;; This is more specific than just any curly brace
          json-match (re-find #"\{\"[\s\S]*\}" cleaned)
          final-str (or json-match cleaned)]
      (json/parse-string final-str true))
    (catch Exception e
      (log/warn "Failed to parse JSON response, treating as clarification:" response)
      ;; Return a clarification response instead of throwing
      {:needs_clarification true
       :message response})))

(defn process-question
  "Process a natural language question and return results"
  [question]
  (log/info "Processing question:" question)
  
  ;; Get schema for context
  (let [schema (db/get-schema-description)
        _ (log/info "Schema loaded, generating SQL...")
        
        ;; Generate SQL
        sql-response (call-openai (generate-sql-prompt schema question))
        _ (log/info "AI response:" sql-response)
        
        parsed (parse-json-response sql-response)]
    
    ;; Check if AI needs clarification
    (if (:needs_clarification parsed)
      {:success true
       :question question
       :answer (:message parsed)
       :visualization "text"
       :data []
       :row_count 0
       :insights []
       :follow_up_questions ["What specific data are you looking for?"
                             "Can you provide more details about your question?"
                             "Which metrics or entities are you interested in?"]}
      
      ;; Normal processing
      (let [sql (:sql parsed)
            _ (log/info "Generated SQL:" sql)]
        
        ;; Validate it's a SELECT query
        (when-not (str/starts-with? (str/upper-case (str/trim (or sql ""))) "SELECT")
          (throw (ex-info "Only SELECT queries are allowed" {:sql sql})))
        
        ;; Execute the query
        (let [query-result (db/run-query sql)]
          (if (:success query-result)
            (let [results (:data query-result)
                  _ (log/info "Query returned" (count results) "rows")
                  
                  ;; Analyze results
                  visualization (:visualization parsed)
                  analysis-response (call-openai (analyze-results-prompt question sql results visualization))
                  analysis (parse-json-response analysis-response)
                  ;; Handle case where analysis also needs clarification
                  answer (if (:needs_clarification analysis)
                           (:message analysis)
                           (:answer analysis))]
              
              {:success true
               :question question
               :sql sql
               :explanation (:explanation parsed)
               :visualization visualization
               :chart_type (:chart_type parsed)
               :x_axis (:x_axis parsed)
               :y_axis (:y_axis parsed)
               :data results
               :row_count (count results)
               :answer answer
               :show_answer (if (contains? analysis :show_answer)
                              (:show_answer analysis)
                              true)
               :insights (or (:insights analysis) [])
               :follow_up_questions (or (:follow_up_questions analysis) [])})
            
            ;; Query failed - try to fix it
            (do
              (log/warn "Query failed, returning error")
              {:success false
               :question question
               :sql sql
               :error (:error query-result)})))))))

