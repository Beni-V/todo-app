/**
 * Display an error toast with a custom description.
 *
 * @param {function} toast - The toast from `useToast` hook from Chakra UI.
 * @param {string} description - The description to display in the toast.
 */
export function displayErrorToast(toast, description) {
  toast({
    title: 'Error',
    description,
    status: 'error',
    duration: 2000,
    isClosable: true,
    position: 'top'
  });
}
