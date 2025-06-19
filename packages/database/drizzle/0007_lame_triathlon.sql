CREATE INDEX "search_index" ON "clubs" USING gin ((
				setweight(to_tsvector('english', "display_name"), 'A') ||
				setweight(to_tsvector('english', "subdomain"), 'B')
			));