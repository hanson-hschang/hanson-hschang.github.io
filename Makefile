# Persona site build helpers.
#
# Targets:
#   make build  - preprocess citation sources, then run zola build
#   make serve  - preprocess citation sources, watch them, then run zola serve
#   make clean  - remove generated Markdown files produced from *.src.md

SHELL := /usr/bin/env bash

.PHONY: build serve clean

build:
	bash build.sh
	zola build

serve:
	bash serve.sh

clean:
	find content -name "*.src.md" -type f | while read -r src; do \
		out="$${src%.src.md}.md"; \
		if [ -f "$$out" ]; then \
			rm "$$out"; \
			echo "Removed $$out"; \
		fi; \
	done
