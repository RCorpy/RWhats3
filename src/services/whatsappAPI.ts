import { useUserStore } from '../stores/userStore';

// src/services/whatsappApi.ts
export const sendMessage = async (to: string, message: string) => {
  const { accessToken } = useUserStore.getState().user!;
  const phoneNumberId = "1234567890";

  await fetch(`https://graph.facebook.com/v18.0/${phoneNumberId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body: message },
    }),
  });
};
