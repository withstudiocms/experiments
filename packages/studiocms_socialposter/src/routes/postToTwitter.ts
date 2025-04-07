import {
	TWITTER_ACCESS_SECRET,
	TWITTER_ACCESS_TOKEN,
	TWITTER_API_KEY,
	TWITTER_API_SECRET,
} from 'astro:env/server';
import logger from 'studiocms:logger';
import { response } from '../utils/response.js';
import type { APIContext, APIRoute } from 'astro';
