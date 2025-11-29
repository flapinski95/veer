KEYCLOAK_CONTAINER=veer-keycloak
EXPORT_DIR=/opt/keycloak/import
EXPORT_FILE=veer-realm.json

.PHONY: export-config import-config

export-config:
	@echo "🚀 Exporting Keycloak realm configuration..."
	docker exec $(KEYCLOAK_CONTAINER) mkdir -p $(EXPORT_DIR)
	docker exec $(KEYCLOAK_CONTAINER) /opt/keycloak/bin/kc.sh export \
		--dir $(EXPORT_DIR) \
		--realm veer \
		--users realm_file
	@echo "✅ Export completed! Check services/keycloak/export/$(EXPORT_FILE)"

import-config:
	@echo "📥 Importing Keycloak realm configuration..."
	docker exec $(KEYCLOAK_CONTAINER) /opt/keycloak/bin/kc.sh import \
		--dir $(EXPORT_DIR)
	@echo "✅ Import completed from services/keycloak/export/$(EXPORT_FILE)"