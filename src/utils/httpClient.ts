export const BASE_URL = `https://dewvdtfd5m.execute-api.eu-north-1.amazonaws.com/dev`;

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.text();

    throw new Error(
      `API error: ${response.status} ${response.statusText} - ${error}`,
    );
  }

  return response.json();
};

export const client = {
  get<T>(url: string): Promise<T> {
    return fetch(BASE_URL + url).then(handleResponse);
  },
  post<T>(url: string, body: unknown): Promise<T> {
    return fetch(BASE_URL + url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }).then(handleResponse);
  },
  put<T>(url: string, body: unknown): Promise<T> {
    return fetch(BASE_URL + url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }).then(handleResponse);
  },
  delete<T>(url: string): Promise<T> {
    return fetch(BASE_URL + url, {
      method: 'DELETE',
    }).then(handleResponse);
  },
};
