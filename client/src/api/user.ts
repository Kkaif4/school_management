export async function updateUserProfile(userId: string, payload: any) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to update user profile: ${res.statusText}`);
    }

    return await res.json();
  } catch (err) {
    console.error('API updateUserProfile error:', err);
    throw err;
  }
}
