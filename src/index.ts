import { Probot } from "probot";

if (!process.env.ORGS_WHITELIST) throw Error("env var 'ORGS_WHITELIST' must be set");
const ORGS_WHITELIST = process.env.ORGS_WHITELIST.split(",");


function validateOrg(context: any) {
	const org = context.payload.organization?.login;
    if (!ORGS_WHITELIST.includes(org)) throw Error(`org '${org}' is not whitelisted`)
}

export = (app: Probot) => {

	app.onError(async (err) => {
		app.log.error(err.message);
	});

	/*
	- No se puede bloquear la instalación de una GitHub App
	- Se puede realizar una validación de si el request realizado a la App proviene de una org. whitelisteada
	- Para evitar llamar a la función `validateOrg` en cada handler se puede implementar una aplicación de Express: https://probot.github.io/docs/development/#use-createnodemiddleware
	*/

	app.on("issues.opened", async (context) => {
		validateOrg(context);

		const issueComment = context.issue({
		body: "Thanks for opening this issue!",
		});
		await context.octokit.issues.createComment(issueComment);
	});

	// For more information on building apps:
	// https://probot.github.io/docs/

	// To get your app running against GitHub, see:
	// https://probot.github.io/docs/development/
};
