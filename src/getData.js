import axios from 'axios';
import parse from './parse.js';

export default (url) => {
  const baseUrl = new URL('https://allorigins.hexlet.app/get');
  baseUrl.searchParams.set('disableCache', 'true');
  baseUrl.searchParams.set('url', url);
  return axios.get(baseUrl.toString())
    .then((response) => parse(url, response));
};
