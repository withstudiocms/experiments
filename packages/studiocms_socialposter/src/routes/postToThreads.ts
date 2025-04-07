import { THREADS_ACCESS_TOKEN, THREADS_USER_ID } from 'astro:env/server';
import logger from 'studiocms:logger';
import { response } from '../utils/response.js';
import type { APIContext, APIRoute } from 'astro';
