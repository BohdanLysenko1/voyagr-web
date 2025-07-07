const BASE = process.env.NEXT_PUBLIC_API_URL!;

export const getDeals = async () => fetch(`${BASE}/deals`).then(r => r.json());