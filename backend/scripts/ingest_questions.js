/**
 * Bulk Question Ingestion Script for SARJOM EXAM
 * Usage: node ingest_questions.js <path_to_json_file>
 */
const fs = require('fs');
const path = require('path');

const filePath = process.argv[2];
if (!filePath) {
  console.log("Usage: node ingest_questions.js <questions.json>");
  process.exit(1);
}

const raw = fs.readFileSync(path.resolve(filePath), 'utf-8');
const questions = JSON.parse(raw);

console.log(`Ready to ingest ${questions.length} questions into SARJOM database...`);
