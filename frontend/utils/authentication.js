import { displayErrorToast } from '@/utils/toast';

/**
 * Handle an unsuccessful signup response by displaying an error toast.
 *
 * By unsuccessful, we mean that the server didn't respond with a 4xx or 5xx status code.
 * We mean that the signup wasn't successful, i.e. the username was already taken, the password was too short, etc.
 *
 * @param {function} toast - The `useToast` hook from Chakra UI.
 * @param {object} data - The response data from the server.
 */
export function handleUnsuccessfulSignupResponse(toast, data) {
  let description = '';

  if (data.non_field_errors) {
    description = data.non_field_errors.map((v) => `* ${v}`).join('\n');
  } else {
    description = Object.values(data)
      .map((v) => `* ${v}`)
      .join('\n');
  }

  displayErrorToast(toast, description);
}

/**
 * Handle login response by setting the `isLoggedIn` state and saving the token to local storage.
 *
 * @param {function} setIsLoggedIn - The `useState` hook for managing the authentication state.
 * @param {function} toast - The `useToast` hook from Chakra UI.
 * @param {object} data - The response data from the server.
 */
export function handleLoginResponse(setIsLoggedIn, toast, data) {
  if (data.token) {
    localStorage.setItem('Authorization', `Token ${data.token}`);
    setIsLoggedIn(true);
  } else {
    displayErrorToast(toast, 'Invalid username or password.');
  }
}
