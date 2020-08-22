<template>
	<div role="tabpanel">
		<div class="options-section">
			<h5>{{ L`faqGetStartedQuestion` }}</h5>
			<p>{{ L`faqGetStartedAnswerA` }}</p>
			<p>{{ L`faqGetStartedAnswerB` }}</p>
			<p>{{ L`faqGetStartedAnswerC` }}</p>
			<p>{{ L`faqGetStartedAnswerD` }}</p>
		</div>
		<div class="options-section">
			<h5>{{ L`faqDisableScrobblingQuestion` }}</h5>
			<p>{{ L`faqDisableScrobblingAnswerA` }}</p>
			<p>{{ L`faqDisableScrobblingAnswerB` }}</p>
		</div>
		<div class="options-section">
			<h5>{{ L`faqTrackNotRecognizedQuestion` }}</h5>
			<p>{{ L`faqTrackNotRecognizedAnswerA` }}</p>
			<p>{{ L`faqTrackNotRecognizedAnswerB` }}</p>
		</div>
		<div class="options-section">
			<h5>{{ L`faqBandcampDomainsQuestion` }}</h5>
			<p>{{ L`faqBandcampDomainsAnswerA` }}</p>
			<p>{{ L`faqBandcampDomainsAnswerB` }}</p>
			<ol class="mb-3">
				<li>{{ L`faqBandcampDomainsAnswerB1` }}</li>
				<li>{{ L`faqBandcampDomainsAnswerB2` }}</li>
				<li>{{ L`faqBandcampDomainsAnswerB3` }}</li>
				<li>
					{{ L`faqBandcampDomainsAnswerB4` }}
					<a
						target="_blank"
						href="https://github.com/web-scrobbler/web-scrobbler/wiki/Custom-URL-patterns"
					>
						{{ L`learnMoreLabel` }}
					</a>
				</li>
			</ol>
		</div>
		<div class="options-section">
			<h5>{{ L`faqAddScrobblingQuestion` }}</h5>
			<p>{{ L`faqAddScrobblingAnswerA` }}</p>
			<a
				class="card-link"
				href="https://github.com/web-scrobbler/web-scrobbler/issues"
				target="_blank"
			>
				{{ L`buttonOpenIssues` }}
			</a>
			<a
				class="card-link"
				href="https://github.com/web-scrobbler/web-scrobbler"
				target="_blank"
			>
				{{ L`buttonForkProject` }}
			</a>
		</div>
		<div class="options-section">
			<h5>{{ L`faqWhoIsAuthorQuestion` }}</h5>
			<p>{{ L`faqWhoIsAuthorAnwserA` }}</p>
		</div>
	</div>
</template>
