mkdir .nyc_output
mkdir nyc-coverage-report
yarn run test:coverage
yarn run test:coverage-report:json
SUMMARY=$(cat nyc-coverage-report/coverage-summary.json)
RESULTS=$(node -pe 'JSON.parse(process.argv[1]).total.lines.pct' "$SUMMARY")
echo "Total Test Coverage: $RESULTS% ✨"
