export const SiteTitle = 'Random English Day';
export const AdminName = 'Ladit';
export const PageSize = 15;

// doc: https://giscus.app
// data-theme is auto changed between noborder_light / noborder_gray
export const GiscusConfig: Record<string, string> = {
	'data-repo': 'ladit/astro-blog-zozo',
	'data-repo-id': 'R_kgDOLgobXQ',
	'data-category': 'Announcements',
	'data-category-id': 'DIC_kwDOLgobXc4Cd_N6',
	'data-mapping': 'pathname',
	'data-strict': '0',
	'data-reactions-enabled': '1',
	'data-emit-metadata': '0',
	'data-input-position': 'top',
	'data-lang': 'zh-CN',
	'data-loading': 'lazy',
	crossorigin: 'anonymous',
	async: '',
};

export type HideElements =
	| 'logo'
	| 'search'
	| 'themeToggler'
	| 'siteDescription'
	| 'footerDescription';
// Always hide elements from site
export const Hide: HideElements[] = [];
