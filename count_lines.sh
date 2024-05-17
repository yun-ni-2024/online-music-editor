#!/bin/bash

# Specify the file extensions
file_extensions=("*.js" "*.css" "*.html")

# Create a temporary file to store filtered lines
temp_file=$(mktemp)

# Find and filter files
for ext in "${file_extensions[@]}"; do
    find . -type f -name "$ext" -print0 | while IFS= read -r -d '' file; do
        # Filter out comments and empty lines, append to the temporary file
        case "$ext" in
            *.js)
                grep -vE '^\s*(//|/\*|\*)' "$file" | grep -vE '^\s*$' >> "$temp_file"
                ;;
            *.css)
                grep -vE '^\s*(/\*|\*)' "$file" | grep -vE '^\s*$' >> "$temp_file"
                ;;
            *.html)
                grep -vE '^\s*(<!--|-->)' "$file" | grep -vE '^\s*$' >> "$temp_file"
                ;;
        esac
    done
done

# Count the lines of code
line_count=$(wc -l < "$temp_file")

# Remove the temporary file
rm "$temp_file"

echo "Total lines of code (excluding comments and empty lines): $line_count"
