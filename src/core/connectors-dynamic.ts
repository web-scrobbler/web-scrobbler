const metaHasContentRule = (name: string, content: string) => () =>
	Boolean(
		document.head.querySelector(
			`meta[name="${name}"][content="${content}"]`,
		),
	);

export const connectorRules = {
	funkwhale: metaHasContentRule('generator', 'Funkwhale'),
	bandcamp: metaHasContentRule('generator', 'Bandcamp'),
};
