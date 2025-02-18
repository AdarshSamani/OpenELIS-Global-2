#!/bin/bash

# Path to JaCoCo XML Report
JACOCO_XML="target/jacoco-reports/jacoco.xml"

# Extract total coverage from XML
TOTAL_COVERAGE=$(grep -oP '(?<=<counter type="INSTRUCTION" missed=")[0-9]+' "$JACOCO_XML" | awk '
{
    missed+=$1;
}
END {
    printf "%d\n", missed
}')


TOTAL_HITS=$(grep -oP '(?<=<counter type="INSTRUCTION" covered=")[0-9]+' "$JACOCO_XML" | awk '
{
    covered+=$1;
}
END {
    printf "%d\n", covered
}')

# Calculate total coverage percentage
TOTAL=$(($TOTAL_COVERAGE + $TOTAL_HITS))

if [ "$TOTAL" -eq 0 ]; then
    COVERAGE_PERCENT=0
else
    COVERAGE_PERCENT=$(echo "scale=2; ($TOTAL_HITS / $TOTAL) * 100" | bc)
fi

# Create jacoco.csv with total coverage
echo "Total Integration Test Coverage,${COVERAGE_PERCENT}%" > jacoco.csv

# Move the CSV file to coverage-reports directory
mkdir -p coverage-reports
mv jacoco.csv coverage-reports/jacoco.csv

# Print result
echo "Total Integration Test Coverage: ${COVERAGE_PERCENT}% (Saved in coverage-reports/jacoco.csv)"
