
import { toast } from 'sonner';

let toastPreferences = { showToasts: true, duration: 3000 };

// Function to update preferences from outside
export const setToastPreferences = (prefs: { showToasts: boolean; duration: number }) => {
  toastPreferences = prefs;
};

const showToastIfEnabled = (toastFn: () => void, fallbackMessage: string) => {
  if (toastPreferences.showToasts) {
    toastFn();
  } else {
    console.log(`Toast (disabled): ${fallbackMessage}`);
  }
};

export const successToast = (title: string, description?: string) => {
  showToastIfEnabled(
    () => toast.success(title, { 
      description,
      duration: toastPreferences.duration 
    }),
    `${title}${description ? ` - ${description}` : ''}`
  );
};

export const errorToast = (title: string, error: Error | string) => {
  const errorMessage = typeof error === 'string' ? error : error.message;
  showToastIfEnabled(
    () => toast.error(title, { 
      description: errorMessage,
      duration: toastPreferences.duration + 2000 // Errors stay longer
    }),
    `${title} - ${errorMessage}`
  );
};

export const warningToast = (title: string, description?: string) => {
  showToastIfEnabled(
    () => toast.warning(title, { 
      description,
      duration: toastPreferences.duration + 1000 
    }),
    `${title}${description ? ` - ${description}` : ''}`
  );
};

export const infoToast = (title: string, description?: string) => {
  showToastIfEnabled(
    () => toast(title, { 
      description,
      duration: toastPreferences.duration 
    }),
    `${title}${description ? ` - ${description}` : ''}`
  );
};

export const handleApiError = (error: any, fallbackMessage = 'An error occurred') => {
  console.error('API Error:', error);
  const errorMessage = error?.message || fallbackMessage;
  errorToast('Error', errorMessage);
  return errorMessage;
};
