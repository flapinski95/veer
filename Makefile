KEYCLOAK_CONTAINER=veer-keycloak

EXPORT_PATH=/opt/services/keycloak/data/export

EXPORT_FILE=veer-realm.json

.PHONY: export-config

export-config:
	@echo "Exporting Keycloak configuration..."
	docker exec $(KEYCLOAK_CONTAINER) /opt/keycloak/bin/kc.sh export \
		--dir $(EXPORT_PATH) \
		--realm veer \
		--users realm_file
	@echo "Export completed! File is at $(EXPORT_PATH)/$(EXPORT_FILE) in the container."