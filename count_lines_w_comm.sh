#!/bin/bash

# Specify the file extensions
file_extensions=("*.js" "*.css" "*.html")

# Create a temporary file to store lines
temp_file=$(mktemp)

# Find and filter files
for ext in "${file_extensions[@]}"; do
    find . -type f -name "$ext" -print0 | while IFS= read -r -d '' file; do
        # Append all lines (including comments) except empty lines to the temporary file
        grep -vE '^\s*$' "$file" >> "$temp_file"
    done
done

# Count the lines of code
line_count=$(wc -l < "$temp_file")

# Remove the temporary file
rm "$temp_file"

echo "Total lines of code (including comments but excluding empty lines): $line_count"
