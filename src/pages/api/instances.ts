/*!
 * This file is part of Share₂Fedi
 * https://github.com/kytta/share2fedi
 *
 * SPDX-FileCopyrightText: © 2023 Nikita Karamov <me@kytta.dev>
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { APIRoute } from "astro";
import { getPopularInstanceDomains } from "@lib/instance";
import { json } from "@lib/response";

export const GET: APIRoute = async () => {
	const popularInstanceDomains = await getPopularInstanceDomains();

	return json(popularInstanceDomains, 200, {
		"Cache-Control":
			popularInstanceDomains.length > 0
				? "public, s-maxage=604800, max-age=604800"
				: "public, s-maxage=60, max-age=3600",
	});
};
