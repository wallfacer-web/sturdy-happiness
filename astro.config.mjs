// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://wallfacer-web.github.io',
	base: '/sturdy-happiness',
	integrations: [
		starlight({
			title: '提示词工程',
			description: '面向教学、研究与实践的提示词工程课程门户。',
			customCss: ['./src/styles/custom.css'],
			social: [
				{
					icon: 'github',
					label: 'GitHub',
					href: 'https://github.com/wallfacer-web/sturdy-happiness',
				},
			],
			sidebar: [
				{
					label: '课程导览',
					items: [
						{ label: '课程介绍', slug: 'course-intro' },
						{ label: '课程总导航', slug: 'course-map' },
						{ label: '角色入口总览', slug: 'audience-entry' },
						{ label: '工作台总览', slug: 'workbench-overview' },
					],
				},
				{
					label: '角色入口',
					autogenerate: { directory: '10-角色入口' },
				},
				{
					label: '工作台',
					autogenerate: { directory: '20-工作台' },
				},
				{
					label: '知识卡片',
					autogenerate: { directory: '30-知识卡片' },
				},
				{
					label: '模板库',
					autogenerate: { directory: '40-模板' },
				},
				{
					label: '对象库',
					autogenerate: { directory: '50-对象库' },
				},
				{
					label: '课程运行',
					autogenerate: { directory: '60-课程运行' },
				},
			],
		}),
	],
});
