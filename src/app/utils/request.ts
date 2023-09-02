import { isEmpty } from './helpers';

class FetchWrapper {
  constructor() {
    this.reqInterceptors = [];
    this.resInterceptors = [];
  }

  get(path, opts) {
    return this.perform('GET', path, null, opts);
  }
  post(path, data, opts) {
    return this.perform('POST', path, data, opts);
  }
  put(path, data, opts) {
    return this.perform('PUT', path, data, opts);
  }
  patch(path, data, opts) {
    return this.perform('PATCH', path, data, opts);
  }
  delete(path, opts) {
    return this.perform('DELETE', path, null, opts);
  }

  async perform(method, path, data, extraOpts = {}) {
    const opts = { method, ...extraOpts };

    opts.headers ||= {};

    if (!isEmpty(data)) {
      opts.body = JSON.stringify(data);
      opts.headers['Content-Type'] = 'application/json';
    }

    for (const interceptor of this.reqInterceptors) {
      interceptor(opts);
    }

    let url = path;
    const isRelativeUrl = /^\/(?!\/)|^(?!(http:\/\/|https:\/\/))/.test(url);

    if (isRelativeUrl && process.env.NEXT_PUBLIC_API_URL) {
      url = `${process.env.NEXT_PUBLIC_API_URL}${path}`;
    }

    const resp = await fetch(url, opts);

    for (const interceptor of this.resInterceptors) {
      interceptor(resp);
    }

    const json = await resp.json();
    return { status: resp.status, data: json };
  }
  reqInterceptor(fn) {
    this.reqInterceptors.push(fn);
  }
  resInterceptor(fn) {
    this.resInterceptors.push(fn);
  }
}

export const request = new FetchWrapper();
