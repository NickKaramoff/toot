/*!
 * This file is part of Share₂Fedi
 * https://github.com/kytta/share2fedi
 *
 * SPDX-FileCopyrightText: © 2023 Nikita Karamov <me@kytta.dev>
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { getSoftwareName } from "@lib/nodeinfo";
import { type ProjectPublishConfig, supportedProjects } from "@lib/project";
import { error, json } from "@lib/response";
import type { APIRoute } from "astro";

export type Detection = {
	domain: string;
	project: keyof typeof supportedProjects;
} & ProjectPublishConfig;

export const GET: APIRoute = async ({ params }) => {
	const domain = params.domain as string;

	const softwareName = await getSoftwareName(domain);
	if (softwareName === undefined) {
		return error("Could not detect Fediverse project.");
	}

	if (!(softwareName in supportedProjects)) {
		return error(`Fediverse project "${softwareName}" is not supported yet.`);
	}

	const publishConfig = supportedProjects[softwareName] as ProjectPublishConfig;
	return json(
		{
			domain,
			project: softwareName,
			...publishConfig,
		},
		200,
		{
			"Cache-Control": "public, s-maxage=604800, max-age=604800",
		},
	);
};
