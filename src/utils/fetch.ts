/**
 * Data fetching procedure used anywhere.
 * moslty used with SWR hooks.
 */

interface IOPTGET {
  method?: 'GET' | 'DELETE';
  headers?: {
    token?: string;
    'Content-Type'?: string;
    'x-api-key'?: string;
  };
  signal?: AbortSignal;
}

interface IOPTPOST {
  method: 'POST' | 'PUT' | 'PATCH';
  headers?: {
    token?: string;
    'Content-Type'?: string;
    'x-api-key'?: string;
  };
  body?: string;
  signal?: AbortSignal;
}

/**
 * Get method can't have body, fetch would throw error if it's used.
 * this type seperation is therefore to prevent such an incident
 */
export type IOPT = IOPTGET | IOPTPOST;

function fetcher(url = '', opt: IOPT = {}): Promise<Response | undefined> {
  return fetch(url, opt).then(async function (response) {
    // TODO: If ever an revalidation method (like refresh-token) has implemented, apply here

    if (!response.ok) {
      throw response;
    }
    return response;
  });
}

export default fetcher;
