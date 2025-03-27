export const getVendorToken = async () => {
  const resp = await fetch(`https://api.frontegg.com/auth/vendor/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      clientId: process.env.FE_CLIENT_ID,
      secret: process.env.FE_API_KEY,
    }),
  });

  const data = await resp.json();
  return data.token;
};
