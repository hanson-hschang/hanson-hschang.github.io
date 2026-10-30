# Ordinary .md sources stay in content/; Persona processes a separate build copy.
SHELL := /usr/bin/env bash
ZOLA_ARGS ?=

.PHONY: build serve check clean

build:
	bash build.sh $(ZOLA_ARGS)

serve:
	bash serve.sh $(ZOLA_ARGS)

check:
	python3 -B themes/persona/scripts/persona.py check --root "$(CURDIR)" -- $(ZOLA_ARGS)

clean:
	python3 -B themes/persona/scripts/persona.py clean --root "$(CURDIR)"
